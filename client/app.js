import React from "react";
import ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "mobx-react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { lightBlue, pink } from "@material-ui/core/colors";

import App from "./views/app";
import { TopicStore } from "./store/store";

const initialState = window.__INITIAL__STATE__ || {};
const theme = createMuiTheme({
    typography: {
        useNextVariants: true,
    },
    palette: {
        primary: lightBlue,
        secondary: pink,
        type: "light"
    }
});

const topicStore = new TopicStore(initialState.topicStore||{});

const createApp = (App) => {
    class Main extends React.Component{
        componentDidMount() {
            const jss = document.getElementById("jss-server-side");
            if(jss && jss.parentNode){
                jss.parentNode.removeChild(jss);
            }
        }
        render(){
            return <App />
        }
    }
    return Main;
}

const root = document.getElementById("root");
const render = (Component) => {
    ReactDOM.hydrate(
        <AppContainer>
            <Provider topicStore={ topicStore }>
                <BrowserRouter>
                    <MuiThemeProvider theme={ theme }>
                        <Component />
                    </MuiThemeProvider>
                </BrowserRouter>
            </Provider>
        </AppContainer>,
        root
    );
}

render(createApp(App));

if(module.hot){
    module.hot.accept("./views/app", () => {
        const nextApp = require("./views/app").default;
        render(createApp(nextApp));
    });
}