let serverURL;
let serverPort;
let url;
let editing = false;
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
        error: function(){
            console.log('cannot find config.json file, cannot run application');
        }
    });
    if (sessionStorage.userName) {
        showLogoutBtn();
    } else {
        showRegisterBtn();
        showLoginBtn();
    }
});

showItems = () => {

};

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
  $('#uploadModal').show();
};
const showEditItemForm = () => {

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

};
const hideEditItemForm = () => {

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
      showRegisterBtn();
      showLoginBtn();
      sessionStorage.clear();
      $('#cardContainer').addClass('d-none');
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
    setSessionStorage(/* whatever username comes back from the Ajax req */);
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
