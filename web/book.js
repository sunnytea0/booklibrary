
async function fillBookForm(bookId)
{
//    debugger;
    showBookEdit();
    if( !$('#bookediterror').first().hasClass("hidden")){
        $('#bookediterror').first().addClass("hidden");
    }
    if( !$('#bookcategoryeditcore').first().hasClass("hidden")){
        $('#bookcategoryeditcore').first().addClass("hidden");
    }   
   if (bookId)
    {
        let book = await fetchBookById(bookId);
        if ( book)
        {
            $('#editbookid').first().val(book.bookId);
            $('#editbookauthor').first().val(book.authorId);
            $('#editbooktitle').first().val(book.title);
            $('#editbookdescription').first().val(book.bookDescription);
            $("#bookeditlabel").text("Edit book");
        }
        $('.bookcategorypart').first().removeClass("hidden");
        $('.bookhistorypart').first().removeClass("hidden");
    }
    else
    {
        if( !$('.bookcategorypart').first().hasClass("hidden")){
            $('.bookcategorypart').first().addClass("hidden");
        }
        if( !$('.bookhistorypart').first().hasClass("hidden")){
            $('.bookhistorypart').first().addClass("hidden");
        }
        $('#editbookid').first().val('');
        $('#editbooktitle').first().val('');
        $('#editbookdescription').first().val('');
        $("#bookeditlabel").text("Add book");
    }
    await fillBookStateForm(bookId);
    await fillBookStateTable(bookId);
    await fillBookCategoryTable(bookId);
}

async function saveBookForm()
{
//    debugger;
    let book = {};
    book.bookId = $('#editbookid').first().val();
    book.authorId = $('#editbookauthor').first().val();
    book.title = $('#editbooktitle').first().val();
    book.bookDescription = $('#editbookdescription').first().val();

    if (book.title && book.bookDescription)
    {
        response =await saveBook(book);
        if (response.status)
        {
            const message = await response.text();
            $('#bookediterror').first().removeClass("hidden");
            $("#bookediterror").text(`Error: ${message}`);
        }
        else
        {
            if( !$('#bookediterror').first().hasClass("hidden"))
            {
                $('#bookediterror').first().addClass("hidden");
            }
            await showBooks();
        }
    }
}

async function saveBook(book)
{
    let response = await saveBookToServer(book);
//    debugger;
    if (response)
    {
        if (response.status)
            return response;
        book = response;
        let books = JSON.parse( localStorage.books );
        let idx = books.findIndex(t => t.bookId == book.bookId);
        if (idx > -1)
        {
            books[idx] = book;
        }
        else
        {
            books.push(book);
        }
        localStorage.setItem('books', JSON.stringify(books));
    
    }
    return book;

}


async function saveNewState()
{
//    debugger;
    let user = JSON.parse( sessionStorage.user );
    let newState = {};
    newState.page = $('#statepage').first().val() || 0;
    newState.readingStateId = $('#bookreadingstate').first().val();
    newState.userId = user.userId;
    newState.bookId = $('#editbookid').first().val();
    let error = null;
    if ( !newState.readingStateId )
    {
        error = 'new state is not assigned.';
    }
    else
    {
         const response = await updateReadingState(newState);
        
        if (response.status)
        {
            error = await response.text();
        }
        else
        {
            await fillBookStateForm(newState.bookId);
            await fillBookStateTable(newState.bookId);
        }
    }
    if (error)
    {
        $('#bookstateerror').first().removeClass("hidden");
        $("#bookstateerror").text(`Error: ${error}`);
    }
    else
    {
        if( !$('#bookstateerror').first().hasClass("hidden"))
        {
            $('#bookstateerror').first().addClass("hidden");
        }
    }
}



async function cancelNewStateForm()
{
    await showBooks();
}


function fillBookTable(books)
{
//    debugger;
    var results = $('#booktable');  // 
    results.empty();                // clear element
    results.append('<thead><tr><th>Id</th><th>Author</th><th>Title</th><th>User</th><th>Last Update</th></tr></thead><tbody>');
    let user = JSON.parse(sessionStorage.getItem('user'));
    for (var i = 0; i < books.length; i++) {
        results.append(`<tr><td>${books[i].bookId}</td> 
            <td>${books[i].authorName}</td> 
            <td>${books[i].title}</td> 
            <td>${books[i].userName}</td> 
            <td>${books[i].lastUpdate}</td>` +
            ((user.role == 'Admin' || user.userId == books[i].userId) ? 
            `<td class="onlyadmin"><button class="editbook" data-id="${books[i].bookId}">Edit</button></td>
            <td class="onlyadmin"><button class="deletebook" data-id="${books[i].bookId}">Delete</button></td>` : '')
            +`</tr>`); // add row
    }
    // let user = JSON.parse(sessionStorage.getItem('user'));
    // if (user.role != 'Admin')
    // {
    //     $('.onlyadmin').addClass("hidden");
    // }
}

