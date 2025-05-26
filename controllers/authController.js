// Імпортуємо модуль для роботи з MySQL
const mysql = require("mysql2");

// Імпортуємо модуль для генерації UUID токена
const crypto = require("crypto");

// Імпортуємо налаштування підключення до БД
const settings = require("../settings.js");

// Отримуємо об'єкт з параметрами підключення до БД
const connectionOption = settings.connectionOption;

// Функція для отримання інформації про користувача за токеном
exports.getUser = async function(token)
{
    const connection = mysql.createConnection(connectionOption); // Створюємо підключення
    connection.connect(); // Встановлюємо з'єднання з БД

    // SQL-запит для вибору користувача за токеном
    const sqlSelect = `SELECT * FROM user WHERE token = '${token}'`;

    try {
        let user = null;
        let result = await connection.promise().query(sqlSelect); // Виконуємо запит з обіцянками

        // Якщо є результати
        if (result[0]) {
            let data = result[0];
            // Перевіряємо, чи не порожній масив
            if (data?.length ?? 0 > 0) {
                user = {
                    userId : data[0]['UserId'],
                    userName : data[0]['UserName'],
                    role : data[0]['role']
                };
            }
        }
        return user; // Повертаємо об'єкт користувача або null
    }
    catch (err) {
        console.log(err); // Лог помилки
    }
    finally {
        connection.end(); // Закриваємо з'єднання з БД
    }
}

// Функція для авторизації користувача
exports.login = async function(request, response)
{
    const login = request.body; // Отримуємо тіло запиту (логін і пароль)

    const connection = mysql.createConnection(connectionOption);
    connection.connect();

    // SQL-запит на пошук користувача з відповідним логіном і паролем
    const sqlSelect = `SELECT * FROM user WHERE UserName = '${login.userName}' AND Password = '${login.password}'`;

    try {
        let user = null;
        let result = await connection.promise().query(sqlSelect);

        if (result[0]) {
            let data = result[0];
            if (data?.length ?? 0 > 0) {
                user = {
                    token : data[0]['token'],
                    role : data[0]['role'],
                    userId : data[0]['UserId']
                };
            }
        }

        if (user) {
            response.json(user); // Повертаємо дані користувача, якщо знайдено
        } else {
            response.status(400).send(`Wrong user or password.`); // Помилка, якщо не знайдено
        }
    }
    catch (err) {
        console.log(err);
    }
    finally {
        connection.end(); // Закриваємо з'єднання з БД
    }
}

// Функція для реєстрації нового користувача
exports.register = async function(request, response)
{
    const login = request.body; // Отримуємо логін і пароль

    const connection = mysql.createConnection(connectionOption);

    // Перевірка на наявність обов’язкових полів
    if (!login.userName || !login.password) {
        response.status(400).send(`User name or password is not correct.`);
        return;
    }

    connection.connect();

    // SQL-запит для перевірки, чи існує користувач з таким іменем
    const sqlSelect = `SELECT * FROM user WHERE UserName = '${login.userName}'`;

    try {
        let user = null;
        let result = await connection.promise().query(sqlSelect);

        if (result[0]?.length ?? 0 > 0) {
            response.status(400).send(`User is already in list.`); // Користувач уже існує
            return;
        }

        // Створення нового користувача з токеном
        user = {
            userName : login.userName,
            password : login.password,
            token : crypto.randomUUID(), // Генеруємо унікальний токен
            role : 'User' // Роль за замовчуванням
        };

        // Вставляємо нового користувача в БД
        let results = await connection.promise().query(`INSERT INTO user(UserName,Password,IsAdmin,Role,Token) 
            VALUES('${login.userName}', '${login.password}', 0, '${user.role}', '${user.token}')`);

        user.userId = results[0].insertId; // Отримуємо ID нового користувача
        response.json(user); // Повертаємо нового користувача
    }
    catch (err) {
        console.log(err);
        response.status(400).send(err); // У разі помилки повертаємо 400
    }
    finally {
        connection.end(); // Закриваємо з’єднання з БД
    }
}
