// test

let serverURL;
let serverPort;
let url;
let editing = false;
let loginBtn = `<button id="loginBtn" class="btn btn-light" type="button" name="button" onclick="login()">Login</button>`;
let logoutBtn = `<button id="logoutBtn" class="btn btn-light" type="button" name="button" onclick="logout()">Logout</button>`;

$(document).ready(function(){
console.log(sessionStorage);
    // get server details, then show all the items for sale in the database
    $.ajax({
        url: 'config.json',
        type: 'GET',
        dataType: 'json',
        success:function(keys){
            serverURL = keys.SERVER_URL;
            serverPort = keys.SERVER_PORT;
            url = `${keys.SERVER_URL}:${keys.SERVER_PORT}`;
            itemCard(); // we need to rework this so that it appends and empties, rather than switches from d-flex to d-none
        },
        error: function(){
            console.log('cannot find config.json file, cannot run application');
        }
    });

    if(sessionStorage.userName){
        // you're logged in, nice :)
        $('#logInOutBox').append(logoutBtn);
        $('#logoutBtn').click(function(){
            console.log('got a click');
        });

    } else {
        // you're not logged in
        $('#logInOutBox').append(loginBtn);
        $('#loginBtn').click(function(){
            // console.log('got a click');
            $('.main').addClass('d-none');
            $('#userForm').removeClass('d-none');
        });
    }
    logout = () => {
        console.log('clicked logout button');
        $('#logInOutBox').empty();
        $('#logInOutBox').append(loginBtn);
        sessionStorage.clear();
        $('#cardContainer').addClass('d-none');
    };

    login = () => {
        console.log('clicked login button');
        $('.main').addClass('d-none');
        $('#userForm').removeClass('d-none');
        $('#lUsername').val(null);
        $('#lPassword').val(null);
    };
    itemCard = () => {
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
                                      <img class="img-fluid" src="${data[i].image_URL}">
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
});

$('#registerForm').submit(function(){
    event.preventDefault();
    console.log('got a click');
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
                    $('#loginBtn').text('Logout');
                    // $('.main').removeClass('d-none');
                }
            },
            error: function(err){
                console.log(err);
                console.log('Something went wrong registering a new user');
            }
        });
    }
});

$('#loginForm').submit(function(){
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
                    $('#logInOutBox').append(logoutBtn);

                    $('#userForm').addClass('d-none');
                    $('.main').removeClass('d-none');
                    $('#addListBtn').removeClass('d-none');

                    const addItemBox = `<div class="addItemBox mx-5 my-2 text-left"><form id="addItemForm" enctype="multipart/form-data"><div class="form-group"><label for="itemName">Item Name</label><input type="text" class="form-control" id="itemName"></div><div class="form-group"><label for="itemDescription">Description</label><input type="text" class="form-control" id="itemDescription"></div><div class="form-group"><label for="itemPrice">Price</label><input type="number" class="form-control" id="itemPrice"></div><div class="input-group"><div class="input-group-prepend"><span class="input-group-text" id="itemImagePrepend">Item image</span></div><div class="custom-file"><input type="file" class="custom-file-input" id="itemImage"><label class="custom-file-label" for="itemImage">Choose file</label></div></div><fieldset class="form-group"><div class="row"><legend class="col-form-label col-sm-2 pt-0">Clothing Type</legend><div class="col-sm-10"><div class="form-check"><input class="form-check-input" type="radio" id="topsRadio" value="Tops" name="itemType" ><label class="form-check-label" for="topsRadio">Tops</label></div><div class="form-check"><input class="form-check-input" type="radio" id="bottomsRadio" value="Bottoms" name="itemType"><label class="form-check-label" for="bottomsRadio">Bottoms</label></div><div class="form-check"><input class="form-check-input" type="radio" id="outwewearRadio" value="Outerwear" name="itemType"><label class="form-check-label" for="outwewearRadio">Outerwear</label></div><div class="form-check"><input class="form-check-input" type="radio" id="otherRadio" value="Other" name="itemType"><label class="form-check-label" for="otherRadio">Other</label></div></div></div></fieldset><fieldset class="form-group"><div class="row"><legend class="col-form-label col-sm-2 pt-0">Condition</legend><div class="col-sm-10"><div class="form-check"><input class="form-check-input" type="radio" id="newRadio" value="New" name="itemCondition"><label class="form-check-label" for="newRadio">New</label></div><div class="form-check"><input class="form-check-input" type="radio" id="usedRadio" value="Used" name="itemCondition"><label class="form-check-label" for="usedRadio">Used</label></div></div></div></fieldset><button id= "addItemSubmitBtn" type="submit" class="btn btn-primary">add an item</button></form></div>`;

                    $('#pageContainer').append(addItemBox);
                    itemCard(); // we need to rework this so that it appends and empties, rather than switches from d-flex to d-none
                    addItem();
                }
            },
            error: function(err){
                console.log(err);
                console.log('Something went wrong');
            }
        });
    }
});

addItem = () => {
    $('#addItemForm').submit(() => {
        console.log('lets add an item');
        event.preventDefault();
        // need to put some validation in here
        // and need to add the file name to the input field when it changes.
        // that's if file.length, do some stuff.

        let fd = new FormData();

        let itemName = $('#itemName').val();
        let itemDescription = $('#itemDescription').val();
        let itemPrice = $('#itemPrice').val();
        let itemImage = $('#itemImage')[0].files[0];
        let itemType = $('input[name="itemType"]:checked').val();
        let itemCondition = $('input[name="itemCondition"]:checked').val();
        let itemBought = false;

        fd.append('itemName', itemName);
        fd.append('itemDescription', itemDescription);
        fd.append('itemPrice', itemPrice);
        fd.append('itemImage', itemImage);
        fd.append('itemType', itemType);
        fd.append('itemCondition', itemCondition);
        fd.append('itemBought', itemBought);
        fd.append('userID', sessionStorage.userID);

        $.ajax({
            url: `${url}/addItem`,
            type: 'POST',
            data: {
                fd,
             userId: sessionStorage['userID']
            },
            // dataType: 'json',
            contentType: false,
            processData: false,
            success: (result) => {
                console.log(result);
                // clear form values
            },
            error: (err) => {
                console.log(err);
            }
        });
    });
};

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
        $("#itemName").val();
        $("#itemPrice").val();
        $("#itemID").val();
        // $("#addBtn").text('Edit Product').addClass('btn-warning');
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
