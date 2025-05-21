const mysql = require("mysql2");
const settings = require("../settings.js");

const connectionOption = settings.connectionOption;

exports.getBooks = async function(request, response)
{
    const connection = mysql.createConnection(connectionOption);
    //debugger;
    connection.connect();
    const sqlSelect = `SELECT bookId, b.authorId, a.authorName, title, fileName, bookDescription, b.lastUpdate, b.userId, u.userName 
FROM Book as b
INNER JOIN Author as a ON (b.AuthorId = a.AuthorId)
INNER JOIN User as u ON (b.UserId = u.UserId)`;
    try {
        result = await connection.promise().query(sqlSelect);
        response.send(result[0]);
        return;
    }
    catch (err) {
        console.log(err);
        response.status(400).send(err.message);
    }
    finally {
        connection.end();
    };    
};

exports.getFilterBooks = async function(request, response)
{
 //   debugger;
    const search = request.params.search; 
    const connection = mysql.createConnection(connectionOption);
    connection.connect();
    const sqlSelect = `SELECT bookId, b.authorId, a.authorName, title, fileName, bookDescription, b.lastUpdate, b.userId, u.userName 
FROM Book as b
INNER JOIN Author as a ON (b.AuthorId = a.AuthorId)
INNER JOIN User as u ON (b.UserId = u.UserId)
WHERE EXISTS 
(
SELECT * FROM Category c INNER JOIN BookCategory bc ON c.categoryId = bc.categoryId 
WHERE bc.bookId = b.bookId AND c.CategoryName LIKE '%${search}%'
)
OR a.authorName LIKE '%${search}%'
OR b.title LIKE '%${search}%'`;
    try {
        result = await connection.promise().query(sqlSelect);
        response.send(result[0]);
        return;
    }
    catch (err) {
        console.log(err);
        response.status(400).send(err.message);
    }
    finally {
        connection.end();
    };    
};

exports.postBook = async function(request, response)
{
    const book = request.body;
  
    const connection = mysql.createConnection(connectionOption);
    //debugger;
    connection.connect();
    let sql = null;
 
    try 
    {
        if (book.bookId)
        {
            let bookResult = await connection.promise().query(`SELECT * FROM Book WHERE BookId = '${book.bookId}'`);
            if (bookResult[0].length == 0)
            {
                response.status(400).send('Book not found.');
                return;
            }
            if (global.user.role != 'Admin' && global.user.userId != bookResult[0][0]['bookId'])
            {
                response.status(403).send("Access denited.");
                return;
            }    
            let result = await connection.promise().query(`SELECT * FROM book WHERE title = '${book.title}' and AuthorId = ${book.authorId}  and BookId <> ${book.bookId}`);
            if (result[0].length > 0)
            {
                response.status(400).send('Book is already in list.');
                return;
            }
            sql = `UPDATE book 
            SET Title = '${book.title}',
            BookDescription = '${book.bookDescription}',
            authorId = '${book.authorId}'
            WHERE BookId = ${book.bookId}`;
        }
        else
        {
            let authorResult = await connection.promise().query(`SELECT * FROM Author WHERE AuthorId = '${book.authorId}'`);
            if (authorResult[0].length == 0)
            {
                response.status(400).send('Author not found.');
                return;
            }
            let result = await connection.promise().query(`SELECT * FROM book WHERE title = '${book.title}' and AuthorId = ${book.authorId}`);
            if (result[0].length > 0)
            {
                response.status(400).send('Book is already in list.');
                return;
            }
            sql = `INSERT INTO Book(AuthorId,Title,BookDescription,UserId)
            VALUES(${book.authorId},'${book.title}','${book.description}',${global.user.userId})`;
        }       
        
        let results = await connection.promise().query(sql);
        response.json(results[0]);
        console.log("Book aded/updated");
    
        // let err = await connection.promise().end();
        // if (err) {
        //     return console.log("Error: " + err.message);
        // }
        console.log("Connection closed");

    }
    catch (err) {
        console.log(err);
        response.status(400).send(err.message);
    }
    finally {
        connection.end();
    };
    
}

exports.deleteBook = async function(request, response){
     
    const id = request.params.id; 
 //   debugger;
    const connection = mysql.createConnection(connectionOption);
    const sqlSelect = `SELECT * FROM book WHERE BookId = ${id}`;
    const sql = `DELETE FROM book WHERE BookId = ${id}`;
    try {
        let result = await connection.promise().query(sqlSelect);
        if (result[0].length == 0)
        {
            response.status(404).send("Book not found");
            console.log("Book not found");
            return;
        }
        if (global.user.role != 'Admin' && global.user.userId != result[0][0]['bookId'])
        {
            response.status(403).send("Access denited.");
            return;
        }    
        let deleteHistoryResults  = await  connection.promise().query(`DELETE FROM booklib.bookreadingstatehistory
WHERE bookreadingstateId IN (
SELECT bookreadingstateId FROM booklib.bookreadingstate
WHERE BookId = ${id});`);
        
        let deleteStateResults  = await  connection.promise().query(`DELETE FROM booklib.bookreadingstate WHERE BookId = ${id};`);
        
        let deleteCategoryResults  = await  connection.promise().query(`DELETE FROM booklib.bookcategory WHERE BookId = ${id};`);
        
        let results  = await  connection.promise().query(sql);
        response.status(200);
        response.send(results);
        console.log("Book deleted");
    }
    catch (err) {
        console.log(err);
        response.status(400).send(err.message);
    }
    finally {
        connection.end();
    };    
    
 }

