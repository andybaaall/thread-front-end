let serverURL;
let serverPort;
let url;
let editing = false;
let id;


$(document).ready(() => {
    console.log(sessionStorage);
    // GET THE CONFIG.JSON
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
        error: function(){
            console.log('cannot find config.json file, cannot run application');
        }
    });
    if(sessionStorage.userName){
        // you're logged in, nice :)
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

// <img class="img-fluid" src="${url}/${data[i].image_URL}">
  // <div class="cardImg" style="background-image: url(${url}/${data[i].image_URL}); height: 200px; width: 400px;" >
// GET ALL THE ITEMS FROM MONGO DB AND ADD THEM TO CARDS IN OUR CARD CONTAINER
showItems = () => {
    $.ajax({
        url: `${url}/allItems`,
        type: 'GET',
        dataType: 'json',
        success: function(data){
            console.log(data);
            $('#cardContainer').find('.row').empty();
            for (var i = 0; i < data.length; i++) {
                // console.log(data[i].image_URL);
                let itemCard = `
                    <div class="col-12 col-md-4">
                        <div class="card" data-id="${data[i]._id}">
                            <div class="card-body">
                                <div id="worktitle" class="card-title">
                               <div class="cardImg" style="background-image: url(${url}/${data[i].image_URL}); height: 200px; width: 100%;" >
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
                    </div>
                `;
                $('#cardContainer').find('.row').append(itemCard);
                console.log(data[i].bought);
            }
            $('#cardContainer').removeClass('d-none');
        },
        error: function(err){
            console.log(err);
            console.log('Something went wrong');
        }
    });
};

// clears session storage when user logs out
const clearSessionStorage = () => {

};

// clears login and register forms
const clearForms = () => {
    $('input').val('');
};

// these all show DOM elements
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

// these all hide DOM elements
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
    console.log('clicked login button');
    $('.main').addClass('d-none');
    $('#lUsername').val(null);
    $('#lPassword').val(null);
    showLoginForm();
    $('#registerFormBox').addClass('d-none');
});

$('#logoutBtn').click(() => {
    console.log('clicked logout button');
    hideLogoutBtn();
    hideAddItemForm();
    showRegisterBtn();
    showLoginBtn();
    $('#cardContainer').addClass('d-none');
    showItems();
    sessionStorage.clear();
});

$('#registerBtn').click(() => {
    console.log('clicked register button');
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
        console.log('Please enter your username and password');
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
                    console.log('user does not exist');
                    $('#errLogin').append('<p class="text-danger">Sorry, user does not exist. </p>');
                } else if (result === 'invalid password'){
                    console.log('invalid password');
                } else if (sessionStorage.username) {
                    // user is logged in. This bad joke needs a lot of explanation.
                    console.log('PERMISSION DENIED');
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
                console.log('Something went wrong');
            }
        });
    }
});

$('#registerForm').submit(() => {
    event.preventDefault();
    console.log('register form got a click');
    const username = $('#rUsername').val();
    const email = $('#rEmail').val();
    const password = $('#rPassword').val();
    const confirmPassword = $('#rConfirmPassword').val();

    if(username.length === 0){
        console.log('please enter a username');
    } else if(email.length === 0){
        console.log('please enter an email');
    } else if(password.length === 0){
        console.log('please enter a password');
    } else if(confirmPassword.length === 0){
        console.log('please confirm your password');
    } else if(password !== confirmPassword){
        console.log('your passwords do not match');
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
                console.log(result);
                if (result === 'Invalid user') {
                    $('#errRego').append('<p class="text-danger">Sorry, this already exists </p>');
                } else {
                    console.log('now you are member');
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
                console.log('Something went wrong registering a new user');
            }
        });
    }
    // setSessionStorage(/* whatever username comes back from the Ajax req */);

    hideRegisterForm();
    hideRegisterBtn();
    hideLoginBtn();

    showItems();
    showLogoutBtn();
    showAddItemForm();
});

$('#addItemForm').on('submit', () => {
    event.preventDefault();

    let formData = new FormData();

    let itemName = $('#itemName');
    let itemDescription = $('#itemDescription');
    let itemPrice = $('#itemPrice');
    let itemType = $('input[name=itemType]:checked').val();
    let itemCondition = $('input[name=itemCondition]:checked').val();
    let itemImg = $('#itemImage');

    if (itemName.length && itemDescription.length && itemPrice.length && itemType.length && itemCondition.length && itemImg.length) {
        // all of the form fields have a value
        formData.append('itemName', itemName.val());
        formData.append('itemDescription', itemDescription.val());
        formData.append('itemPrice', itemPrice.val());
        formData.append('itemType', itemType);
        formData.append('itemCondition', itemCondition);
        formData.append('itemImg', itemImg[0].files[0]);
        formData.append('userID', sessionStorage.userID);

        $.ajax({
            url: `${url}/addItem`,
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success:function(result){
                console.log(result);
            },
            error: function(){
                console.log('error sending item to DB');
            }
        });

        clearForms();

    }   else {
        alert('Please add all of the item details!');
    }
});

