const express = require("express");
const categoryController = require("../controllers/categoryController.js");

const categoryRouter = express.Router();
categoryRouter.post("/", categoryController.postCategory);
categoryRouter.get("/all", categoryController.getCategories);
categoryRouter.get("/byid/:id", categoryController.getCategoryById);
categoryRouter.get("/bybookid/:id", categoryController.getCategoryByBookId);
categoryRouter.delete("/:id", categoryController.deleteCategory);
 
module.exports = categoryRouter;