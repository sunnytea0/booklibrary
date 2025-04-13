const mysql = require("mysql2");

const connectionOption = {
    host: "localhost",
    user: "root",
    database: "booklib",
    connectTimeout: 120000,
    password: "Errerr777"
};

exports.getStates = async function(request, response)
{
    const connection = mysql.createConnection(connectionOption);
    //debugger;
    connection.connect();
    const sqlSelect = `SELECT readingStateId, stateName FROM readingstate`;
    try {
        let result = await connection.promise().query(sqlSelect); 
        response.send(result[0]);
    }
    catch (err) {
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
    debugger;
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
    debugger;
    const connection = mysql.createConnection(connectionOption);
    const sqlSelect = `SELECT * FROM readingstate WHERE ReadingStateId = '${id}'`;
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
        console.log(err);
        response.json(err);
    };
 }
