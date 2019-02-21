import { observable, action, extendObservable, computed, toJS } from "mobx";
import { get } from "../util/http";

import { topicSchema } from "../util/variable-define";

const createTopic = (topic) => {
    return Object.assign({}, topicSchema, topic);
}

class Topic{
    constructor(data){
        extendObservable(this, data);
    }
    @observable syncing = false;
}

class TopicStore{
    @observable topics;
    @observable details;
    @observable syncing;
    constructor({ syncing=false, topics=[], details=[] }={}){
        this.syncing = syncing;
        this.topics = topics.map(topic=>new Topic(createTopic(topic)));
        this.details= details;
    }
    @action addTopic(topic){
        this.topics.push(new Topic(createTopic(topic)));
    }
    @action fetchTopics(tab){
        return new Promise((resolve, reject) => {
            this.syncing = true;
            this.topics = [];
            get("/topics", {
                mdrender: false,
                tab
            }).then(res=>{
                if(res.success){
                    res.data.forEach(topic=>{
                        this.addTopic(topic);
                    });
                    resolve();
                }else{
                    reject(res.data);
                }
                this.syncing = false;
            }).catch(err=>{
                reject(err);
                this.syncing = false;
            })
        });
    }
    @action addDetail(detail){
        this.details.push(new Topic(createTopic(detail)));
    }
    @computed get detailMap(){
        return this.details.reduce((result, detail) => {
            result[detail.id] = detail;
            return result;
        }, {});
    }
    @action fetchTopicDetail(topicId){
        return new Promise((resolve, reject) => {
            if(this.detailMap[topicId]){
                resolve();
            }else {
                get(`/topic/${topicId}`, {
                    mdrender: false
                }).then(res => {
                    if(res.success){
                        this.addDetail(res.data);
                        resolve();
                    }else {
                        reject();
                    }
                }).catch(reject);
            }
        })
    }
    toJson(){
        return {
            topics: toJS(this.topics),
            details: toJS(this.details),
            syncing: this.syncing
        }
    }
}

export default TopicStore