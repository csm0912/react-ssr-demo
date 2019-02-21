const axios = require("axios");
const queryString = require("query-string");

const baseUrl = "https://cnodejs.org/api/v1";

module.exports = (req, res, next) => {
    const path = req.path;
    const user = req.session.user || {};
    const needAccessToken = req.query.needAccessToken;

    if(needAccessToken && !user.accessToken){
        res.status(401).send({
            success: false,
            msg: "need login"
        });
    }
    
    const query = Object.assign({}, req.query, {
        accesstoken: (needAccessToken && req.method==="GET") ? user.accessToken : ""
    });
    if(query.needAccessToken) delete query.needAccessToken;

    axios(`${baseUrl}${path}`, {
        method: req.method,
        params: query,
        data: queryString.stringify(Object.assign({}, req.body, {
            accesstoken: (needAccessToken && req.method==="POST") ? user.accessToken : ""
        })),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }).then(result => {
        if(result.status=="200"){
            res.send(result.data);
        }else {
            res.status(result.status).send(result.data);
        }
    }).catch(err => {
        if(err.response){
            res.send(500).send(err.response);
        }else {
            res.status(500).send({
                success: false,
                msg: "未知错误"
            });
        }
    })
}