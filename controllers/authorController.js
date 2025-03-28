const mysql = require("mysql2");
const settings = require("../settings.js");

const connectionOption = settings.connectionOption;

exports.getAuthors = async function(request, response)
{
    const connection = mysql.createConnection(connectionOption);
    debugger;
    connection.connect();
    const sqlSelect = `SELECT * FROM author`;
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
    const author = request.body;
  
    const connection = mysql.createConnection(connectionOption);
    debugger;
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
        response.json(result[0]);
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
        result = await connection.promise().query(sqlSelect);
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
    const sqlSelect = `SELECT * FROM author WHERE AuthorId = '${id}'`;
    try {
        result = await connection.promise().query(sqlSelect);
        if (result[0].length == 0)
        {
                response.status(404).send("Author not found");
                console.log("Author not found");
                return;
        }
        response.json(result[0]);
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