let serverURL;
let serverPort;
let url;
let editing = false;

$(document).ready(() => {
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
                                if(sessionStorage['user_id'] === data[i].user_id) {
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
 $('#userForm').remove();
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
        console.log('PERMISSION DENIED – 말린 감은 기각되었다');
    } else {
        // user is not logged in
        // validate the username and password
        if (/*validation okay*/) {
            hideLoginBtn();
            hideRegisterBtn();
            hideLoginForm();

            showLogoutBtn();
            showAddItemForm();

            showItems();
            showAddItemForm();
        }
    }
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

$('#editItemBtn').click(() => {
    if (/* the item to be edited has the same userID as the userID stored in sessionStorage*/) {
        showEditItemForm();
    }
});

$('#editItemForm').submit(() => {
    // Ajax request to patch database items using the form data
    showItems();
    hideEditItemForm();
});