// Edit and delete btns are made when sessionStorage.userID matched
$('#cardContainer').on('click', '.editBtn', function() {

    event.preventDefault();

    if(!sessionStorage.userID){
        alert('401, permission denied');
        return;
    }
    const id = $(this).parent().parent().parent().data('id');
    console.log(id);


    //THIS PATCH REQUEST APPEARED AFTER I MERGED WITH JOHN'S LATEST MERGE TO MASTER
    //THIS BREAKS CODE WHEN YOU CLICK EDIT BUTTON, IS THIS IN CORRECT PLACE?

    // $.ajax({
    //     url:`${url}/addItem/${id}`,
    //     type: 'PATCH',
    //     data: {
    //         userId: sessionStorage.userID
    //     },
    //     dataType:'json',
    //     success: function(item){
    //         if (item == '401') {
    //             alert('401 UNAUTHORIZED');
    //         } else {
    //             showEditItemForm();
    //             $('#itemName').val();
    //             $('#itemPrice').val();
    //             $('#itemID').val();
    //             $('#addBtn').text('Edit Product').addClass('btn-warning');
    //             editing = true;
    //         }
    //     }
    // });

    //MODAL NOW APPEARS TO EDIT DATA, BUT I NEED THIS TO APPEAR AFTER AJAX SUCCESS
    $('#editModal').modal('show');


    //GET REQUEST GETS ME ITEM DATA AND LOGS IT APPROPRIATE FIELDS
    //HAVEN'T WORKED RADIOS OUT AS OF 9.09
    $.ajax({
        url:`${url}/getItem/${id}`,
        type: 'GET',
        success: function(item){
            console.log(item);
            $('#itemNameEdit').empty();
            $('#itemNameEdit').val(item.item_name);
            $('#itemDescriptionEdit').empty();
            $('#itemDescriptionEdit').val(item.item_description);
            $('#itemPriceEdit').empty();
            $('#itemPriceEdit').val(item.price);
            $('#itemIDEdit').empty();
            $('#itemIDEdit').val(item._id);
            $("input[name=itemTypeEdit][value=" + item.clothing_type + "]").attr('checked', 'checked');
            $("input[name=itemConditionEdit][value=" + item.condition + "]").attr('checked', 'checked');



        },
        error: function(err){
            console.log(err);
            console.log('something went wrong with getting the single item');
        }

    });

});

$('#editItemFormBtn').click(() => {
    // Ajax request to patch database items using the form data
    //I COPY-PASTED THIS, I THINK THE PATCH REQUEST IS MEANT TO GO HERE? UNLESS I'M A TOTAL FUCKING IDIOT.
    event.preventDefault();

    let editing = true;
    let id = $('#itemIDEdit').val();
    let itemName = $('#itemNameEdit').val();
    let itemDescription = $('#itemDescriptionEdit').val();
    let itemPrice = $('#itemPriceEdit').val();
    let itemType = $('input[name=itemTypeEdit]:checked').val();
    let itemCondition = $('input[name=itemConditionEdit]:checked').val();



    // console.log(id.length);
    // console.log(itemName.length);
    // console.log(itemDescription.length);
    // console.log(itemPrice.length);
    // console.log(itemType);
    // console.log(itemCondition);

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
                console.log('update didnt work');
            }
        });
    } else {
        console.log('uh oh');
    }



        //trying to get item conditon to console.log


        // $.ajax({
        //     url:`${url}/editItem/${id}`,
        //     type: 'PATCH',
        //     data: {
        //         userId: sessionStorage.userID,
        //         itemName: itemNameEdit,
        //         itemDescription: itemDescriptionEdit,
        //         itemPrice: itemPriceEdit,
        //         _id: item.itemIDEdit
        //     },
        //     dataType:'json',
        //     success: function(item){
        //         if (item == '401') {
        //             alert('401 UNAUTHORIZED');
        //         } else {
        //             showEditItemForm();
        //             $('#itemNameEdit').val();
        //             $('#itemPriceEdit').val();
        //             $('#itemDescriptionEdit').val();
        //             $('#itemIDEdit').val();
        //
        //         }
        //     }
        // });


});

$('#cardContainer').on('click', '.removeBtn', function(){
    event.preventDefault();
    if(!sessionStorage.userID){
        alert('401, permission denied');
        return;
    }
    const id = $(this).parent().parent().parent().data('id');
    const card = $(this).parent().parent().parent();
    console.log(id);
    $.ajax({
        url: `${url}/addItem/${id}`,
        type: 'DELETE',
        data: {
            userID: sessionStorage.userID
        },
        success:function(item){
            if(item == '401'){
                alert('401 UNAUTHORIZED');
            } else {
                card.remove();
            }
        },
        error:function(err) {
            console.log(err);
            console.log('something went wrong deleting the product');
        }
    });
    // showItems();
    // hideEditItemForm();
});

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
        console.log('get request');
        showItems();
      },
      error: function(err){
        console.log(err);
      }
    });
});

$('#buyModal').click(function(){
    let buy = $(this).children().children().children().children();
    buy.addClass('buyConfirm');
    console.log('has been clicked');
    let boughtID;
});

$('#buyModal').on('click','.buyConfirm',function(){
  console.log('click');
  // console.log(id);
  // console.log($('.buyBtn').parent().parent().parent().data('id'));
  // let boughtID = $('.buyBtn').parent().parent().parent().data('id');
  //   $.ajax({
  //       url:`${url}/buyItem/${boughtID}`,
  //       type: 'PATCH',
  //       data: {
  //           _id:  boughtID,
  //           item_name: itemName,
  //           item_description: ,
  //           clothing_type: ,
  //           image_URL:  ,
  //           price:  ,
  //           condition: ,
  //           user_id: ,
  //           bought: true
  //       },
  //       dataType:'json',
  //       success: function(result){
  //         console.log(result);
  //           // showItems().find(p).text('sold');
  //           bought = true;
  //       },
  //       error: function(err){
  //         console.log(err);
  //         console.log('cannot buy it');
  //       }
  //   });
});
