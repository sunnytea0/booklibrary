const mysql = require("mysql2");
const settings = require("../settings.js");

const connectionOption = settings.connectionOption;
exports.getUsers = async function(request, response)
{
    const connection = mysql.createConnection(connectionOption);
//    debugger;
    connection.connect();
    const sqlSelect = `SELECT userId, userName, role FROM user`;
    try {
        let result = await connection.promise().query(sqlSelect);
        response.send(result[0]);
    }
    catch (err) {
        console.log(err);
        response.status(400).send(err.message);
    }
    finally {
        connection.end();
    };

};
