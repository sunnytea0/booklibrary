const mysql = require("mysql2");
const crypto = require("crypto");
const settings = require("../settings.js");

const connectionOption = settings.connectionOption;
exports.getUser = async function(token)
{
    const connection = mysql.createConnection(connectionOption);
//    debugger;
    connection.connect();
    const sqlSelect = `SELECT * FROM user WHERE token = '${token}'`;
    try {
        let user = null;
        let result = await connection.promise().query(sqlSelect);
        if (result[0])
        {
            let data = result[0];
            if (data?.length ?? 0 > 0)
            {
                user = {
                    userId : data[0]['UserId'],
                    userName : data[0]['UserName'],
                    role : data[0]['role']
                };
            }
        }
        return user;
    }
    catch (err) {
        console.log(err);
    }
    finally {
        connection.end();
    }
}

exports.login = async function(request, response)
{
//    debugger;
    const login = request.body;
  
    const connection = mysql.createConnection(connectionOption);
    connection.connect();
    const sqlSelect = `SELECT * FROM user WHERE UserName = '${login.userName}' AND Password = '${login.password}'`;
    try {
        let user = null;
        let result = await connection.promise().query(sqlSelect);
        if (result[0])
        {
            let data = result[0];
            if (data?.length ?? 0 > 0)
            {
                user = {
                token : data[0]['token'],
                role : data[0]['role'],
                userId : data[0]['UserId']
                };
            }
        }
        if (user)
        {
            response.json(user);
        }
        else
        {
            response.status(400).send(`Wrong user or password.`);
        }
    }
    catch (err) {
        console.log(err);
    }
    finally {
        connection.end();
    }
}

exports.register = async function(request, response)
{
    const login = request.body;
  
    const connection = mysql.createConnection(connectionOption);
 //   debugger;
    if ( !login.userName || !login.password)
    {
        response.status(400).send(`User name or password is not correct.`);
        return;
    }
    connection.connect();
    const sqlSelect = `SELECT * FROM user WHERE UserName = '${login.userName}'`;
    try {
        let user = null;
        let result = await connection.promise().query(sqlSelect);
        if (result[0]?.length ?? 0 > 0)
        {
            response.status(400).send(`User is alreday in list.`);
            return;
        }
        user = {
            userName : login.userName,
            password : login.password,
            token : crypto.randomUUID(),
            role : 'User'
        };
        
        let results = await connection.promise().query(`INSERT INTO user(UserName,Password,IsAdmin,Role,Token) 
            VALUES('${login.userName}', '${login.password}', 0, '${user.role}', '${user.token}')`);
        user.userId = results[0].insertId;
        response.json(user);

    }
    catch (err) {
        console.log(err);
        response.status(400).send(err);
    }
    finally {
        connection.end();
    }
}
