let serverURL;
let serverPort;
let url;
let editing = false;
let id;
//
$(document).ready(() => {
    $.ajax({
        url: 'config.json',
        type: 'GET',
        dataType: 'json',
        success:function(keys){
            serverURL = keys.SERVER_URL;
            serverPort = keys.SERVER_PORT;
            url = `${keys.SERVER_URL}:${keys.SERVER_PORT}`;
            showItems();
        },
        error: function(err){
            console.log(`Sorry, but we couldn't find a config.json!`);
        }
    });
    if(sessionStorage.userName){
        hideRegisterBtn();
        hideLoginBtn();
        showLogoutBtn();
        showAddItemForm();
    } else {
        showRegisterBtn();
        showLoginBtn();
        hideLogoutBtn();
        hideAddItemForm();
    }
});

// bought === true issues
showItems = () => {
    $.ajax({
        url: `${url}/allItems`,
        type: 'GET',
        dataType: 'json',
        success: function(data){
            console.log(data);
            $('#cardContainer').find('.row').empty();
            for (var i = 0; i < data.length; i++) {
                let itemCard = `
                <div class="col-12 col-md-4">
                <div class="card" data-id="${data[i]._id}">
                <div class="card-body">
                <div id="worktitle" class="card-title">
                <div class="cardImg" style="background-image: url(${url}/${data[i].image_URL}); height: 200px; width: 100%; background-size: contain;background-repeat: no-repeat;background-position: top;" >
                </div>
                <h5 class="card-title text-center mt-3" >${data[i].item_name}</h5>
                <p class="text-center">$ ${data[i].price}</p>`;
                if (data[i].bought == true) {
                    itemCard += `<p class="text-center">Sold out</p>`;
                }
                itemCard += `</div>`;
                if(sessionStorage.userID === data[i].user_id) {
                    itemCard += `<div class="btnSet d-flex justify-content-center">
                    <button class="btn btn-warning btn-sm mr-1 editBtn">EDIT</button>
                    <button class="btn btn-danger btn-sm removeBtn">REMOVE</button>
                    </div>`;
                }
                itemCard += `<div class="btnSet d-flex justify-content-center">
                <button class="btn btn-secondary btn-sm mr-1 moreInfoBtn" data-toggle="modal" data-target="#singleItemModal">MORE INFO</button>`;
                if (sessionStorage.userID) {
                    if (data[i].bought==false) {
                        itemCard += `<button class="btn btn-success btn-sm mr-1 buyBtn" data-toggle="modal" data-target="#buyModal">BUY</button>`;
                    }
                }
                itemCard += `</div>
                </div>
                </div>
                </div>`;
                $('#cardContainer').find('.row').append(itemCard);
            }
            $('#cardContainer').removeClass('d-none');
        },
        error: function(err){
            console.log(err);
            console.log('How embarassing, a database error! This never usually happens to me.');
        }
    });
};

const clearForms = () => {
    $('input').val('');
    $('textarea').val('');
};

const showLoginBtn = () => {
    $('#loginBtn').removeClass('d-none');
};
const showLogoutBtn = () => {
    $('#logoutBtn').removeClass('d-none');
};
const showRegisterBtn = () => {
    $('#registerBtn').removeClass('d-none');
};
const showLoginForm = () => {
    $('#userForm').removeClass('d-none');
    $('#loginFormBox').removeClass('d-none');
};
const showRegisterForm = () => {
    $('#userForm').removeClass('d-none');
    $('#registerFormBox').removeClass('d-none');
};
const showAddItemForm = () => {
    $('#addItemForm').show();
};
const showEditItemForm = () => {
    $('#editModal').modal('show');
};

