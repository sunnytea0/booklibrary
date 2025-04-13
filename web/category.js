
async function saveCategoryForm()
{
    let category = {};
    category.id = $('#categoryid').first().val();
    category.name = $('#categoryname').first().val();
    category.description = $('#categorydescription').first().val();
    saveCategory(category);
    await showCategories();
}

function saveCategory(category)
{
//    debugger;
    let idx = data.categories.findIndex(t => t.categoryCd == category.categoryId);
    if (idx > -1)
    {
        data.categories[idx] = category;
    }
    else
    {
        data.categories.push(category);
    }
    saveToLocalStorage(data);

}

async function cancelCategoryForm()
{
    await showCategories();
}


function fillCategoryTable(categories)
{
    debugger;
    var results = $('#categorytable');  // 
    results.empty();                    // clear element
    results.append('<thead><tr><th>Id</th><th>Name</th><th>Description</th><th>Last Update</th><th></th></tr></thead><tbody>')
    for (var i = 0; i < categories.length; i++) {
        results.append('<tr><td>' + categories[i].categoryId + '</td> <<td>' + categories[i].categoryName +
            '</td> <<td>' + categories[i].categoryDescription +
            '</td> <<td>' + categories[i].lastUpdate +
            '</td><td><button class="editcategory"+ data-id="' + categories[i].categoryId + '">Edit</button></td></tr>'); // add row
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
            $('#deletecategoryid').first().val(category.categoryId);
            $('#deletecategoryname').first().val(category.categoryName);
        }
    }
}


async function deleteCategory()
{
    debugger;
    const categoryId = $('#deletecategoryid').first().val();
    const result = await deleteAuthorFromServer(categoryId);
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