exports.getBookById = async function(request, response){
 //   debugger; 
    const id = request.params.id; 
    const connection = mysql.createConnection(connectionOption);
    const sqlSelect = `SELECT bookId, b.authorId, a.authorName, title, fileName, bookDescription, b.lastUpdate, b.userId, u.userName 
FROM Book as b
INNER JOIN Author as a ON (b.AuthorId = a.AuthorId)
INNER JOIN User as u ON (b.UserId = u.UserId) 
WHERE BookId = ${id} `;
    try {
        let result = await connection.promise().query(sqlSelect);
        if (result[0].length == 0)
        {
                response.status(404).send("Book not found");
                console.log("Book not found");
                return;
        }
        response.json(result[0][0]);
    }
    catch (err) {
        console.log(err);
        response.status(400).send(err.message);
    }
    finally {
        connection.end();
    };   
    
}

exports.getBooksByAuthor = async function(request, response){
    const authorId = request.params.id; 
    const connection = mysql.createConnection(connectionOption);
 //   debugger;
    connection.connect();
    const sqlSelect = `SELECT bookId, b.authorId, a.authorName, title, fileName, bookDescription, b.lastUpdate, b.userId, u.userName 
FROM Book as b
INNER JOIN Author as a ON (b.AuthorId = a.AuthorId)
INNER JOIN User as u ON (b.UserId = u.UserId)
WHERE b.AuthorId = ${authorId} `;
    try {
        result = await connection.promise().query(sqlSelect);
        response.send(result[0]);
        return;
    }
    catch (err) {
        console.log(err);
        response.status(400).send(err.message);
    }
    finally {
        connection.end();
    };    

}

exports.getBooksByUser = async function(request, response){
    const userId = request.params.id; 
    const connection = mysql.createConnection(connectionOption);
 //   debugger;
    connection.connect();
    const sqlSelect = `SELECT bookId, b.authorId, a.authorName, title, fileName, bookDescription, b.lastUpdate, b.userId, u.userName 
FROM Book as b
INNER JOIN Author as a ON (b.AuthorId = a.AuthorId)
INNER JOIN User as u ON (b.UserId = u.UserId)
WHERE b.UserId = ${userId}`;
    try {
        result = await connection.promise().query(sqlSelect);
        response.send(result[0]);
        return;
    }
    catch (err) {
        console.log(err);
        response.status(400).send(err.message);
    }
    finally {
        connection.end();
    };    

}

exports.getBooksByCategory = async function(request, response){
    const categoryId = request.params.id; 
    const connection = mysql.createConnection(connectionOption);
 //   debugger;
    connection.connect();
    const sqlSelect = `SELECT b.bookId, b.authorId, a.authorName, title, fileName, bookDescription, b.lastUpdate, b.userId, u.userName 
FROM Book as b
INNER JOIN Author as a ON (b.AuthorId = a.AuthorId)
LEFT OUTER JOIN User as u ON (b.UserId = u.UserId)
INNER JOIN BookCategory bc ON b.BookId = bc.BookId
WHERE bc.CategoryId = ${categoryId}`;
    try {
        result = await connection.promise().query(sqlSelect);
        response.send(result[0]);
        return;
    }
    catch (err) {
        console.log(err);
        response.status(400).send(err.message);
    }
    finally {
        connection.end();
    };    
}

