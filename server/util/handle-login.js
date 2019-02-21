const router = require("express").Router();
const axois  = require("axios");

const baseUrl = "https://cnodejs.org/api/v1";

router.post("/login", (req, res, next) => {
    axois.post(`${baseUrl}/accesstoken`, {
        accesstoken: req.body.accessToken
    }).then(result => {
        if(result.status=="200" && result.data.success){
            req.session.user = {
                accessToken: req.body.accesstoken,
                loginName: result.data.loginname,
                id: result.data.id,
                avatarUrl: result.data.avatar_url
            };
            res.json({
                success: true,
                data: result.data
            });
        }
    }).catch(err => {
        if(err.response){
            res.json({
                success: false,
                data: err.response.data
            });
        }else {
            next(err);
        }
    })
});

module.exports = router;