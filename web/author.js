
function getAuthorList()
{
    //data = loadFromLocalStorage();
    let authors = data.authors();
    return authors;
}


async function saveAuthorForm()
{
    let author = {};
    author.authorId = $('#authorid').first().val();
    author.authorName = $('#authorname').first().val();
    await saveAuthor(author);
    await showAuthors();
}

async function saveAuthor(author)
{
//    debugger;
    author = await saveAuthorToServer(author);
    debugger;
    let authors = JSON.parse( localStorage.authors );
    if (authors)
    {
        let idx = authors.findIndex(t => t.authorId == author.authorId);
        if (idx > -1)
        {
            authors[idx] = author;
        }
        else
        {
            authors.push(author);
        }
        localStorage.setItem('authors', JSON.stringify(authors));
    
    }

}

async function deleteAuthor()
{
    debugger;
    const authorId = $('#deleteauthorid').first().val();
    const result = await deleteAuthorFromServer(authorId);
    if (result)
    {
        let authors = JSON.parse( localStorage.authors );
        authors = authors.filter(function(item) {
            item.authorId != authorId
        });
        localStorage.setItem('authors', JSON.stringify(authors));
    }

    await showAuthors();
}

function fillAuthorTable(authors)
{
    debugger;
 
    let results = $('#authortable'); // получаем нужный элемент
    results.empty(); //очищаем элемент
 
    results.append('<thead><tr><th>Id</th><th>Name</th><th>Last Update</th><th></th></tr></thead><tbody>')
    for (let i = 0; i < authors.length; i++) {
        results.append('<tr><td>' + authors[i].authorId + '</td> <td>' + authors[i].authorName +
            '</td><td>' + authors[i].lastUpdate +
            '</td><td><button class="editauthor"+ data-id="' + authors[i].authorId + '">Edit</button>' +
            '</td><td><button class="deleteauthor"+ data-id="' + authors[i].authorId + '">Delete</button></td><tr/>'); 
    }
    results.append('</tbody>')
}


async function cancelAuthorForm()
{
    await showAuthors();
}

async function fillAuthorForm(authorId)
{
    showAuthorEdit();
    if (authorId)
    {
        let author = await fetchAuthorById(authorId);
        $('#authorid').first().val(author.authorId);
        $('#authorname').first().val(author.authorName);
        $("#authoreditlabel").text("Edit Author");
    }
    else
    {
        $('#authorid').first().val('');
        $('#authorname').first().val('');
        $("#authoreditlabel").text("Add Author");
    }
}

async function fillDeleteAuthorForm(authorId)
{
    if (authorId)
    {
        let author = await fetchAuthorById(authorId);
        if (author)
        {
            showAuthorDelete();
            if (author.books)
            {

            }
            else
            {
                $('#deleteauthorid').first().val(author.authorId);
                $('#deleteauthorname').first().val(author.authorName);
            }
        }
    }
}
