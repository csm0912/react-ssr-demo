import React from "react";
import { StaticRouter } from "react-router-dom";
import { Provider, useStaticRendering } from "mobx-react";

import { JssProvider } from "react-jss";
import { MuiThemeProvider } from "@material-ui/core/styles";
import createGenerateClassName from "@material-ui/core/styles/createGenerateClassName";

// 让mobx在服务端渲染不会重复数据交换
useStaticRendering(true);

import App from "./views/app";
import { createStoreMap } from "./store/store";

export default (stores, routerContext, sheetsRegistry, jss, theme, url) => {
    jss.options.createGenerateClassName = createGenerateClassName;
    return (
        <Provider { ...stores }>
            <StaticRouter context={ routerContext } location={ url }>
                <JssProvider registry={ sheetsRegistry } jss={ jss }>
                    <MuiThemeProvider theme={ theme } sheetsManager={ new Map() }>
                        <App />
                    </MuiThemeProvider>
                </JssProvider>
            </StaticRouter>
        </Provider>
    )
}

export { createStoreMap }