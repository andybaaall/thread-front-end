let serverURL;
let serverPort;
let url;
let loginBtn = `<button id="loginBtn" class="btn btn-light" type="button" name="button">Login</button>`;
let logoutBtn = `<button id="logoutBtn" class="btn btn-light" type="button" name="button">Logout</button>`;
//
// $('#logoutBtn').click(function(){
//     if(!sessionStorage['userID']){
//         alert('401, permission denied');
//         return;
//     };
//     sessionStorage.clear();
//     $('#logInOutBox').append(loginBtn);
//
// });

$(document).ready(function(){
    console.log(sessionStorage);
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
            // $('#logInOutBox').hide(loginBtn);
            // $('#logInOutBox').append(logoutBtn);
        });
    }
});

$.ajax({
    url: 'config.json',
    type: 'GET',
    dataType: 'json',
    success:function(keys){
        serverURL = keys.SERVER_URL;
        serverPort = keys.SERVER_PORT;
        url = `${keys.SERVER_URL}:${keys.SERVER_PORT}`;
        // need to run a function to get all the items data, right?
        // getItemsData();
    },
    error: function(){
        console.log('cannot find config.json file, cannot run application');
    }
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
                    $('#loginBtn').text('Logout');
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
                    console.log(result);
                    // itemCard();
                    sessionStorage.setItem('userID', result._id);
                    sessionStorage.setItem('userName', result.username);
                    sessionStorage.setItem('userEmail', result.email);

                    $('#logInOutBox').append(logoutBtn);
                    ////////

                    // create Item
                    $('#pageContainer').append(`<div class="addItemBox mx-5 my-2 text-left">
                    <button type="button" class="btn btn-primary" id="addItemBtn">add item</button>
                    <form id="addItemForm">
                    <div class="form-group">
                    <label for="itemName">Item Name</label>
                    <input type="text" class="form-control" id="itemName">
                    </div>
                    <div class="form-group">
                    <label for="itemDescription">Description</label>
                    <input type="text" class="form-control" id="exampleInputPassword1">
                    </div>
                    <div class="form-group">
                    <label for="itemDescription">Price</label>
                    <input type="number" class="form-control" id="exampleInputPassword1">
                    </div>
                    <fieldset class="form-group">
                    <div class="row">
                    <legend class="col-form-label col-sm-2 pt-0">Clothing Type</legend>
                    <div class="col-sm-10">
                    <div class="form-check">
                    <input class="form-check-input" type="radio" id="topsRadio" value="Tops" checked>
                    <label class="form-check-label" for="topsRadio">
                    Tops
                    </label>
                    </div>
                    <div class="form-check">
                    <input class="form-check-input" type="radio" id="bottomsRadio" value="Bottoms">
                    <label class="form-check-label" for="bottomsRadio">
                    Bottoms
                    </label>
                    </div>
                    <div class="form-check">
                    <input class="form-check-input" type="radio" id="outwewearRadio" value="Outerwear">
                    <label class="form-check-label" for="outwewearRadio">
                    Outerwear
                    </label>
                    </div>
                    <div class="form-check">
                    <input class="form-check-input" type="radio" id="otherRadio" value="Other">
                    <label class="form-check-label" for="otherRadio">
                    Other
                    </label>
                    </div>
                    </div>
                    </div>
                    </fieldset>
                    <fieldset class="form-group">
                    <div class="row">
                    <legend class="col-form-label col-sm-2 pt-0">Condition</legend>
                    <div class="col-sm-10">
                    <div class="form-check">
                    <input class="form-check-input" type="radio" id="newRadio" value="New" checked>
                    <label class="form-check-label" for="newRadio">
                    New
                    </label>
                    </div>
                    <div class="form-check">
                    <input class="form-check-input" type="radio" id="usedRadio" value="Used">
                    <label class="form-check-label" for="usedRadio">
                    Used
                    </label>
                    </div>
                    </div>
                    </div>
                    </fieldset>
                    <button type="submit" class="btn btn-primary">Submit</button>
                    </form>
                    </div>`);
                    $('#addItemForm').submit(() => {
                        preventDefault();

                        // do ajax stuff in here
                    });







                    ///////
                    // $('#loginBtn').show();
                    $('#userForm').addClass('d-none');
                    $('.main').removeClass('d-none');
                    $('#addListBtn').removeClass('d-none');
                }
            } ,
            error: function(err){
                console.log(err);
                console.log('Something went wrong');
            }
        });
    }
});


//
// itemCard = () => {
//   $.ajax({
//     url: `{url}/item`,
//     type: 'GET',
//     dataType: 'json',
//     success: function(data){
//       console.log(data);
//       $('#cardContainer').empty();
//       for (var i = 0; i < data.length; i++) {
//         $('#cardContainer').append(`
//           <div class="card col-6">
//           <img id="workImg" src="${data[i].imgURL}" class="card-img-top">
//             <div>
//              <div id="worktitle" class="card-title">
//                <h5 class="card-title text-center mt-3" data-id="${data[i].itemName}">${data[i].itemName}</h5>
//                <p class="text-center">${data[i].price}</p>
//              </div>
//               <div class="d-flex justify-content-between align-items-center btn-group">
//                 <button class="btn btn-primary" type="button" name="button">Detail</button>
//               </div>
//             </div>
//           </div>`);
//       }
//     },
//     error: function(err){
//       console.log(err);
//       console.log('Something went wrong');
//     }
//   })
// }
