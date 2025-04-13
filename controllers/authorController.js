const mysql = require("mysql2");
const settings = require("../settings.js");

const connectionOption = settings.connectionOption;

exports.getAuthors = async function(request, response)
{
    const connection = mysql.createConnection(connectionOption);
//    debugger;
    connection.connect();
    const sqlSelect = `SELECT authorId, authorName, lastUpdate  FROM author`;
    try {
        result = await connection.promise().query(sqlSelect);
        response.send(result[0]);
        return;
    }
    catch (err) {
        console.log(err);
        response.json(err);
    };    
};

exports.postAuthor = async function(request, response)
{
    debugger;
    const author = request.body;
  
    const connection = mysql.createConnection(connectionOption);
    connection.connect();
    let sql = null;
    if (author.authorId)
    {
        sql = `UPDATE author SET AuthorName = '${author.authorName}' WHERE AuthorId = ${author.authorId}`;
    }
    else
    {
        sql = `INSERT INTO author(AuthorName) VALUES('${author.authorName}')`;
    }
    const sqlSelect = `SELECT * FROM author WHERE AuthorName = '${author.authorName}'`;
    try 
    {
        result = await connection.promise().query(sqlSelect);
        if (result[0].length > 0)
        {
            response.send('author is already in list.');
            return;
        }
        results = await connection.promise().query(sql);
        response.json(results[0]);
        console.log("Author aded");
    
        connection.end(function(err) {
            if (err) {
              return console.log("Error: " + err.message);
            }
            console.log("Connection closed");
        });

    }
    catch (err) {
        console.log(err);
        response.json(err);
    };
    
}

exports.deleteAuthor = async function(request, response){
     
    const id = request.params.id; 
    debugger;
    const connection = mysql.createConnection(connectionOption);
    const sqlSelect = `SELECT * FROM author WHERE AuthorId = '${id}'`;
    const sql = `DELETE FROM author WHERE AuthorId = '${id}'`;
    try {
        let bookResult = await connection.promise().query(`SELECT * FROM Book WHERE AuthorId = ${id}`);
        if (bookResult[0].length > 0)
        {
            response.status(404).send("Cannot delete author. Author has book(s).");
            console.log("Cannot delete author. Author has book(s).");
            return;
        }
        let result = await connection.promise().query(sqlSelect);
        if (result[0].length == 0)
        {
            response.status(404).send("Author not found");
            console.log("Author not found");
            return;
        }
        results  = await  connection.promise().query(sql);
        response.status(200);
        response.send(results);
        console.log("Author deleted");
        connection.end();
    }
    catch (err) {
        console.log(err);
        response.json(err);
    };    
    
 }

exports.getAuthorById = async function(request, response){
     
    const id = request.params.id; 
    const connection = mysql.createConnection(connectionOption);
    const sqlSelect = `SELECT authorId, authorName, lastUpdate FROM author WHERE AuthorId = '${id}'`;
    try {
        result = await connection.promise().query(sqlSelect);
        if (result[0].length == 0)
        {
                response.status(404).send("Author not found");
                console.log("Author not found");
                return;
        }
        let author = result[0][0];
        booksResult = await connection.promise().query(`SELECT bookId, title FROM book WHERE AuthorId = ${id}`);
        if (booksResult[0].length == 0)
        {
            author.books = [];
        }  
        else
        {
            author.book = booksResult[0][0]; 
        }      
        response.json(author);
        connection.end(function(err) {
            if (err) {
                return console.log("Error: " + err.message);
            }
            console.log("Connection closed");
        });
    }
    catch (err) {
        console.log(err);
        response.json(err);
    };   
    
}