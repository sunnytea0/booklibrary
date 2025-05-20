const express = require("express");
const bookController = require("../controllers/bookController.js");

const bookRouter = express.Router();
bookRouter.post("/", bookController.postBook);
bookRouter.get("/all", bookController.getBooks);
bookRouter.get("/filter/:search", bookController.getFilterBooks);
bookRouter.get("/byid/:id", bookController.getBookById);
bookRouter.get("/byauthor/:id", bookController.getBooksByAuthor);
bookRouter.get("/byuser/:id", bookController.getBooksByUser);
bookRouter.get("/bycategory/:id", bookController.getBooksByCategory);
bookRouter.post("/updatestate", bookController.updateState);
bookRouter.post("/addToCategory", bookController.addToCategory);
bookRouter.delete("/deleteFromCategory/:bookId/:categoryId", bookController.deleteFromCategory);
bookRouter.post("/setContent", bookController.setContent);
bookRouter.delete("/:id", bookController.deleteBook);
 
module.exports = bookRouter;