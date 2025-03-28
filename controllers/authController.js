const mysql = require("mysql2");
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
                userName : data[0]['UserName'],
                role : data[0]['role']
                };
            }
        }
        return user;
    }
    catch (err) {
        console.log(err);
    };

};

exports.login = async function(request, response)
{
    const login = request.body;
  
    const connection = mysql.createConnection(connectionOption);
 //   debugger;
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
                role : data[0]['role']
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
    };
    
}
