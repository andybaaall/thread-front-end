let serverURL;
let serverPort;
let url;
let editing = false;
$(document).ready(() => {
    // get the config.json
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

    if (sessionStorage.userName) {
        // user is logged in
        showLogoutBtn();
    } else {
        // user is not logged in
        showRegisterBtn();
        showLoginBtn();
    }
});

showItems = () => {
    $.ajax({
        url: `${url}/allItems`,
        type: 'GET',
        dataType: 'json',
        success: function(data){
            console.log(data);
            $('#cardContainer').find('.row').empty();
            for (var i = 0; i < data.length; i++) {
                let layout = `
                    <div class="col-12 col-md-3">
                        <div class="card" data-id="${data[i]._id}">
                            <div class="card-body">
                                <div id="worktitle" class="card-title">
                                    <h5 class="card-title text-center mt-3" >${data[i].item_name}</h5>
                                    <p class="text-center">${data[i].price}</p>
                                </div>`;
                                if (sessionStorage.userName) {
                                    layout += `<div class="btnSet d-flex justify-content-center">
                                    <button class="btn btn-primary btn-sm mr-1 editBtn">EDIT</button>
                                    <button class="btn btn-secondary btn-sm removeBtn">REMOVE</button>
                                    </div>`;
                                }
                            layout += `</div>
                        </div>
                    </div>
                `;
                $('#cardContainer').find('.row').append(layout);
            }
            $('#cardContainer').removeClass('d-none');
        },
        error: function(err){
            console.log(err);
            console.log('Something went wrong');
        }
    });
};


// fetches stuff from the DB and puts it into cards
// const showItems = () => {
//     // clear items
//
//     if (sessionStorage.username) {
//         // user is logged in
//         // get all of the items from the database
//         // put each one into a card or something
//     } else {
//         // user is not logged in
//         // get all of the items from the database
//         // put each one into a card or something
//         // append an editItemBtn (and, eventually, deleteItemBtn) to each one with the right userID
//     }
// };

// sets session storage when user is logged in (or has just registered)
const setSessionStorage = (userID) => {

};

// clears session storage when user logs out
const clearSessionStorage = () => {

};

// clears login and register forms
const clearForms = () => {

};

// these all show DOM elements
const showLoginBtn = () => {
  $('#logInOutBox').append(`<button id="loginBtn" class="btn btn-light" type="button" name="button" onclick="login()">Login</button>`);
  login = () => {
    console.log('clicked login button');
        $('.main').addClass('d-none');
        $('#userForm').removeClass('d-none');
        $('#loginFormBox').removeClass('d-none');
        $('#lUsername').val(null);
        $('#lPassword').val(null);
  };
};
const showLogoutBtn = () => {
  $('#logInOutBox').append(`<button id="logoutBtn" class="btn btn-light" type="button" name="button" onclick="logout()">Logout</button>`);
  logout = () => {
    console.log('clicked logout button');
      $('#logInOutBox').empty();
      showRegisterBtn();
      showLoginBtn();
      sessionStorage.clear();
      $('#cardContainer').addClass('d-none');
  };
};
const showRegisterBtn = () => {
  $('#logInOutBox').append(`<button id="registerBtn" class="mr-1 btn btn-light" type="button" name="button" onclick="register()">Register</button>`);
  register = () => {
    console.log('clicked register button');
        $('.main').addClass('d-none');
        $('#userForm').removeClass('d-none');
        $('#loginFormBox').addClass('d-none');
        $('#registerFormBox').removeClass('d-none');
        $('#rUsername').val(null);
        $('#rEmail').val(null);
        $('#rPassword').val(null);
        $('#rConfirmPassword').val(null);
  };
};
// const showLoginForm = () => {
//
// };
// const showRegisterForm = () => {
//
// };
const showAddItemForm = () => {
  $('#uploadModal').show();
};
const showEditItemForm = () => {

};

// these all hide DOM elements
const hideLoginBtn = () => {

};
const hideLogoutBtn = () => {

};
const hideRegisterBtn = () => {

};
const hideLoginForm = () => {

};
const hideRegisterForm = () => {

};
const hideAddItemForm = () => {

};
const hideEditItemForm = () => {

};

