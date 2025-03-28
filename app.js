const express = require("express");
//const mysql = require("mysql2");
// create app
const app = express();
//const authorController = require("./controllers/authorController.js");
const authorRouter = require("./routes/authorRouter.js");
const stateRouter = require("./routes/stateRouter.js");
const categoryRouter = require("./routes/categoryRouter.js");
const authRouter = require("./routes/authRouter.js");

// const connectionOption = {
//     host: "localhost",
//     user: "root",
//     database: "booklib",
//     connectTimeout: 120000,
//     password: "Errerr777"
// };

app.use(express.static("styles"));
app.use(express.static("scripts"));
//const jsonParser = express.json();
app.use(express.json()); 

// const authorRouter = express.Router();
// authorRouter.post("/", authorController.postAuthor);
// authorRouter.get("/all", authorController.getAuthors);
// authorRouter.get("/byid/:id", authorController.getAuthorById);
// authorRouter.delete("/:id", authorController.deleteAuthor);

app.use( authRouter);

app.use("/api/author", authorRouter);
app.use("/api/state", stateRouter);
app.use("/api/category", categoryRouter);
// define handler for routine "/"
// app.get("/api/authors", function(request, response)
// {
    
// });
//app.get("/api/author/:id", );
//app.post("/api/author", );

//app.delete("/api/author/:id", );


app.get("/books", function(request, response){
     
    response.send("<h1>Books</h1>");
});
app.get("/category", function(request, response){
     
    response.send("<h1>Контакты</h1>");
});
app.use("/", function(_, response){
     
    response.sendFile(__dirname + "/index.html");
});
// start listening connection on 3000 port
app.listen(3000);