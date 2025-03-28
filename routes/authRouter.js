const express = require("express");
const authController = require("../controllers/authController.js");

const authRouter = express.Router();
authRouter.post("/api/login", authController.login);

authRouter.use(async function(req, response, next){
 //   debugger;
    let token = req.headers['authorization'];
    global.User = await authController.getUser(token);
    if (global.User)
    {
        next();
    }
    else
    {
        //response.redirect("api/login")
        response.status(401).send(`Operation not allowed`);
    }
});
 
module.exports = authRouter;