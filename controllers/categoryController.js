const mysql = require("mysql2");
const settings = require("../settings.js");

const connectionOption = settings.connectionOption;
exports.getCategories = async function(request, response)
{
    const connection = mysql.createConnection(connectionOption);
 //   debugger;
    connection.connect();
    const sqlSelect = `SELECT * FROM category`;
    try {
        let result = await connection.promise().query(sqlSelect);
        response.send(result[0]);
    }
    catch (err) {
        console.log(err);
        response.json(err);
    };

};

exports.postCategory = async function(request, response)
{
    const category = request.body;
  
    const connection = mysql.createConnection(connectionOption);
    debugger;
    connection.connect();
    let sql = null;
    if (category.categoryId)
    {
        sql = `UPDATE category 
        SET CategoryName = '${category.categoryName}' 
            CategoryDescription = '${category.categoryDescription}' 
        WHERE CategoryId = ${category.categoryId}`;
    }
    else
    {
        sql = `INSERT INTO category ( categoryName,CategoryDescription) VALUES('${category.categoryName}','${category.categoryDescription}')`;
    }
    const sqlSelect = `SELECT * FROM category WHERE categoryName = '${category.categoryName}'`;
    try {
        let result = await connection.promise().query(sqlSelect);
        if (result[0].length > 0)
            {
                response.send('category is already in list.');
                return;
            }
            let results = await connection.promise().query(sql);
            response.json(category);
            console.log("Category added");
                
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

exports.deleteCategory = async function(request, response){
     
    const id = request.params.id; 
    debugger;
    const connection = mysql.createConnection(connectionOption);
    const sqlSelect = `SELECT * FROM category WHERE CategoryId = '${id}'`;
    const sql = `DELETE FROM category WHERE CategoryId = '${id}'`;
    try {
        let result = await connection.promise().query(sqlSelect);
        if (result[0].length == 0)
        {
            response.status(404).send("category not found");
            console.log("category not found");
            return;
        }
        let results  = await connection.promise().query(sql);
        response.status(200);
        response.send(results);
        console.log("category deleted");
        connection.end();
    }
    catch (err) {
        console.log(err);
        response.json(err);
    };
    
 }
