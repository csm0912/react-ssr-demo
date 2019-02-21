import React, { Component } from 'react';
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import ToolBar from "@material-ui/core/Toolbar";
import IconButton from '@material-ui/core/IconButton';
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Home from "@material-ui/icons/Home";

const styles = {
    root: {
        width: "100%"
    },
    flex: {
        flex: 1
    }
}

class MainAppBar extends Component{
    constructor(props){
        super(props);
        this.onHomeIconClick = this.onHomeIconClick.bind(this);
        this.createButtonClick= this.createButtonClick.bind(this);
        this.loginButtonClick = this.loginButtonClick.bind(this);
    }
    onHomeIconClick(){

    }
    createButtonClick(){

    }
    loginButtonClick(){

    }
    render(){
        const { classes } = this.props;
        return (
            <div className={ classes.root }>
                <AppBar position="static">
                   <ToolBar>
                        <IconButton color="inherit">
                            <Home />
                        </IconButton>
                        <Typography type="title" color="inherit" className={ classes.flex }>
                            JNode
                        </Typography>
                        <Button raised="true" color="secondary" onClick={ this.createButtonClick() }>新建话题</Button>
                        <Button color="default" onClick={ this.loginButtonClick() }>登陆</Button>
                   </ToolBar>
                </AppBar>
            </div>
        )
    }
}

MainAppBar.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(MainAppBar)