const hideLoginBtn = () => {
    $('#loginBtn').addClass('d-none');
};
const hideLogoutBtn = () => {
    $('#logoutBtn').addClass('d-none');
};
const hideRegisterBtn = () => {
    $('#registerBtn').addClass('d-none');
};
const hideLoginForm = () => {
    $('#userForm').addClass('d-none');
    $('#loginFormBox').addClass('d-none');
};
const hideRegisterForm = () => {
    $('#userForm').addClass('d-none');
    $('#registerFormBox').addClass('d-none');
};
const hideAddItemForm = () => {
    $('#addItemForm').hide();
};
const hideEditItemForm = () => {
    $('#editModal').addClass('d-none');
};

$('#loginBtn').click(() => {
    $('.main').addClass('d-none');
    $('#lUsername').val(null);
    $('#lPassword').val(null);
    showLoginForm();
    $('#registerFormBox').addClass('d-none');
});

$('#logoutBtn').click(() => {
    hideLogoutBtn();
    hideAddItemForm();
    showRegisterBtn();
    showLoginBtn();
    $('#cardContainer').addClass('d-none');
    showItems();
    sessionStorage.clear();
});

$('#registerBtn').click(() => {
    $('.main').addClass('d-none');
    $('#rUsername').val(null);
    $('#rEmail').val(null);
    $('#rPassword').val(null);
    $('#rConfirmPassword').val(null);
    hideLoginForm();
    showRegisterForm();
});

$('#loginForm').submit(() => {
    event.preventDefault();
    const username = $('#lUsername').val();
    const password = $('#lPassword').val();
    if ((username.length === 0)||(password.length === 0)) {
        alert('Please enter your username and password!');
    } else {
        $.ajax({
            url: `${url}/getUser`,
            type: 'POST',
            data: {
                username: username,
                password: password
            },
            success: function(result){
                if (result === 'user does not exist'){
                    $('#errLogin').append('<p class="text-danger">Sorry, user does not exist. </p>');
                } else if (result === 'invalid password'){
                    alert(`Oh dear, it looks like you've entered the wrong password.`);
                } else if (sessionStorage.username) {
                    console.log(`401 error: you don't have permission to be here. Sorry. We don't make the rules.`);
                } else {
                    sessionStorage.setItem('userID', result._id);
                    sessionStorage.setItem('userName', result.username);
                    sessionStorage.setItem('userEmail', result.email);
                    hideRegisterBtn();
                    hideLoginBtn();
                    showLogoutBtn();
                    $('#userForm').addClass('d-none');
                    $('.main').removeClass('d-none');
                    $('#addListBtn').removeClass('d-none');
                    showItems();
                    showAddItemForm();
                }
            },
            error: function(err){
                console.log(err);
                console.log('How embarassing, a database error! This never usually happens to me.');
            }
        });
    }
});

$('#registerForm').submit(() => {
    event.preventDefault();

    const username = $('#rUsername').val();
    const email = $('#rEmail').val();
    const password = $('#rPassword').val();
    const confirmPassword = $('#rConfirmPassword').val();

    if(username.length === 0){
        alert('Please enter a username!');
    } else if(email.length === 0){
        alert('Please enter an email address!');
    } else if(password.length === 0){
        alert('Please enter a password!');
    } else if(confirmPassword.length === 0){
        alert('Please confirm your password!');
    } else if(password !== confirmPassword){
        alert('One of those passwords is not like the other!');
    } else {
        $.ajax({
            url: `${url}/users`,
            type: 'POST',
            data: {
                username: username,
                email: email,
                password: password
            },
            success: function(result){
                if (result === 'Invalid user') {
                    $('#errRego').append('<p class="text-danger">Sorry, this already exists </p>');
                } else {
                    sessionStorage.setItem('userID', result._id);
                    sessionStorage.setItem('userName', result.username);
                    sessionStorage.setItem('userEmail', result.email);
                    $('.main').removeClass('d-none');
                    hideLoginBtn();
                    hideRegisterBtn();
                    hideRegisterForm();
                    showItems();
                    showLogoutBtn();
                    showAddItemForm();
                }
            },
            error: function(err){
                console.log(err);
                console.log('How embarassing, a database error! This never usually happens to me.');
            }
        });
    }

    hideRegisterForm();
    hideRegisterBtn();
    hideLoginBtn();

    showItems();
    showLogoutBtn();
    showAddItemForm();
});

