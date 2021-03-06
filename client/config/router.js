import React from 'react';
import { Route, Redirect } from "react-router-dom";

import TopicList from "../views/topic-list";
import TopicDetail from "../views/topic-detail";

export default () => [
    <Route path="/" render={ () => <Redirect to="/list" />} exact key="/"/>,
    <Route path="/list" component={ TopicList } key="list" />,
    <Route path="/detail/:id" component={ TopicDetail } key="detail"/>
]