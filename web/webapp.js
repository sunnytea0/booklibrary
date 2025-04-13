var data = null;

$(document).ready(async function(){
//    debugger;
    createEventHandlers();
    window.user = JSON.parse( sessionStorage.getItem('user') );
    if (window.user)
    {
        await prepare();
        await showBooks();
    }
    else
    {
        showLogin();
    }
    
});

async function prepare()
{
    await fetchStates();
    await fetchAuthors();
    await fetchCategories();
    fillSelects();
}

function getBookList()
{
    //data = loadFromLocalStorage();
    return data.books;
}

function getUserList()
{
    //data = loadFromLocalStorage();
    return data.users;
}

function getAuthorList()
{
    //data = loadFromLocalStorage();
    let authors = data.authors;
    return authors;
}

function getCategoryList()
{
    //data = loadFromLocalStorage();
    let categories = data.categories;
    return categories;
}



function createEventHandlers()
{
 //   debugger;
    $('body').on('click', '.editbook', function(e){
        e.preventDefault();
        const id = this.dataset.id;
        fillBookTable(id);
    });
    $('body').on('click', '.editauthor', async function(e){
        debugger;
        e.preventDefault();
        const id = this.dataset.id;
        fillAuthorForm(id);
    });
    $('body').on('click', '.editcategory', function(e){
        e.preventDefault();
        const id = this.dataset.id;
        fillCategoryForm(id);
    });
    $('body').on('click', '.deletebook', function(e){
        e.preventDefault();
        const id = this.dataset.id;
        fillDeleteBookForm(id);
    });
    $('body').on('click', '.deleteauthor', async function(e){
        debugger;
        e.preventDefault();
        const id = this.dataset.id;
        fillDeleteAuthorForm(id);
    });
    $('body').on('click', '.deletecategory', function(e){
        e.preventDefault();
        const id = this.dataset.id;
        fillDeleteCategoryForm(id);
    });
    $('body').on('click', '.newreadingstate', function(e){
        e.preventDefault();
        const id = this.dataset.id;
        newReadingState(id);
    });

    $('body').on('click', '#addbook', function(e){
        e.preventDefault();
        fillBookForm(null);
    });
    $('body').on('click', '#addauthor', async function(e){
        debugger;
        e.preventDefault();
        fillAuthorForm(null);
    });
    $('body').on('click', '.addcategory', function(e){
        e.preventDefault();
        fillCategoryForm(null);
    });
    $('body').on('click', '#addbookstate', function(e){
        e.preventDefault();
        fillBookStateForm(null);
    });
 
    $('body').on('click', '#savebook', function(e){
        e.preventDefault();
        saveBookForm(null);
    });

    $('body').on('click', '#saveauthor',async function(e){
        debugger;
        e.preventDefault();
        await saveAuthorForm();
    });

    $('body').on('click', '#savecategory', function(e){
        e.preventDefault();
        saveCategoryForm();
    });

    $('body').on('click', '#savenewstate', function(e){
        e.preventDefault();
        savenewstateForm();
    });

    $('body').on('click', '#deleteBookbutton',async function(e){
        debugger;
        e.preventDefault();
        await deleteBook();
    });

    $('body').on('click', '#deleteauthorbutton',async function(e){
        debugger;
        e.preventDefault();
        await deleteAuthor();
    });

    $('body').on('click', '#deleteCategorybutton',async function(e){
        debugger;
        e.preventDefault();
        await deleteCategory();
    });

    $('body').on('click', '#cancelbook', function(e){
        e.preventDefault();
        cancelBookForm(null);
    });
    $('body').on('click', '#cancelauthor', async function(e){
        debugger;
        e.preventDefault();
        await cancelAuthorForm();
    });
    $('body').on('click', '#cancelcategory', function(e){
        e.preventDefault();
        cancelCategoryForm();
    });
    $('body').on('click', '#cancelnewstate', function(e){
        e.preventDefault();
        cancelNewStateForm();
    });
    $('body').on('click', '#applylogin', async function(e){
        e.preventDefault();
        applyLogin();
    });
    $('body').on('click', '#booksref', async function(e){
        e.preventDefault();
        await showBooks();
    });
    $('body').on('click', '#authorsref', async function(e){
        e.preventDefault();
        await showAuthors();
    });
    $('body').on('click', '#categoriesref', async function(e){
        e.preventDefault();
        await showCategories();
    });
}