$('#loginBtn').click(() => {
    clearForms();
    showLoginForm();
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
             } else if (result === 'invalid password'){
                 console.log('invalid password');
             } else {
                 sessionStorage.setItem('userID', result._id);
                 sessionStorage.setItem('userName', result.username);
                 sessionStorage.setItem('userEmail', result.email);

                 $('#logInOutBox').empty();
                 showLogoutBtn();

                 $('#userForm').addClass('d-none');
                 $('.main').removeClass('d-none');
                 $('#addListBtn').removeClass('d-none');

                 const addItemBox = `<div class="addItemBox mx-5 my-2 text-left"><form id="addItemForm" enctype="multipart/form-data"><div class="form-group"><label for="itemName">Item Name</label><input type="text" class="form-control" id="itemName"></div><div class="form-group"><label for="itemDescription">Description</label><input type="text" class="form-control" id="itemDescription"></div><div class="form-group"><label for="itemPrice">Price</label><input type="number" class="form-control" id="itemPrice"></div><div class="input-group"><div class="input-group-prepend"><span class="input-group-text" id="itemImagePrepend">Item image</span></div><div class="custom-file"><input type="file" class="custom-file-input" id="itemImage"><label class="custom-file-label" for="itemImage">Choose file</label></div></div><fieldset class="form-group"><div class="row"><legend class="col-form-label col-sm-2 pt-0">Clothing Type</legend><div class="col-sm-10"><div class="form-check"><input class="form-check-input" type="radio" id="topsRadio" value="Tops" name="itemType" ><label class="form-check-label" for="topsRadio">Tops</label></div><div class="form-check"><input class="form-check-input" type="radio" id="bottomsRadio" value="Bottoms" name="itemType"><label class="form-check-label" for="bottomsRadio">Bottoms</label></div><div class="form-check"><input class="form-check-input" type="radio" id="outwewearRadio" value="Outerwear" name="itemType"><label class="form-check-label" for="outwewearRadio">Outerwear</label></div><div class="form-check"><input class="form-check-input" type="radio" id="otherRadio" value="Other" name="itemType"><label class="form-check-label" for="otherRadio">Other</label></div></div></div></fieldset><fieldset class="form-group"><div class="row"><legend class="col-form-label col-sm-2 pt-0">Condition</legend><div class="col-sm-10"><div class="form-check"><input class="form-check-input" type="radio" id="newRadio" value="New" name="itemCondition"><label class="form-check-label" for="newRadio">New</label></div><div class="form-check"><input class="form-check-input" type="radio" id="usedRadio" value="Used" name="itemCondition"><label class="form-check-label" for="usedRadio">Used</label></div></div></div></fieldset><button id= "addItemSubmitBtn" type="submit" class="btn btn-primary">add an item</button></form></div>`;

                 $('#pageContainer').append(addItemBox);
                 showItems(); // we need to rework this so that it appends and empties, rather than switches from d-flex to d-none
                 // addItem();
             }
         },
         error: function(err){
             console.log(err);
             console.log('Something went wrong');
         }
     });
 }


    if (sessionStorage.username) {
        // user is logged in. This bad joke needs a lot of explanation.
        console.log('PERMISSION DENIED');
    } else {
        // user is not logged in
        // validate the username and password
        // if (/*validation okay*/) {
        //     hideLoginBtn();
        //     hideRegisterBtn();
        //     hideLoginForm();
        //
        //     showLogoutBtn();
        //     showAddItemForm();
        //
        //     showItems();
        //     showAddItemForm();
        // }
    }
});

$('#registerBtn').click(() => {
     clearForms();
     showRegisterForm();
});

$('#registerForm').submit(() => {
    // some validation
    // ajax request to create a new DB item with the registration form data

    setSessionStorage(/* whatever username comes back from the Ajax req */);

    hideRegisterForm();
    hideRegisterBtn();
    hideLoginBtn();

    showItems();
    showLogoutBtn();
    showAddItemForm();
});

$('#addItemForm').submit(() => {
    // Ajax request to create database items using the form data
    showItems();
});

// $('#editItemBtn').click(() => {
//     if (/* the item to be edited has the same userID as the userID stored in sessionStorage*/) {
//         showEditItemForm();
//     }
// });

// Edit and delete btns are made when sessionStorage.userID matched
$('#cardContainer').on('click', '.editBtn', function() {
  event.preventDefault();
  if(!sessionStorage.userID){
      alert('401, permission denied');
      return;
  }
  const id = $(this).parent().parent().parent().data('id');
  console.log(id);
  $.ajax({
    url:`${url}/addItem/${id}`,
    type: 'PATCH',
    data: {
        userId: sessionStorage.userID
    },
    dataType:'json',
    success: function(item){
      if (item == '401') {
          alert('401 UNAUTHORIZED');
      } else {
        showEditItemForm();
        $("#itemName").val();
        $("#itemPrice").val();
        $("#itemID").val();
        $("#addBtn").text('Edit Product').addClass('btn-warning');
        editing = true;
      }
    },
    error: function(err){
      console.log(err);
      console.log('something went wrong with getting the single product');
    }
    });
});


$('#cardContainer').on('click', '.removeBtn', function(){
    event.preventDefault();
    if(!sessionStorage.userID){
        alert('401, permission denied');
        return;
    }
    const id = $(this).parent().parent().parent().data('id');
    const card = $(this).parent().parent().parent();
    // console.log(card);
    $.ajax({
      url: `${url}/addItem/${id}`,
      type: 'DELETE',
      data: {
          userId: sessionStorage.userID
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
});



$('#editItemForm').submit(() => {
    // Ajax request to patch database items using the form data
    showItems();
    hideEditItemForm();
});