function fillBookTableToDiv(books, div)
{
    div.first().removeClass("hidden");
    div.empty();                // clear element
    if (books && books.length && books.length > 0)
    {
        div.append('<thead><tr><th>Id</th><th>Author</th><th>Title</th><th>User</th><th>Last Update</th><th></th></tr></thead><tbody>')
        for (var i = 0; i < books.length; i++) {
            div.append(`<tr><td>${books[i].bookId}</td> 
            <td>${books[i].authorName}</td> 
            <td>${books[i].title}</td> 
            <td>${books[i].userName}</td> 
            <td>${books[i].lastUpdate}</td>
            </tr>`); // add row
        }
    }
}

async function fillBookStateTable(bookId)
{
    var results = $('#bookstatetable');  // 
    results.empty();
    let bookStates = await getBookStateList(bookId);
    results.append('<thead><tr><th>Id</th><th>Old State</th><th>New State</th><th>Old Page</th><th>New Page</th><th>Change Date</th></tr></thead><tbody>')
    for (let i = 0; i < bookStates.length; i++) {
        results.append('<tr><td>' + bookStates[i].bookreadingstatehistoryId + 
            '</td><td>' + bookStates[i].oldStateName +
            '</td><td>' + bookStates[i].newStateName +
            '</td><td>' + bookStates[i].oldPage +
            '</td><td>' + bookStates[i].newPage +
            '</td><td>' + bookStates[i].changeDate +
            '</td></tr>'); // 
    }
    results.append('</tbody>')
}

async function fillBookCategoryTable(bookId)
{
    let results = $('#bookcategorytable'); 
    results.empty(); 
    let bookCategories =await getBookCategoryList(bookId);
    results.append('<thead><tr><th>Id</th><th>Category Name</th><th>Category Description</th></tr></thead><tbody>')
    for (let i = 0; i < bookCategories.length; i++) {
        results.append(`<tr><td>${bookCategories[i].categoryId}</td><td>${bookCategories[i].categoryName}</td>
            <td>${bookCategories[i].categoryDescription}</td>
            <td><button class="deletebookcategory" data-id="${bookCategories[i].categoryId}">Delete</button></td></tr>`); 
    }
    results.append('</tbody>')
}


async function fillBookStateForm(bookId)
{
//    showBookStateEdit();
    if (bookId) {
        let bookState = await getBookState(bookId);
        $('#bookreadingstate').first().val(bookState.readingStateId);
        $('#statepage').first().val(bookState.page);

    }
    else
    {
        $('#bookreadingstate').first().val('');
        $('#statepage').first().val('');
    }
}

async function newReadingState(bookId)
{
//    debugger;
    let user = JSON.parse( sessionStorage.user );
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
//    debugger;
    const bookId = $('#deletebookid').first().val();
    const result = await deleteBookFromServer(bookId);
    if (result)
    {
        if (result.status && result.status != 200)
        {
            const message = await result.text();
            $('#bookdeleteissue').first().removeClass("hidden");
            $("#bookdeleteissuetext").text(`Error: ${message}`);
        }
        else
        {
            let books = JSON.parse( localStorage.books );
            books = books.filter(function(item) {
                item.bookId != bookId
            });
            localStorage.setItem('books', JSON.stringify(books));
            if( !$('#bookdeleteissue').first().hasClass("hidden"))
            {
                $('#bookdeleteissue').first().addClass("hidden");
            }
        }
    }

    await showBooks();
}


async function addBookToCategory()
{
//    debugger;
    let bookCategory = {};
    bookCategory.bookId = $('#editbookid').first().val();
    bookCategory.categoryId = $('#editbookcategory').first().val();

    let response = await saveBookCategoryToServer(bookCategory);

    if (response.status)
    {
        const message = await response.text();
        $('#bookcategoryerror').first().removeClass("hidden");
        $("#bookcategoryerror").text(`Error: ${message}`);
    }
    else
    {
        if( !$('#bookcategoryerror').first().hasClass("hidden"))
        {
            $('#bookcategoryerror').first().addClass("hidden");
        }
        if( !$('#bookcategoryeditcore').first().hasClass("hidden"))
        {
            $('#bookcategoryeditcore').first().addClass("hidden");
        }
        await fillBookCategoryTable(bookCategory.bookId);
    }
}


async function deleteBookCategory(categoryId)
{
//    debugger;
    const bookId = $('#editbookid').first().val();
    const result = await deleteBookCategoryFromServer(bookId, categoryId);

    await fillBookCategoryTable(bookId);
}

async function applyFilter()
{
    debugger;
    const filtervalue = $('.filtervalue').first().val().toLowerCase();
    let books = await getFilterBookList(filtervalue);
    // books = books.filter(item => item.title.toLowerCase().indexOf(filtervalue) >= 0 || 
    // item.authorName.toLowerCase().indexOf(filtervalue) >= 0 ||
    // item.userName.toLowerCase().indexOf(filtervalue) >= 0 ||
    // item.bookDescription.toLowerCase().indexOf(filtervalue) >= 0 );
    fillBookTable(books);
}


async function resetFilter()
{
    $('.filtervalue').first().val('');
    let books = await getBookList();
    fillBookTable(books);
}