// ADD A NEW ITEM (SUBMIT)
$('#addItemForm').on('submit', () => {
    event.preventDefault();

    let formData = new FormData();

    let itemName = $('#itemName');
    let itemDescription = $('#itemDescription');
    let itemPrice = $('#itemPrice');
    let itemType = $('input[name=itemType]:checked').val();
    let itemCondition = $('input[name=itemCondition]:checked').val();
    let itemImg = $('#itemImage');

    const upload = () => {
        formData.append('itemName', itemName.val());
        formData.append('itemDescription', itemDescription.val());
        formData.append('itemPrice', itemPrice.val());
        formData.append('itemType', $('input[name=itemType]:checked').val());
        formData.append('itemCondition', $('input[name=itemCondition]:checked').val());
        formData.append('itemImg', itemImg[0].files[0]);
        formData.append('userID', sessionStorage.userID);

        $.ajax({
            url: `${url}/addItem`,
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success:function(result){
                clearForms();
                $('#itemImageLabel').html('Upload image');
                showItems();
            },
            error: function(err){
                console.log(err);
                console.log('How embarrassing, a database error! This never usually happens to me.');
            }
        });
    };

    if ((itemName.val().length != 0) && (itemDescription.val().length != 0) && (itemPrice.val().length != 0) && (itemImg[0].files[0] != undefined)){

        if (itemImg[0].files[0].type === 'image/jpg'){
            upload();
        } else if (itemImg[0].files[0].type === 'image/jpg'){
            upload();
        } else if (itemImg[0].files[0].type === 'image/png'){
            upload();
        } else if (itemImg[0].files[0].type === 'image/gif'){
            upload();
        } else {
            alert(`Sorry, but the server can't handle this kind of file. Try JPG, JPEG, PNG or GIF.`);
        }

    }   else {
        alert('Please add all of the item details!');
    }
});

$('#itemImage').change(() => {
    const fileName = $('#itemImage')[0].files[0].name;
    $('#itemImageLabel').html(fileName);
});

// CLICK EDIT BUTTON FOR SINGLE ITEM
$('#cardContainer').on('click', '.editBtn', function() {
    event.preventDefault();

    if(!sessionStorage.userID){
        alert(`401 error: you don't have permission to be here. Sorry. We don't make the rules.`);
        return;
    }
    const id = $(this).parent().parent().parent().data('id');
    console.log(id);

    $('#editModal').modal('show');

    $.ajax({
        url:`${url}/getItem/${id}`,
        type: 'GET',
        success: function(item){
            console.log(item);
            $('#itemNameEdit').val(item.item_name);
            $('#itemDescriptionEdit').val(item.item_description);
            $('#itemPriceEdit').val(item.price);
            $('#itemIDEdit').val(item._id);
            $("input[name=itemTypeEdit][value=" + item.clothing_type + "]").attr('checked', 'checked');
            $("input[name=itemConditionEdit][value=" + item.condition + "]").attr('checked', 'checked');
        },
        error: function(err){
            console.log(err);
            console.log('How embarrassing, a database error! This never usually happens to me.');
        }
    });
});

// SUBMIT NEW DETAILS FOR AN ITEM
$('#editItemForm').submit(() => {
    event.preventDefault();

    let id = $('#itemIDEdit').val();
    let itemName = $('#itemNameEdit').val();
    let itemDescription = $('#itemDescriptionEdit').val();
    let itemPrice = $('#itemPriceEdit').val();
    let itemType = $('input[name=itemTypeEdit]:checked').val();
    let itemCondition = $('input[name=itemConditionEdit]:checked').val();

    if ((itemName.length != 0) && (itemDescription.length != 0) && (itemPrice.length != 0) ) {
        $.ajax({
            url:`${url}/editItem/${id}`,
            type: 'PATCH',
            data: {
                itemName: itemName,
                itemDescription: itemDescription,
                itemPrice: itemPrice,
                itemCondition: itemCondition,
                itemType: itemType,
                userId: sessionStorage.userID
            },
            success: function(item){
                console.log(item);
                $('#editModal').modal('hide');
                showItems();
            },
            error: function(err){
                console.log(err);
                console.log('How embarrassing, a database error! This never usually happens to me.');
            }
        });
    } else {
        alert(`Please make sure you've put something in all of the fields!`);
    }
});

