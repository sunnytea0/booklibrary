

async function fillCategoryForm(categoryId)
{
//    debugger;
    showCategoryEdit();
    if( !$('#categoryediterror').first().hasClass("hidden")){
        $('#categoryediterror').first().addClass("hidden");
    }
    if (categoryId)
    {
        let category = await fetchCategoryById(categoryId);
        if ( category)
        {
            $('#categoryid').first().val(category.categoryId);
            $('#categoryname').first().val(category.categoryName ?? '');
            $('#categorydescription').first().val(category.categoryDescription ?? '');
            $("#categoryeditlabel").text("Edit Category");
        }
    }
    else
    {
        $('#categoryid').first().val('');
        $('#categoryname').first().val('');
        $("#categoryeditlabel").text("Add Category");
    }
}

async function saveCategoryForm()
{
//    debugger;
    let category = {};
    category.categoryId = $('#categoryid').first().val();
    category.categoryName = $('#categoryname').first().val();
    category.categoryDescription = $('#categorydescription').first().val();
    if (category.categoryName && category.categoryDescription)
    {
        let response = await saveCategory(category);
        if (response.status)
        {
            const message = await response.text();
            $('#categoryediterror').first().removeClass("hidden");
            $("#categoryediterror").text(`Error: ${message}`);
        }
        else
        {
            if( !$('#categoryediterror').first().hasClass("hidden")){
                $('#categoryediterror').first().addClass("hidden");
            }
            await showCategories();
        }
    }
}

async function saveCategory(category)
{
    debugger;
    let response  = await saveCategoryToServer(category);
    if (response.status)
        return response;
    category = response;
    let categories = JSON.parse( localStorage.categories );
    let idx = categories.findIndex(t => t.categoryId == category.categoryId);
    if (idx > -1)
    {
        categories[idx] = category;
    }
    else
    {
        categories.push(category);
    }
    localStorage.setItem('categories', JSON.stringify(categories));
    fillCategorySelects();
    return response;
}

async function cancelCategoryForm()
{
    await showCategories();
}

function fillCategoryTable(categories)
{
//    debugger;
    var results = $('#categorytable');  // 
    results.empty();                    // clear element
    results.append('<thead><tr><th>Id</th><th>Name</th><th>Description</th><th>Last Update</th></tr></thead><tbody>')
    for (var i = 0; i < categories.length; i++) {
        results.append( `<tr><td>${categories[i].categoryId}</td> 
            <td>${categories[i].categoryName}</td> 
            <td>${categories[i].categoryDescription}</td> 
            <td>${categories[i].lastUpdate}</td>
            <td class="onlyadmin"><button class="editcategory" data-id="${categories[i].categoryId}">Edit</button></td>
            <td class="onlyadmin"><button class="deletecategory" data-id="${categories[i].categoryId}">Delete</button></td>
            <td><button class="showcategorybooks" data-id="${categories[i].categoryId}">Show books</button></td>
            <tr/>`); 
    }
    let user = JSON.parse(sessionStorage.getItem('user'));
    if (user.role != 'Admin')
    {
        $('.onlyadmin').addClass("hidden");
    }
}

async function fillDeleteCategoryForm(categoryId)
{
    if (categoryId)
    {
        let category = await fetchCategoryById(categoryId);
        if (category)
        {
            showCategoryDelete();
            if ((category.books?.length ?? 0) > 0)
            {
                if( !$('#categorydeleteaction').first().hasClass("hidden")){
                    $('#categorydeleteaction').first().addClass("hidden");
                }
                $('#categorydeleteissue').first().removeClass("hidden");
                $("#categoryeditlabel").text("Category has books. Category can not be deleted");
    
                var results = $('#categorydeleteissuetable');  // 
                results.empty();                // clear element
                results.append('<thead><tr><th>Id</th><th>Title</th></thead><tbody>')
                for (var i = 0; i < category.books.length; i++) {
                    results.append('<tr><td>' + category.books[i].bookId + '</td> <td>' + category.books[i].title + '</td></tr>'); 
                }
            }
            else
            {            
                if( !$('#categorydeleteissue').first().hasClass("hidden")){
                    $('#categorydeleteissue').first().addClass("hidden");
                }
                $('#categorydeleteaction').first().removeClass("hidden");

                $('#deletecategoryid').first().val(category.categoryId);
                $('#deletecategoryname').first().val(category.categoryName);
            }
        }
    }
}


async function deleteCategory()
{
//    debugger;
    const categoryId = $('#deletecategoryid').first().val();
    const result = await deleteCategoryFromServer(categoryId);
    if (result)
    {
        let categories = JSON.parse( localStorage.categories );
        categories = categories.filter(function(item) {
            item.categoryId != categoryId
        });
        localStorage.setItem('categories', JSON.stringify(categories));
    }

    await showCategories();
}
