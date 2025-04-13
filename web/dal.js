
async function fetchBooks() {
    try
    {
        let option = getOptionForGet()
        let response = await fetch('http://localhost:3000/api/book/all', option); // 
        let data = await response.json();  // 
        localStorage.setItem('books', JSON.stringify(data));
        return data;
    }
    catch(error)
    {
        debugger;
        console.error('Error fetching books:', error); // 
    }  
    return null;       
}

async function fetchBookById(bookId) {
    try
    {
        let option = getOptionForGet()
        let response = await fetch(`http://localhost:3000/api/book/byid/${bookId}}`, option); // 
        let data = await response.json();  // 
        localStorage.setItem('book', JSON.stringify(data));
        return data;
    }
    catch(error)
    {
        debugger;
        console.error('Error fetching book:', error); // 
    }
    return null;
}

async function fetchAuthors() {
    try
    {
        debugger;
        let option = getOptionForGet()
        let response = await fetch('http://localhost:3000/api/author/all', option); // 
        let data = await response.json();  // 
        localStorage.setItem('authors', JSON.stringify(data));
        return data;
    }
    catch(error)
    {
        debugger;
        console.error('Error fetching authors:', error); // 
    }  
}

async function fetchAuthorById(authorId) {
    try
    {
        let option = getOptionForGet()
        let response = await fetch(`http://localhost:3000/api/author/byid/${authorId}}`, option); // 
        let data = await response.json();  // 
        localStorage.setItem('author', JSON.stringify(data));
        return data;
    }
    catch(error)
    {
        debugger;
        console.error('Error fetching authors:', error); // 
    }
    return null;
}

async function fetchCategories() {
    try
    {
        debugger;
        let option = getOptionForGet()
        let response = await fetch('http://localhost:3000/api/category/all', option); // 
        let data = await response.json();  // 
        localStorage.setItem('categories', JSON.stringify(data));
        return data;
    }
    catch(error)
    {
        debugger;
        console.error('Error fetching categories:', error); // 
    }  
}

async function fetchCategoryById(categoryId) {
    try
    {
        let option = getOptionForGet()
        let response = await fetch(`http://localhost:3000/api/category/byid/${categoryId}}`, option); // 
        let data = await response.json();  // 
        localStorage.setItem('category', JSON.stringify(data));
        return data;
    }
    catch(error)
    {
        debugger;
        console.error('Error fetching category:', error); // 
    }
    return null;
}

async function fetchStates() {
    try 
    {
        let option = getOptionForGet()
        let response = await fetch('http://localhost:3000/api/state/all', option) // 
        let data = await response.json();  // 
        localStorage.setItem('states', JSON.stringify(data));
    }
    catch(error)
    {
        debugger;
        console.error('Error fetching states:', error); // 
    }  
}

function getOptionForGet() {
    let user = JSON.parse( localStorage.user );
    return {
        method: 'GET',
        headers: {
            Authorization: user.token
        }
      };    
}

function getOptionForPost() {
    let user = JSON.parse( localStorage.user );
    return {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          Authorization: user.token
        }
      };    
}

function getOptionForDelete() {
    let user = JSON.parse( localStorage.user );
    return {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          Authorization: user.token
        }
      };    
}


async function deleteBookFromServer(bookId) {
    try 
    {
        debugger;
        const option = getOptionForDelete();
        let response = await fetch(`http://localhost:3000/api/book/${bookId}}`, option) // 
        debugger;
        let result = null;
        if (response.status != 400)
        {
            debugger;
            result = await response.json();  // 
        }
        return response;
    }
    catch(error)
    {
        debugger;
        console.error(`Error deleting book: ${bookId}`, error); // 
    }  
}

async function deleteAuthorFromServer(authorId) {
    try 
    {
        debugger;
        const option = getOptionForDelete();
        let response = await fetch(`http://localhost:3000/api/author/${authorId}}`, option) // 
        debugger;
        let result = null;
        if (response.status != 400)
        {
            debugger;
            result = await response.json();  // 
        }
        return response;
    }
    catch(error)
    {
        debugger;
        console.error(`Error deleting author: ${authorId}`, error); // 
    }  
}

async function deleteCategoryFromServer(categoryId) {
    try 
    {
        debugger;
        const option = getOptionForDelete();
        let response = await fetch(`http://localhost:3000/api/category${categoryId}}`, option) // 
        debugger;
        let result = null;
        if (response.status != 400)
        {
            debugger;
            result = await response.json();  // 
        }
        return response;
    }
    catch(error)
    {
        debugger;
        console.error(`Error deleting category: ${categoryId}`, error); // 
    }  
}

async function login(userName, password) {
    try 
    {
//        debugger;
        const option = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                userName : userName,
                password : password
            })
          }
        let response = await fetch('http://localhost:3000/api/login', option) // 
        let user = null;
        if (response.status != 400)
            user = await response.json();  // 
        localStorage.setItem('user', JSON.stringify(user));
        return user;
    }
    catch(error)
    {
        debugger;
        console.error('Error fetching states:', error); // 
    }  
}