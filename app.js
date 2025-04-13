const express = require("express");
// create app
const app = express();
const bookRouter = require("./routes/bookRouter.js");
const authorRouter = require("./routes/authorRouter.js");
const stateRouter = require("./routes/stateRouter.js");
const categoryRouter = require("./routes/categoryRouter.js");
const authRouter = require("./routes/authRouter.js");

app.use(express.static("web"));
app.use(express.static("scripts"));

app.use(express.json()); 

app.use( authRouter);

app.use("/api/book", bookRouter);
app.use("/api/author", authorRouter);
app.use("/api/state", stateRouter);
app.use("/api/category", categoryRouter);

app.get("/books", function(request, response){
     
    response.send("<h1>Books</h1>");
});
app.get("/category", function(request, response){
     
    response.send("<h1>Контакты</h1>");
});

app.use("/index", function(_, response){
     
    response.sendFile(__dirname + "/web/index.html");
});
// start listening connection on 3000 port
app.listen(3000);