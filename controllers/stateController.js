const mysql = require("mysql2");

const settings = require("../settings.js");

const connectionOption = settings.connectionOption;

exports.getStates = async function(request, response)
{
    const connection = mysql.createConnection(connectionOption);
//    debugger;
    connection.connect();
    const sqlSelect = `SELECT readingStateId, stateName FROM readingstate`;
    try {
        let result = await connection.promise().query(sqlSelect); 
        response.send(result[0]);
    }
    catch (err) {
 //       debugger;
        console.log(err);
        response.json(err);
    };
};

exports.postState = async function(request, response)
{
    if (global.user.role != 'Admin')
    {
        response.status(403).send("Access denited.");
    }
    const state = request.body;
  
    const connection = mysql.createConnection(connectionOption);
 //   debugger;
    connection.connect();
    let sql = null;
    if (state.stateId)
    {
        sql = `UPDATE readingstate SET StateName = '${state.stateName}' WHERE ReadingStateId = ${state.stateId}`;
    }
    else
    {
        sql = `INSERT INTO readingstate(StateName) VALUES('${state.stateName}')`;
    }
    const sqlSelect = `SELECT * FROM readingstate WHERE stateName = '${state.stateName}'`;
    try {
        let result = await connection.promise().query(sqlSelect);
        if (result[0].length > 0)
        {
            response.send('state is already in list.');
            return;
        }
        let results = await connection.promise().query(sql);
        response.json(results[0]);
        console.log("State added");
        connection.end(function(err) {
            if (err) {
                return console.log("Error: " + err.message);
            }
            console.log("Connection closed");
        });
    }
    catch (err) {
        debugger;
        console.log(err);
        response.json(err);
    };
    
}

exports.deleteState = async function(request, response){
     
    if (global.user.role != 'Admin')
    {
        response.status(403).send("Access denited.");
    }    
    const id = request.params.id; 
//    debugger;
    const connection = mysql.createConnection(connectionOption);
    const sqlSelect = `SELECT readingStateId, stateName FROM readingstate WHERE ReadingStateId = '${id}'`;
    const sql = `DELETE FROM readingstate WHERE ReadingStateId = '${id}'`;
    try {
        let result = await connection.promise().query(sqlSelect);
        if (result[0].length == 0)
        {
            response.status(404).send("State not found");
            console.log("State not found");
            return;
        }
        let results = await connection.promise().query(sql);
        response.status(200);
        response.send(results[0]);
        console.log("State deleted");
        connection.end();
    }
    catch (err) {
        debugger;
        console.log(err);
        response.json(err);
    };
 }
 
 exports.getStateByBookId = async function(request, response){
 //   debugger; 
    const id = request.params.id; 
    const connection = mysql.createConnection(connectionOption);
    try {
        categoryResult = await connection.promise().query(`SELECT bookReadingStateId, readingStateId, page
FROM  booklib.bookreadingstate 
WHERE BookId = ${id} AND userId = ${global.user.userId};`);
  
        if (categoryResult[0].length == 0)
        {
            response.status(404).send("state not found");
            return;
        }
        response.json(categoryResult[0][0]);
        connection.end(function(err) {
            if (err) {
                return console.log("Error: " + err.message);
            }
            console.log("Connection closed");
        });
    }
    catch (err) {
        debugger;
        console.log(err);
        response.status(400).send(err.message);
    };   
    
}

exports.getHistoryStatesByBookId = async function(request, response){
//    debugger; 
    const id = request.params.id; 
    const connection = mysql.createConnection(connectionOption);
    try {
        categoryResult = await connection.promise().query(`SELECT bookreadingstatehistoryId, sh.OldReadingStateId, sh.NewReadingStateId, 
            rso.StateName as oldStateName, rsn.StateName as newStateName, oldPage, newPage, changeDate
FROM booklib.bookreadingstatehistory as sh
INNER JOIN booklib.bookreadingstate as bs ON bs.bookreadingstateId = sh.bookreadingstateId
LEFT OUTER JOIN booklib.readingState as rso ON sh.OldReadingStateId = rso.readingStateId
LEFT OUTER JOIN booklib.readingState as rsn ON sh.NewReadingStateId = rsn.readingStateId
WHERE bs.BookId = ${id} AND bs.userId = ${global.user.userId};`);
  
        response.json(categoryResult[0]);
        connection.end(function(err) {
            if (err) {
                return console.log("Error: " + err.message);
            }
            console.log("Connection closed");
        });
    }
    catch (err) {
        debugger;
        console.log(err);
        response.status(400).send(err.message);
    };   
    
}
