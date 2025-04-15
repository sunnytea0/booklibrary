
async function fillBookForm(bookId)
{
    showBookEdit();
    if (bookId)
    {
        let book = await fetchBookById(bookId);
        if ( book)
        {
            $('#bookid').first().val(autbookhor.bookId);
            $('#booktitle').first().val(book.title);
            $("#bookeditlabel").text("Edit book");
        }
    }
    else
    {
        $('#bookid').first().val('');
        $('#booktitle').first().val('');
        $("#bookeditlabel").text("Add book");
    }
}

async function saveBookForm()
{
    //debugger;
    let book = {};
    book.bookId = $('#bookid').first().val();
    book.authorId = $('#bookauthorid').first().val();
    book.title = $('#title').first().val();
    book.bookDescription = $('#bookdescription').first().val();

    saveBook(book);
    await showBooks();
}

function saveBook(book)
{
    //data = loadFromLocalStorage();
    let idx = data.books.findIndex(p => p.id == book.bookId);
    if (idx > -1) {
        data.books[idx] = book;
    }
    else
    {
        data.books.push(book);
    }
    saveToLocalStorage(data);
}


async function saveNewStateForm()
{
    let bookReadingState = JSON.parse( localStorage.bookReadingState );
    let user = JSON.parse( localStorage.user );
    let newState = {};
    newState.bookReadingStateId = bookReadingState.bookReadingStateId;
    newState.page = $('#page').first().val();
    newState.readingState = $('#newreadingstate').first().val();;
    newState.userId = user.userid;
    newState.bookId = bookReadingState.bookId;
    saveNewState(user);
    await fillBookStateForm(newState.bookReadingStateId);
}
function saveNewState(newState)
{
    updateReadingState(newState);
    localStorage.setItem('bookReadingState', JSON.stringify(newState));
}


async function cancelNewStateForm()
{
    await showBooks();
}


function fillBookTable(books)
{
    var results = $('#booktable');  // 
    results.empty();                // clear element
    results.append('<thead><tr><th>Id</th><th>Author</th><th>Title</th><th>User</th><th>Last Update</th><th></th></tr></thead><tbody>')
    for (var i = 0; i < books.length; i++) {
        results.append('<tr><td>' + books[i].bookId + '</td> <td>' + books[i].authorName +
            '</td> <td>' + books[i].title +
            '</td> <td>' + books[i].userName +
            '</td> <td>' + books[i].lastUpdate +
            '</td><td><button class="editbook"+ data-id="' + books[i].bookId + '">Edit</button></td></tr>'); // add row
    }

}


async function fillBookStateForm(bookId)
{
    showBookStateEdit();
    let results = $('#bookStateHistorytable'); 
    results.empty(); 
    if (bookId) {
        let book = this.data.books.find(t => t.id == bookId)  ;
        $('#statebookid').first().val(book.bookId);
        $('#statebookname').first().val(book.bookName);
        $('#statebookdescription').first().val(book.bookDescription);

        let bookStates = getBookStateList(bookId);
        results.append('<thead><tr><th>Id</th><th>OldReadingState</th><th>NewReadingStateId</th><th>OldPage</th><th>NewPage</th><th>ChangeDate</th></tr></thead><tbody>')
        for (let i = 0; i < bookStates.length; i++) {
            results.append('<tr><td>' + bookStates[i].oldReadingState + '</td> <td>' + bookStates[i].newReadingStateId +
                '</td><td>' + bookStates[i].oldPage +
                '</td><td>' + bookStates[i].newPage +
                '</td><td>' + bookStates[i].changeDate +
                '</td></tr>'); // добавляем данные в список
        }
        results.append('</tbody>')
    }
    else
    {
        $('#statebookid').first().val('');
        $('#statebookname').first().val('');
        $('#statebookdescription').first().val('');
    }
}

async function newReadingState(bookId)
{
    debugger;
    let user = JSON.parse( localStorage.user );
    let bookReadingState = await getBookReadingState(bookId, user.userId);
    localStorage.setItem('bookReadingState', JSON.stringify(bookReadingState));
    if (bookReadingState.bookReadingStateId) {
        $('#page').first().val(bookReadingState.page);
        $('#newreadingstate').first().val(bookReadingState.readingStateId);
    }
    else
    {
        $('#page').first().val('');
        $('#newreadingstate').first().val('');
    }
}


async function cancelBookForm()
{
    await showBooks();
}

async function fillDeleteBookForm(bookId)
{
    if (bookId)
    {
        let book = await fetchBookById(bookId);
        if (book)
        {
            showBookDelete();
            $('#deletebookid').first().val(book.bookId);
            $('#deletebookauthorname').first().val(book.authorName);
            $('#deletebooktitle').first().val(book.title);
        }
    }
}


async function deleteBook()
{
    debugger;
    const bookId = $('#deletebookId').first().val();
    const result = await deleteBookFromServer(bookId);
    if (result)
    {
        let books = JSON.parse( localStorage.books );
        books = books.filter(function(item) {
            item.bookId != bookId
        });
        localStorage.setItem('books', JSON.stringify(books));
    }

    await showBooks();
}

