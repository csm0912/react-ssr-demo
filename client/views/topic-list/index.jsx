import React, { Component } from 'react';
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { inject, observer } from "mobx-react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import List from "@material-ui/core/List";
import CircularProgress from "@material-ui/core/CircularProgress";
import queryString from "query-string";

import Container from "../layout/container";
import TopicListItem from "./list-item";
import { tabs } from "../../util/variable-define";

@inject(stores => {
    const { topicStore } = stores;
    return {
        topicStore
    }
}) @observer
class TopicList extends Component {
    constructor(props){
        super(props);
        this.changeTable = this.changeTable.bind(this);
        this.listItemClick= this.listItemClick.bind(this);
    }
    changeTable(e, value){
        this.props.history.push({
            pathname: "/list",
            search: `?tab=${value}`
        });
        this.props.topicStore.fetchTopics(value);
    }
    listItemClick(topicId){
        this.props.history.push(`/detail/${topicId}`);
    }
    getTab(){
        const query = queryString.parse(this.props.location.search);
        return query.tab || "all";
    }
    componentDidMount() {
        this.props.topicStore.fetchTopics(this.getTab());
    }
    bootstrap(){
        return this.props.topicStore.fetchTopics(this.getTab()).then(() => {
            return true
        }).catch(() => {
            return false
        });
    }
    render() {
        const { topicStore } = this.props;
        const tab = this.getTab();
        return (
            <Container>
                <Helmet>
                    <title>{ tabs[tab] }</title>
                </Helmet>
                <Tabs value={ tab } onChange={ this.changeTable }>
                    {
                        Object.keys(tabs).map(key=>{
                            return <Tab label={ tabs[key] } value={ key } key={ key } />
                        })
                    }
                </Tabs>
                <List>
                    {
                        topicStore.topics.map(topic=>{
                            return <TopicListItem onClick={ () => this.listItemClick(topic.id) } topic={ topic } key={ topic.id }></TopicListItem>
                        })
                    }
                </List>
                {
                    topicStore.syncing ? (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-around",
                                padding: 40
                            }}
                        >
                            <CircularProgress color="secondary" size={ 100 }/>
                        </div>
                    ) : null
                }
            </Container>
        );
    }
}

TopicList.wrappedComponent.propTypes = {
    topicStore: PropTypes.object.isRequired
}
 
export default TopicList;