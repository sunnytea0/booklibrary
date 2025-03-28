const express = require("express");
const authorController = require("../controllers/authorController.js");

const authorRouter = express.Router();
authorRouter.post("/", authorController.postAuthor);
authorRouter.get("/all", authorController.getAuthors);
authorRouter.get("/byid/:id", authorController.getAuthorById);
authorRouter.delete("/:id", authorController.deleteAuthor);
 
module.exports = authorRouter;