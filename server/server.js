const express = require("express");
const bodyParser = require("body-parser");
const session    = require("express-session");
const fs   = require("fs");
const path = require("path");
const favicon = require("serve-favicon");

const serverRender = require("./util/server-render");

const app = express();

app.use(favicon(path.join(__dirname, "./favicon.ico")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    maxAge: 10*60*1000,
    name: "tid",
    resave: false,
    saveUninitialized: false,
    secret: "react ssr learning"
}));
app.use((error, req, res, next) => {
    res.status(500).send(error);
});

app.use("/api/user", require("./util/handle-login"));
app.use("/api", require("./util/proxy"));

const isDev = process.env.NODE_ENV==="development";

if(isDev){
    const devStatic = require("./util/dev-static");
    devStatic(app);
}else {
    const serverEntry = require("../dist/server.entry");
    const template = fs.readFileSync(path.join(__dirname, "../dist/server.ejs"), "utf-8");
    app.use("/public", express.static(path.join(__dirname, "../dist")));
    app.get("*", (req, res, next) => {
        serverRender(serverEntry, template, req, res).catch(next);
    });
}

app.listen(3333, () => {
    console.log("server is listening on 3333");
});