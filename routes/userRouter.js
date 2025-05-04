const express = require("express");
const userController = require("../controllers/userController.js");

const userRouter = express.Router();
userRouter.get("/all", userController.getUsers);
 
module.exports = userRouter;