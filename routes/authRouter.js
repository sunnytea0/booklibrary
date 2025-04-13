const express = require("express");
const authController = require("../controllers/authController.js");

const authRouter = express.Router();
authRouter.post("/api/login", authController.login);
authRouter.post("/api/register", authController.register);

authRouter.use(async function(req, response, next){
//    debugger;
    const path = req.url;
    if (!path.startsWith("/api"))
    {
        global.user = {};
        next();
    }
    else
    {
        let token = req.headers['authorization'];
        global.user = await authController.getUser(token);
        if (global.user)
        {
            next();
        }
        else
        {
            //response.redirect("api/login")
            response.status(401).send(`Operation not allowed`);
        }
    }
});
 
module.exports = authRouter;