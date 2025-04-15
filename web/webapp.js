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
    $('body').on('click', '.editbook',async function(e){
        e.preventDefault();
        const id = this.dataset.id;
        await fillBookForm(id);
    });
    $('body').on('click', '.editauthor', async function(e){
        debugger;
        e.preventDefault();
        const id = this.dataset.id;
        await fillAuthorForm(id);
    });
    $('body').on('click', '.editcategory',async function(e){
        e.preventDefault();
        const id = this.dataset.id;
        await fillCategoryForm(id);
    });
    $('body').on('click', '.deletebook',async function(e){
        e.preventDefault();
        const id = this.dataset.id;
        await fillDeleteBookForm(id);
    });
    $('body').on('click', '.deleteauthor', async function(e){
        debugger;
        e.preventDefault();
        const id = this.dataset.id;
        await fillDeleteAuthorForm(id);
    });
    $('body').on('click', '.deletecategory',async function(e){
        e.preventDefault();
        const id = this.dataset.id;
        await fillDeleteCategoryForm(id);
    });
    $('body').on('click', '.newreadingstate',async function(e){
        e.preventDefault();
        const id = this.dataset.id;
        await newReadingState(id);
    });

    $('body').on('click', '#addbook',async function(e){
        e.preventDefault();
        await fillBookForm(null);
    });
    $('body').on('click', '#addauthor', async function(e){
        debugger;
        e.preventDefault();
        await fillAuthorForm(null);
    });
    $('body').on('click', '#addcategory',async function(e){
        e.preventDefault();
        await fillCategoryForm(null);
    });
    $('body').on('click', '#addbookstate',async function(e){
        e.preventDefault();
        await fillBookStateForm(null);
    });
 
    $('body').on('click', '#savebook',async function(e){
        e.preventDefault();
        await saveBookForm(null);
    });

    $('body').on('click', '#saveauthor',async function(e){
        debugger;
        e.preventDefault();
        await saveAuthorForm();
    });

    $('body').on('click', '#savecategory',async function(e){
        e.preventDefault();
        await saveCategoryForm();
    });

    $('body').on('click', '#savenewstate',async function(e){
        e.preventDefault();
        await savenewstateForm();
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

    // $('body').on('click', '#deleteCategorybutton, deleteCategoryexec',async function(e){
    //     debugger;
    //     e.preventDefault();
    //     await deleteCategory();
    // });

    $('body').on('click', '.deleteCategoryexec',async function(e){
        debugger;
        e.preventDefault();
        await deleteCategory();
    });

    $('body').on('click', '#cancelbook',async function(e){
        e.preventDefault();
        await cancelBookForm(null);
    });
    $('body').on('click', '#cancelauthor', async function(e){
        debugger;
        e.preventDefault();
        await cancelAuthorForm();
    });
    $('body').on('click', '#cancelcategory',async function(e){
        e.preventDefault();
        await cancelCategoryForm();
    });
    $('body').on('click', '#cancelnewstate',async function(e){
        e.preventDefault();
        await cancelNewStateForm();
    });


    $('body').on('click', '#canceldeleteBook',async function(e){
        debugger;
        e.preventDefault();
        await showBook();
    });

    $('body').on('click', '.canceldeleteauthor',async function(e){
        debugger;
        e.preventDefault();
        await showAuthors();
    });

    $('body').on('click', '#canceldeletecategory',async function(e){
        debugger;
        e.preventDefault();
        await showCategories();
    });

    $('body').on('click', '#applylogin', async function(e){
        e.preventDefault();
        await applyLogin();
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
    if( !$('#bookdeletepart').first().hasClass("hidden")){
        $('#bookdeletepart').first().addClass("hidden");
    }
    if( !$('#authordeletepart').first().hasClass("hidden")){
        $('#authordeletepart').first().addClass("hidden");
    }
    if( !$('#categorydeletepart').first().hasClass("hidden")){
        $('#categorydeletepart').first().addClass("hidden");
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
//    debugger;
    hiddenAll();
    $('#categorypart').first().removeClass("hidden");
    let categories = await fetchCategories();
    fillCategoryTable(categories);
}

async function showAuthors()
{
//    debugger;
    hiddenAll();
    $('#authorpart').first().removeClass("hidden");
    let authors = await fetchAuthors();
    fillAuthorTable(authors);
}

function showCategoryEdit()
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