exports.updateState = async function(request, response) {
//    debugger;
    const bookState = request.body;
  
    const connection = mysql.createConnection(connectionOption);
   
    connection.connect();
    let sql = null;
 
    try 
    {
        let bookResult = await connection.promise().query(`SELECT * FROM Book 
            WHERE BookId = ${bookState.bookId} AND ('${global.user.role}' = 'Admin' OR UserId = ${global.user.userId} )`);
        if (bookResult[0].length == 0)
        {
            response.status(400).send('Book not found.');
            return;
        }
        if (global.user.role != 'Admin' && global.user.userId != bookrResult[0][0]['bookId'])
        {
            response.status(403).send("Access denited.");
            return;
        }  
        if (bookState.readingStateId)  
        {
            let stateResult = await connection.promise().query(`SELECT * FROM ReadingState WHERE ReadingStateId = ${bookState.readingStateId}`);
            if (stateResult[0].length == 0)
            {
                response.status(400).send('State not found.');
                return;
            }
        }

        let results = null; 
        let bookReadingStateId = null;
        let oldReadingStateId = null;
        let oldPage = null;
        let selectResult = await connection.promise().query(`SELECT * FROM bookreadingstate WHERE BookId = ${bookState.bookId} AND UserId = ${global.user.userId}`);
        if (selectResult[0].length == 0)
        {
            sql = `INSERT INTO bookreadingstate ( BookId, ReadingStateId, UserId, Page)
            VALUES(${bookState.bookId},${bookState.readingStateId},${global.user.userId},${bookState.page})`;
            results = await connection.promise().query(sql);
            bookReadingStateId = results[0].insertId;     
        }
        else
        {
            bookReadingStateId = selectResult[0][0]['BookReadingStateId'];
            oldReadingStateId = selectResult[0][0]['ReadingStateId'];
            oldPage = selectResult[0][0]['page'] ?? null;
            sql = `UPDATE bookreadingstate 
            SET BookId = ${bookState.bookId}, 
                ReadingStateId = ${bookState.readingStateId}, 
                UserId = ${global.user.userId}, 
                Page = ${bookState.page}
            WHERE bookReadingStateId = ${bookReadingStateId}`;
            results = await connection.promise().query(sql);  
            
        }
 
        let historySql = `INSERT INTO bookreadingstatehistory ( BookReadingStateId, OldReadingStateId, NewReadingStateId, OldPage, NewPage)
            VALUES(${bookReadingStateId}, ${oldReadingStateId}, ${bookState.readingStateId}, ${oldPage}, ${bookState.page})`;
        historyResults = await connection.promise().query(historySql);

        response.json(results[0]);
        console.log("Book state update");
    
    }
    catch (err) {
        console.log(err);
        response.status(400).send(err.message);
    }
    finally {
        connection.end();
    };
   
}

exports.addToCategory = async function(request, response){
    const bookCategory = request.body;
  
    const connection = mysql.createConnection(connectionOption);
    //debugger;
    connection.connect();
    let sql = null;
 
    const sqlSelect = `SELECT * FROM bookcategory 
    WHERE BookId = ${bookCategory.bookId} and CategoryId = ${bookCategory.categoryId}`;
    try 
    {

        let bookResult = await connection.promise().query(`SELECT * 
            FROM Book WHERE BookId = '${bookCategory.bookId}' AND ('${global.user.role}' = 'Admin' OR UserId = ${global.user.userId} )`);
        if (bookResult[0].length == 0)
        {
            response.status(400).send('Book not found.');
            return;
        }
        if (global.user.role != 'Admin' && global.user.userId != bookrResult[0][0]['bookId'])
        {
            response.status(403).send("Access denited.");
            return;
        }    
        let categoryResult = await connection.promise().query(`SELECT * FROM Category WHERE CategoryId = ${bookCategory.categoryId}`);
        if (categoryResult[0].length == 0)
        {
            response.status(404).send('Category not found.');
            return;
        }
        let result = await connection.promise().query(sqlSelect);
        if (result[0].length > 0)
        {
            response.status(400).send('Book is already in category.');
            return;
        }
        sql = `INSERT INTO bookcategory ( BookId, CategoryId)
        VALUES(${bookCategory.bookId},${bookCategory.categoryId})`;
              
        
        let results = await connection.promise().query(sql);
        response.json(results[0]);
        console.log("Book aded to category");
    
    }
    catch (err) {
        console.log(err);
        response.status(400).send(err.message);
    }
    finally {
        connection.end();
    };
}

exports.deleteFromCategory = async function(request, response){
     
    const categoryId = request.params.categoryId; 
    const bookId = request.params.bookId; 
 //   debugger;
    const connection = mysql.createConnection(connectionOption);
    const sqlSelect = `SELECT * FROM bookCategory WHERE CategoryId = ${categoryId} AND bookId = ${bookId}`;
    const sql = `DELETE FROM bookCategory WHERE CategoryId = ${categoryId} AND bookId = ${bookId}`;
    try {
        let bookResult = await connection.promise().query(`SELECT * FROM Book 
            WHERE BookId = ${bookId} AND ('${global.user.role}' = 'Admin' OR ${global.user.userId} = UserId)`);
        if (bookResult[0].length == 0)
        {
            response.status(404).send('Book not found.');
            return;
        }
        if (global.user.role != 'Admin' && global.user.userId != bookrResult[0][0]['bookId'])
        {
            response.status(403).send("Access denited.");
            return;
        }    
       let result = await connection.promise().query(sqlSelect);
        if (result[0].length == 0)
        {
            response.status(404).send("Book is not in category.");
            console.log("Book is not in category.");
            return;
        }
        let results  = await connection.promise().query(sql);
        response.status(200);
        response.send(results);
        console.log("category deleted");
    }
    catch (err) {
        console.log(err);
        response.status(400).send(err.message);
    }
    finally {
        connection.end();
    };
}

exports.setContent = async function(request, response){
    response.status(200);
}