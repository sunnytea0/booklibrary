var data = null;
window.urlOption = {
    host: "http://localhost:3001"
};

$(document).ready(async function(){
//   debugger;
    $('form').validate();

    createEventHandlers();
    window.user = JSON.parse(sessionStorage.getItem('user'));
    
    if (window.user) {
        await prepare();
        await showBooks();
    } else {
        showLogin();
    }
  
});

function logout()
{
    window.user = null;
    sessionStorage.setItem('user', null)
    showLogin();
}

async function prepare()
{
//    debugger;
    await fetchStates();
    await fetchAuthors();
    await fetchCategories();
    fillSelects();
    let user = JSON.parse(sessionStorage.getItem('user'));
    if (user.role != 'Admin')
    {
        if( !$('#usersref').first().hasClass("hidden")){
            $('#usersref').first().addClass("hidden");
        }
    }
    $('.topmenu').first().removeClass("hidden");
}

async function getBookList()
{

    if (localStorage.books)
        return JSON.parse( localStorage.books );
    let books = await fetchBooks();
    return books;
}

function getAuthorList()
{

    if (localStorage.authors)
        return JSON.parse( localStorage.authors );
    let authors = fetchAuthors();
    return authors;
}

function getCategoryList()
{

    if (localStorage.categories)
        return JSON.parse( localStorage.categories );
    let categories = fetchCategories();
    return categories;
}

function getStateList()
{

    if (localStorage.states)
        return JSON.parse( localStorage.states );
    let states = fetchStates();
    return states;
}

