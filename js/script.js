let serverURL;
let serverPort;
let url;
let editing = false;

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
  } else {
    showRegisterBtn();
    showLoginBtn();
    hideLogoutBtn();
  }
});

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
        let itemCard = `
        <div class="col-12 col-md-3">
        <div class="card" data-id="${data[i]._id}">
        <div class="card-body">
        <div id="worktitle" class="card-title">
        <h5 class="card-title text-center mt-3" >${data[i].item_name}</h5>
        <p class="text-center">${data[i].price}</p>
        </div>`;
        if(sessionStorage.user_id === data[i].user_id) {
          itemCard += `<div class="btnSet d-flex justify-content-center">
          <button class="btn btn-primary btn-sm mr-1 editBtn">EDIT</button>
          <button class="btn btn-secondary btn-sm removeBtn">REMOVE</button>
          </div>`;
        }
        itemCard += `</div>
        </div>
        </div>
        `;
        $('#cardContainer').find('.row').append(itemCard);
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
});

$('#editItemForm').click(() => {
  // Ajax request to patch database items using the form data
  $.ajax({
    // url here
    type: 'post',
    data: {
      userId: sessionStorage.userID
    },
    dataType: 'json',
    success:function(product){
      if(product == '401'){
        alert('401 UNAUTHORIZED');
      } else {
        console.log(product);
        // theres no description input on add item form in HTML.
        // $('#itemName').val(res['item_name']);
        // $('#price').val(res['price']);
        // $('#clothingType').val(res['clothing_type']);
        // $('#productID').val(res['_id']);
        // $('#condition').val(res['condition']);
        // $('#addProductButton').text('Edit Product').addClass('btn-warning');
        // $('#heading').text('Edit Product');
        editing = true;
      }
    },
    error:function(err){
      console.log(err);
      console.log('We pulled the wrong thread, and something went wrong :~(');
    }
  });

showItems();
hideEditItemForm();
});
