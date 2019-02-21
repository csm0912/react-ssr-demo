import React, { Component } from "react";
import Routes from "../config/router";
import { Link, withRouter } from "react-router-dom";

import AppBar from "./layout/app.bar";

class App extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return [
            <AppBar key="app-bar"/>,
            <Routes key="routes"/>
        ]
    }
}

export default withRouter(App)