function createEventHandlers()
{
 //   debugger;
    $('body').on('click', '.editbook',async function(e){
 //       debugger;
        e.preventDefault();
        const id = this.dataset.id;
        await fillBookForm(id);
    });
    $('body').on('click', '.editauthor', async function(e){
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
//        debugger;
        const id = this.dataset.id;
        await fillDeleteBookForm(id);
    });
    $('body').on('click', '.deleteauthor', async function(e){
 //       debugger;
        e.preventDefault();
        const id = this.dataset.id;
        await fillDeleteAuthorForm(id);
    });
    $('body').on('click', '.deletecategory',async function(e){
        e.preventDefault();
        const id = this.dataset.id;
        await fillDeleteCategoryForm(id);
    });
    $('body').on('click', '.showauthorbooks',async function(e){
        e.preventDefault();
        const id = this.dataset.id;
        let div = $('#authorbooktable');  // 
        let authorbooks = await fetchBooksByAuthor(id);
        await fillBookTableToDiv(authorbooks, div);
    });
    $('body').on('click', '.showcategorybooks',async function(e){
        e.preventDefault();
//        debugger;
        const id = this.dataset.id;
        let div = $('#categorybooktable');  // 
        let categorybooks = await fetchBooksByCategory(id);
        await fillBookTableToDiv(categorybooks, div);
    });
    $('body').on('click', '.showuserbooks',async function(e){
        e.preventDefault();
 //       debugger;
        const id = this.dataset.id;
        let div = $('#userbooktable');  // 
        let userbooks = await fetchBooksByUser(id);
        await fillBookTableToDiv(userbooks, div);
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
//        debugger;
        e.preventDefault();
        await fillAuthorForm(null);
    });
    $('body').on('click', '#addcategory',async function(e){
        e.preventDefault();
        await fillCategoryForm(null);
    });
    // $('body').on('click', '#addbookstate',async function(e){
    //     e.preventDefault();
    //     await fillBookStateForm(null);
    // });
 

    $('body').on('click', '#savenewstate',async function(e){
        e.preventDefault();
//        debugger;
        await saveNewState();
    });

    $('body').on('click', '#deletebookbutton',async function(e){
//        debugger;
        e.preventDefault();
        await deleteBook();
    });

    $('body').on('click', '#deleteauthorbutton',async function(e){
//        debugger;
        e.preventDefault();
        await deleteAuthor();
    });

    $('body').on('click', '.deletecategoryexec', async function(e){
 //       debugger;
        e.preventDefault();
        await deleteCategory();
    });

    $('body').on('click', '#cancelbook',async function(e){
        e.preventDefault();
        await cancelBookForm(null);
    });
    $('body').on('click', '#cancelauthor', async function(e){
//        debugger;
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


    $('body').on('click', '#canceldeletebook',async function(e){
//        debugger;
        e.preventDefault();
        await showBooks();
    });

    $('body').on('click', '.canceldeleteauthor',async function(e){
//        debugger;
        e.preventDefault();
        await showAuthors();
    });

    $('body').on('click', '#canceldeletecategory',async function(e){
//        debugger;
        e.preventDefault();
        await showCategories();
    });

    $('body').on('click', '#loginref',async function(e){
//        debugger;
        e.preventDefault();
        await showLogin();
    });

    // $('body').on('click', '#applylogin', async function(e){
    //     e.preventDefault();
    //     await applyLogin();
    // });

    $('body').on('click', '#cancellogin', async function(e){
        $("#loginresult").text("");
    });

    // $('body').on('click', '#applyregister', async function(e){
    //     e.preventDefault();
    //     await applyRegister();
    // });

    $('body').on('click', '#regisaterref', function(e){
        e.preventDefault();
        showRegister();
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

    $('body').on('click', '#usersref', async function(e){
        e.preventDefault();
        await showUsers();
    });

    $('body').on('click', '#logoutref', async function(e){
        e.preventDefault();
        await logout();
    });

    $('body').on('click', '#addbookcategory', async function(e){
        e.preventDefault();
        $('#bookcategoryeditcore').first().removeClass("hidden");
    });

    $('body').on('click', '#addbookcategoryaction', async function(e){
        e.preventDefault();
        await addBookToCategory();
    });

    $('body').on('click', '#cancelbookcategory', async function(e){
        e.preventDefault();
        if( !$('#bookcategoryeditcore').first().hasClass("hidden")){
            $('#bookcategoryeditcore').first().addClass("hidden");
        }
        if( !$('#bookcategoryerror').first().hasClass("hidden")){
            $('#bookcategoryerror').first().addClass("hidden");
        }
    });

    $('body').on('click', '.deletebookcategory', async function(e){
        e.preventDefault();
//        debugger;
        const id = this.dataset.id;
        await deleteBookCategory(id);
    });

    $('body').on('click', '.applyfilter', async function(e){
        e.preventDefault();
//        debugger;
        await applyFilter();
    });

    $('body').on('click', '.resetfilter', async function(e){
        e.preventDefault();
 //       debugger;
        await resetFilter();
    });

    // $('body').on('click', '#savebook',async function(e){
    //     e.preventDefault();
    //     await saveBookForm(null);
    // });

    // $('body').on('click', '#saveauthor',async function(e){
    //     debugger;
    //     e.preventDefault();
    //     await saveAuthorForm();
    // });

    // $('body').on('click', '#savecategory',async function(e){
    //     e.preventDefault();
    //     await saveCategoryForm();
    // });

    const loginForm = document.getElementById("loginform");
    loginForm.addEventListener("submit", async (e)=>{
        e.preventDefault();
//        debugger;
        await applyLogin();
    });

    const registerForm = document.getElementById("registerform");
    registerForm.addEventListener("submit", async (e)=>{
        e.preventDefault();
//        debugger;
        await applyRegister();
    });

    const bookEditForm = document.getElementById("bookeditform");
    bookEditForm.addEventListener("submit", async (e)=>{
        e.preventDefault();
//        debugger;
        await saveBookForm(null);
    });

    const authorEditForm = document.getElementById("authoreditform");
    authorEditForm.addEventListener("submit", async (e)=>{
        e.preventDefault();
//        debugger;
        await saveAuthorForm();
    });

    const categoryEditForm = document.getElementById("categoryeditform");
    categoryEditForm.addEventListener("submit", async (e)=>{
        e.preventDefault();
//        debugger;
        await saveCategoryForm();
    });

}

function  fillSelects()
{
//    debugger;
    fillCategorySelects();

    fillAuthorSelects();

    let readingStates = getStateList();
    newreadingstate = $('#bookreadingstate'); 
    newreadingstate.empty(); 
    for (let i = 0; i < readingStates.length; i++) {
        const stateOption = `<option value="${readingStates[i].readingStateId}">${readingStates[i].stateName}</option>`;
        newreadingstate.append(stateOption); 
    }

}
function  fillCategorySelects()
{
//    debugger;
    let categories = getCategoryList();
    let bookcategory = $('#editbookcategory'); 
    bookcategory.empty(); 
    for (let i = 0; i < categories.length; i++) {
        const categoryOption = `<option value="${categories[i].categoryId}">${categories[i].categoryName}</option>`;
        bookcategory.append(categoryOption); 
    }

}

function  fillAuthorSelects()
{
//    debugger;
    let authors = getAuthorList();
    let bookauthor = $('#editbookauthor'); 
    bookauthor.empty(); 
    for (let i = 0; i < authors.length; i++) {
        const bookOption = `<option value="${authors[i].authorId}">${authors[i].authorName}</option>`;
        bookauthor.append(bookOption); 
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
    if( !$('#userpart').first().hasClass("hidden")){
        $('#userpart').first().addClass("hidden");
    }
    if( !$('#bookeditpart').first().hasClass("hidden")){
        $('#bookeditpart').first().addClass("hidden");
    }
    if( !$('#authoreditpart').first().hasClass("hidden")){
        $('#authoreditpart').first().addClass("hidden");
    }
    if( !$('#categoryeditpart').first().hasClass("hidden")){
        $('#categoryeditpart').first().addClass("hidden");
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
    if( !$('#registerdiv').first().hasClass("hidden")){
        $('#registerdiv').first().addClass("hidden");
    }
    
}

function showLogin()
{
    hiddenAll();
    if( !$('#topmenu').first().hasClass("hidden")){
        $('#topmenu').first().addClass("hidden");
    }
    $('#login').first().removeClass("hidden");
}

function showRegister()
{
    hiddenAll();
    $('#registerdiv').first().removeClass("hidden");
}

async function showBooks()
{
//    debugger;
    hiddenAll();
    $('#bookpart').first().removeClass("hidden");
    $('#bookmain').first().removeClass("hidden");
    let books = await fetchBooks();
    fillBookTable(books);
}

async function showCategories()
{
//    debugger;
    hiddenAll();
    $('#categorypart').first().removeClass("hidden");
    $('#categorymain').first().removeClass("hidden");
    let categories = await fetchCategories();
    fillCategoryTable(categories);
}

async function showUsers()
{
//    debugger;
    hiddenAll();
    $('#userpart').first().removeClass("hidden");
    let users = await fetchUsers();
    fillUserTable(users);
}

async function showAuthors()
{
//    debugger;
    hiddenAll();
    $('#authorpart').first().removeClass("hidden");
    $('#authormain').first().removeClass("hidden");
    let authors = await fetchAuthors();
    fillAuthorTable(authors);
}main

function showBookEdit()
{
    if( !$('#bookmain').first().hasClass("hidden")){
        $('#bookmain').first().addClass("hidden");
    }

    $('#bookeditpart').first().removeClass("hidden");
}

function showAuthorEdit()
{
    if( !$('#authormain').first().hasClass("hidden")){
        $('#authormain').first().addClass("hidden");
    }

    $('#authoreditpart').first().removeClass("hidden");
}

function showCategoryEdit()
{
    if( !$('#cagtegorymain').first().hasClass("hidden")){
        $('#cagtegorymain').first().addClass("hidden");
    }

    $('#categoryeditpart').first().removeClass("hidden");
}


function showBookDelete()
{
    if( !$('#bookmain').first().hasClass("hidden")){
        $('#bookmain').first().addClass("hidden");
    }

    $('#bookdeletepart').first().removeClass("hidden");
}

function showAuthorDelete()
{
    if( !$('#authormain').first().hasClass("hidden")){
        $('#authormain').first().addClass("hidden");
    }

    $('#authordeletepart').first().removeClass("hidden");
}

function showCategoryDelete()
{
    if( !$('#cagtegorymain').first().hasClass("hidden")){
        $('#cagtegorymain').first().addClass("hidden");
    }

    $('#categorydeletepart').first().removeClass("hidden");
}

function showNewState()
{
    $('#newstatepart').first().removeClass("hidden");
}

async function applyLogin()
{
 //   debugger;
    const userName = $('#loginname').first().val();
    const password = $('#loginpassword').first().val();
    if (userName && password)
    {
        let user = await login(userName, password);
        if (user)
        {
            $("#loginresult").text("");
            await prepare();
            await showBooks();
        }
        else
        {
            $("#loginresult").text("Wrong user name or password");
        }
    }
}

async function applyRegister()
{
//    debugger;
    const userName = $('#registername').first().val();
    const password = $('#registerpassword').first().val();
    const confirmPassword = $('#registerconfirmpassword').first().val();
    if (password !== confirmPassword)
    {
            $("#loginresult").text("Passwords are different");
    }
    if (userName && password)
    {
        let user = await register(userName, password);
 //       debugger;
        if (user)
        {
            $("#registerresult").text("");
            await prepare();
            await showBooks();
        }
        else
        {
            $("#registerresult").text("Register error");
        }

    }

}
