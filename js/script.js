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
        },
        error: function(){
            console.log('cannot find config.json file, cannot run application');
        }
    });

    showItems();

    if (sessionStorage.username) {
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

};
const showLogoutBtn = () => {

};
const showRegisterBtn = () => {

};
const showLoginForm = () => {

};
const showRegisterForm = () => {

};
const showAddItemForm = () => {

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
