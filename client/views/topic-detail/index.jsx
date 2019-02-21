import React, { Component, PureComponent } from 'react';
import { inject, observer } from "mobx-react";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Helmet } from "react-helmet";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from "@material-ui/core/Avatar";
import { withStyles } from "@material-ui/core/styles";
import { tabs } from '../../util/variable-define';
import marked from "marked";
import dateFormat from "dateformat";
import { Link } from "react-router-dom";

import { detailStyle, detailContentStyle, replyStyle, replyContentStyle } from "./style";

@inject(stores=>{
    const { topicStore } = stores;
    return {
        topicStore
    }
}) @observer
class TopicDetail extends Component {
    constructor(props){
        super(props);
    }
    getTopicId(){
        return this.props.match.params.id;
    }
    componentDidMount(){
        const id = this.getTopicId();
        this.props.topicStore.fetchTopicDetail(id);
    }
    render() {
        const detail = this.props.topicStore.detailMap[this.getTopicId()];
        return (
            <div>
                {
                    detail ? (
                        <div>
                            <Helmet>
                                <title>{detail.title}</title>
                            </Helmet>
                            <ContainerDetailInfo topic={ detail } />
                            <ContainerReplyInfo topic={ detail } />
                        </div>
                    ) : (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-around",
                                padding: 40
                            }}
                        >
                            <CircularProgress color="secondary" size={ 100 }/>
                        </div>
                    )
                }
            </div>
        );
    }
}

const ContainerDetail = ({ classes, topic }) => (
    <Paper elevation={ 4 } className={ classes.root }>
        <ContentDetail topic={ topic } />
    </Paper>
)

const ContainerDetailInfo = withStyles(detailStyle)(ContainerDetail);

const Detail = ({ classes, topic }) => (
    <div>
        <div className={ classes.title }><span className={ classes.label }>{ topic.top ? "置顶" : "" }</span>{ topic.title }</div>
        <div className={ classes.publishInfo }>
            <span><label>发布时间</label>{ dateFormat(topic.create_at, "yyyy-mm-dd hh:mm:ss") }</span>
            <span><label>作者</label>{ topic.author.loginname }</span>
            <span>{ topic.visit_count }次浏览</span>
            <span><label>最后一次编辑时间</label>{ dateFormat(topic.last_reply_at, "yyyy-mm-dd hh:mm:ss") }</span>
            <span><label>来自</label><Link to={ `/list?tab=${topic.tab}` }>{ tabs[topic.tab] }</Link></span>
        </div>
        <div className={ classes.content }>
            <p dangerouslySetInnerHTML={{ __html: marked(topic.content.replace(/\r\n/g, "<br />")) }}></p>
        </div>
    </div>
)

const ContentDetail = withStyles(detailContentStyle)(Detail);

const TopicReply = ({ classes, topic }) => (
    <div>
        <div className={ classes.header }>{ topic.replies.length }回复</div>
        <List>
            {
                topic.replies.map((reply, index) => {
                    return <TopicReplyItem reply={ reply } key={ reply.id } index={ index+1 }/>
                })
            }
        </List>
    </div>
)

const TopicReplyInfo = withStyles(replyContentStyle)(TopicReply);

const TopicReplyItem = ({ reply, index }) => (
    <ListItem style={{ borderBottom: "1px solid #f0f0f0" }}>
        <Avatar src={ reply.author.avatar_url } />
        <ListItemText 
            primary={ <Primary reply={ reply } index={ index }/>}
            secondary={ <Secondary reply={ reply } />}
        />
    </ListItem>
)

const Primary = ({ reply, index }) => (
    <span>
        <span
            style={{
                fontSize: "12px"
            }}
        >{ reply.author.loginname }</span>
        <span
            style={{
                fontSize: "12px",
                color: "#005681",
                margin: "0 15px"
            }}
        >{ index }楼&nbsp;{ dateFormat(reply.create_at, "yyyy-mm-dd hh:mm:dd") }</span>
        {
            reply.ups.length>0 ? (
                <span
                    style={{
                        float: "right",
                        fontSize: "12px",
                        color: "#333"
                    }}
                >赞({ reply.ups.length })</span>
            ) : null
        }
    </span>
)
const Secondary = ({ reply }) => <span style={{ color: "#000" }} dangerouslySetInnerHTML={{ __html: marked(reply.content.replace(/\r\n/g, "<br />")) }}></span>

 
const ContainerReply = ({ classes, topic }) => (
    <Paper elevation={ 4 } className={ classes.root }>
        <TopicReplyInfo topic={ topic } />
    </Paper>
)

const ContainerReplyInfo = withStyles(replyStyle)(ContainerReply);

export default TopicDetail;