// DELETE AN ITEM
$('#cardContainer').on('click', '.removeBtn', function(){
    event.preventDefault();
    if(!sessionStorage.userID){
        alert('401, permission denied');
        return;
    }
    const id = $(this).parent().parent().parent().data('id');
    const card = $(this).parent().parent().parent();
    $.ajax({
      url: `${url}/deleteItem/${id}`,
      type: 'DELETE',
      data: {
          userID: sessionStorage.userID
      },
      success:function(response){
          if(response == '401'){
              alert(`401 error: you don't have permission to be here. Sorry. We don't make the rules.`);
          } else {
             card.remove();
             showItems();
          }
      },
      error:function(err) {
        console.log(err);
        console.log('something went wrong deleting the product');
      }
  });
});
// $('#cardContainer').on('click', '.removeBtn', function(){
//     event.preventDefault();
//     if(!sessionStorage.userID){
//         alert(`401 error: you don't have permission to be here. Sorry. We don't make the rules.`);
//         return;
//     }
//     const id = $(this).parent().parent().parent().data('id');
//     const card = $(this).parent().parent().parent();
//
//     $.ajax({
//         url: `${url}/deleteItem/${id}`,
//         type: 'DELETE',
//         data: {
//             userID: sessionStorage.userID
//         },
//         success:function(item){
//             if(item == '401'){
//                 alert(`401 error: you don't have permission to be here. Sorry. We don't make the rules.`);
//             } else {
//                 card.remove();
//             }
//         },
//         error:function(err) {
//             console.log(err);
//             console.log('How embarassing, a database error! This never usually happens to me.');
//         }
//     });
// });
//
//  CLICK ON "MORE INFO" BUTTON TO SHOW A SINGLE ITEM CARD (MODAL)
$('#cardContainer').on('click', '.moreInfoBtn', function() {
    // console.log('you clicked on the more info button');
    const id = $(this).parent().parent().parent().data('id');
    $.ajax({
        url:`${url}/getItem/${id}`,
        type: 'GET',
        success: function(item){
            console.log(item);
            // NEED TO ADD DATA TO POPUP MODAL CALLED singleItemModal
            // NEED TO INCLUDE SOME HTML TO LAYOUT THIS DATA NICELY
            $('#singleItemModalTitle').empty();
            $('#singleItemModalTitle').append(item.item_name);
            $('#singleItemModalBody').empty();
            $('#singleItemModalBody').append(`<img class="img-fluid" src="${url}/${item.image_URL}">`);
            $('#singleItemModalBody').append(`<p>Clothing type: ` + item.clothing_type + `</p>`);
            $('#singleItemModalBody').append(`<p>Condition: ` + item.condition + `</p>`);
            $('#singleItemModalBody').append(`<p>Description: ` + item.item_description + `</p>`);
            $('#singleItemModalBody').append(`<p>Price: $` + item.price + `</p>`);
        },
        error: function(err){
            console.log(err);
            console.log('something went wrong with getting the single item');
        }
    });
});

$('#cardContainer').on('click','.buyBtn',function(){
  console.log('clicked');
  const id = $(this).parent().parent().parent().data('id');
  console.log(id);
    $.ajax({
      url: `${url}/buyItem/${id}`,
      type:'PATCH',
      success:function(){
        console.log('changing bought to true in backend');
        showItems();
      },
      error: function(err){
        console.log(err);
        console.log('How embarassing, a database error! This never usually happens to me.');
      }
    });
});
