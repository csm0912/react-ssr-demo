const ReactDOMServer = require("react-dom/server");
const asyncBootstrap = require("react-async-bootstrapper");
const ejs = require("ejs");
const serialize = require("serialize-javascript");
const Helmet = require("react-helmet").default;
const SheetsRegistry = require("react-jss").SheetsRegistry
const colors = require("@material-ui/core/colors")
const createMuiTheme = require("@material-ui/core/styles").createMuiTheme
const create = require("jss").create
const preset = require("jss-preset-default").default

const getStoreState = (stores) => {
    return Object.keys(stores).reduce((obj, storeName)=>{
        obj[storeName] = stores[storeName].toJson();
        return obj;
    }, {});
}

module.exports = (bundle, template, req, res) => {
    return new Promise((resolve, reject) => {
        const createStoreMap = bundle.createStoreMap;
        const createApp = bundle.default;
        const routerContext = {};
        const stores = createStoreMap();

        const theme = createMuiTheme({
            typography: {
                useNextVariants: true,
            },
            palette: {
              primary: colors.pink,
              secondary: colors.lightBlue,
              type: 'light',
            }
        });
        const sheetsRegistry = new SheetsRegistry()
        const jss = create(preset())

        const app = createApp(stores, routerContext, sheetsRegistry, jss, theme, req.url)
        asyncBootstrap(app).then(() => {
            if(routerContext.url){
                res.status(302).setHeader("Location", routerContext.url);
                res.end();
                return;
            }
            const helmet = Helmet.rewind();
            const state = getStoreState(stores);
            const content = ReactDOMServer.renderToString(app);

            const html = ejs.render(template, {
                appString: content,
                initialState: serialize(state),
                meta: helmet.meta.toString(),
                link: helmet.link.toString(),
                style: helmet.style.toString(),
                title: helmet.title.toString(),
                materialCss: sheetsRegistry.toString()
            });
            res.send(html);
            resolve(true);
        }).catch(reject);
    })
}