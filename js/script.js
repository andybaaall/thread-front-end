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

// fetches stuff from the DB and puts it into cards
const showItems = () => {
    // clear items

    if (sessionStorage.username) {
        // user is logged in
        // get all of the items from the database
        // put each one into a card or something
    } else {
        // user is not logged in
        // get all of the items from the database
        // put each one into a card or something
        // append an editItemBtn (and, eventually, deleteItemBtn) to each one with the right userID
    }
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
