const express = require("express");
const stateController = require("../controllers/stateController.js");

const stateRouter = express.Router();
stateRouter.post("/", stateController.postState);
stateRouter.get("/all", stateController.getStates);
stateRouter.delete("/:id", stateController.deleteState);
 
module.exports = stateRouter;