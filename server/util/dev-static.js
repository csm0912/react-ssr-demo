const axios = require("axios");
const path  = require("path");
const webpack= require("webpack");
const MemoryFs = require("memory-fs");
const proxy    = require("http-proxy-middleware");

const getTemplate = () => {
    return new Promise((resolve, reject) => {
        axios.get("http://localhost:8888/public/server.ejs").then(res => {
            resolve(res.data);
        }).catch(err => {
            reject(err);
        });
    });
}

const serverRender = require("./server-render");

const serverConfig = require( "../../build/webpack.config.server");
const mfs    = new MemoryFs();

const NativeModule = require("module");
const vm = require("vm");

const getModuleFromString = (bundle, filename) => {
    const m = { exports: {} };
    const wrapper = NativeModule.wrap(bundle);
    const script = new vm.Script(wrapper, {
        filename,
        displayErrors: true
    });
    const result = script.runInThisContext();
    result.call(m.exports, m.exports, require, m);
    return m;
}

const serverCompiler = webpack(serverConfig);
serverCompiler.outputFileSystem = mfs;
let serverBundle;
serverCompiler.watch({}, (err, stats) => {
    if(err) throw err;
    stats = stats.toJson();
    stats.errors.forEach(err => console.error(err));
    stats.warnings.forEach(warning => console.warn(warning));
    
    const bundlePath = path.join(
        serverConfig.output.path,
        serverConfig.output.filename
    );

    const bundle = mfs.readFileSync(bundlePath, "utf-8");
    const m = getModuleFromString(bundle, "server.entry.js");
    serverBundle = m.exports;
});

module.exports = function(app){
    app.use("/public", proxy({
        target: "http://localhost:8888"
    }));
    app.get("*", (req, res, next) => {
        getTemplate().then(template => {
           if(!serverBundle){
               res.send("waiting for compile, refresh later!")
           }
           return serverRender(serverBundle, template, req, res);
        }).catch(next);
    });
}