function  fillSelects()
{
    let categories = getCategoryList();
    let bookcategory = $('#bookcategory'); 
    bookcategory.empty(); 
    for (let i = 0; i < categories.length; i++) {
        bookcategory.append('<option value="' + categories[i].categoryId + '">' + categories[i].categoryName + '</option>'); 
    }

    let authors = getAuthorList();
    let bookauthor = $('#bookauthor'); 
    bookauthor.empty(); 
    for (let i = 0; i < authors.length; i++) {
        bookauthor.append('<option value="' + authors[i].id + '">' + authors[i].email + '</option>'); 
    }

    let readingStates = JSON.parse( localStorage.readingStates );;
    newreadingstate = $('#newreadingstate'); 
    newreadingstate.empty(); 
    for (let i = 0; i < readingStates.length; i++) {
        newreadingstate.append('<option value="' + readingStates[i].readingStateId + '">' + readingStates[i].stateName + '</option>'); 
    }

}

function hiddenAll()
{
    if( !$('#bookpart').first().hasClass("hidden")){
        $('#bookpart').first().addClass("hidden");
    }
    if( !$('#authorpart').first().hasClass("hidden")){
        $('#authorpart').first().addClass("hidden");
    }
    if( !$('#categorypart').first().hasClass("hidden")){
        $('#categorypart').first().addClass("hidden");
    }
    if( !$('#categoryeditpart').first().hasClass("hidden")){
        $('#categoryeditpart').first().addClass("hidden");
    }
    if( !$('#authoreditpart').first().hasClass("hidden")){
        $('#authoreditpart').first().addClass("hidden");
    }
    if( !$('#newstatepart').first().hasClass("hidden")){
        $('#newstatepart').first().addClass("hidden");
    }
    if( !$('#login').first().hasClass("hidden")){
        $('#login').first().addClass("hidden");
    }
    
}

function showLogin()
{
    hiddenAll();
    $('#login').first().removeClass("hidden");
}

async function showBooks()
{
    debugger;
    hiddenAll();
    $('#bookpart').first().removeClass("hidden");
    let books = await fetchBooks();
    fillBookTable(books);
}

async function showCategories()
{
    debugger;
    hiddenAll();
    $('#categorypart').first().removeClass("hidden");
    let categories = await fetchCategories();
    fillCategoryTable(categories);
}

async function showAuthors()
{
    debugger;
    hiddenAll();
    $('#authorpart').first().removeClass("hidden");
    let authors = await fetchAuthors();
    fillAuthorTable(authors);
}

function showEditCategory()
{
    hiddenAll();
    $('#categoryeditpart').first().removeClass("hidden");
}

function showAuthorEdit()
{
    hiddenAll();
    $('#authoreditpart').first().removeClass("hidden");
}


function showBookDelete()
{
    hiddenAll();
    $('#bookdeletepart').first().removeClass("hidden");
}

function showAuthorDelete()
{
    hiddenAll();
    $('#authordeletepart').first().removeClass("hidden");
}

function showCategoryDelete()
{
    hiddenAll();
    $('#categorydeletepart').first().removeClass("hidden");
}

function showNewState()
{
    $('#newstatepart').first().removeClass("hidden");
}

function saveToLocalStorage(data)
{
    localStorage.setItem('authors', JSON.stringify(data.authors));
    localStorage.setItem('categories', JSON.stringify(data.categories));
    localStorage.setItem('books', JSON.stringify(data.books));
}

function loadFromLocalStorage()
{
    let authors = JSON.parse( localStorage.authors );
    let categories = JSON.parse( localStorage.categories );
    let books = JSON.parse( localStorage.books );
    books.forEach( book => {
        book.author = authors.find(a => a.authorId == author.authorId);
    })

    return {authors: authors, categories: categories, books: books};
}

async function applyLogin()
{
//    debugger;
    const userName = $('#loginname').first().val();
    const password = $('#loginpassword').first().val();
    let user = await login(userName, password);
    if (user)
    {
        $("#loginresult").text("");
        await showBooks();
    }
    else
    {
        $("#loginresult").text("Wrong user name or password");
    }
}
