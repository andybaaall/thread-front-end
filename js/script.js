let serverURL;
let serverPort;
let url;

$('#loginBtn').click(function(){
  $('.main').addClass('d-none');
  $('#userForm').removeClass('d-none');
});

$('#logoutBtn').click(function(){
    if(!sessionStorage['userID']){
        alert('401, permission denied');
        return;
    };
    sessionStorage.clear();
    $('#loginBtn').removeClass('d-none');
    $('#logoutBtn').addClass('d-none');
});

$(document).ready(function(){
  console.log(sessionStorage);
  if(sessionStorage.userName){
      $('#loginBtn').addClass('d-none');
      $('#logoutBtn').removeClass('d-none');
  } else {
    console.log('please sign in');
  }
});

$.ajax({
  url: 'config.json',
  type: 'GET',
  dataType: 'json',
  success:function(keys){
    serverURL = keys['SERVER_URL'];
    serverPort = keys['SERVER_PORT'];
    url = `${keys['SERVER_URL']}:${keys['SERVER_PORT']}`;
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
     })
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
                 sessionStorage.setItem('userID', result['_id']);
                 sessionStorage.setItem('userName', result['username']);
                 sessionStorage.setItem('userEmail', result['email']);
                 ////////

                 // result.username -> sessionStorage.username
                 // result.user_id -> sessionStorge.user_id
                 // this bad baby tells us who's logged in
                 // and if we know who's logged in, we know whose ID to attach to items and comments






                 ///////
                 $('#loginBtn').text('Logout');
                 $('#userForm').addClass('d-none');
                 $('.main').removeClass('d-none');
                 $('#addListBtn').removeClass('d-none');
             }
         } ,
      error: function(err){
          console.log(err);
          console.log('Something went wrong');
      }
    })
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
