let serverURL;
let serverPort;
let url;

$.ajax({
  url: 'config.json',
  type: 'GET',
  dataType: 'json',
  success:function(keys){
    serverURL = keys['SERVER_URL'];
    serverPort = keys['SERVER_PORT'];
    url = `${keys['SERVER_URL']}:${keys['SERVER_PORT']}`;
  },
  error: function(){
    console.log('cannot find config.json file, cannot run application');
  }
});

$('#loginBtn').click(function(){
  $('.main').addClass('d-none');
  $('#loginForm').removeClass('d-none');
})
//
// $('#loginForm').submit(function(){
//   event.preventDefault();
//   const username = $('#lUsername').val();
//   const password = $('#lPassword').val();
//
//   if ((username.length === 0)||(password.length === 0)) {
//       console.log('Please enter your username and password');
//   } else {
//     $.ajax({
//       url: `${url}/getUser`,
//       type: 'GET',
//       data: {
//         username: username,
//         password: password
//       },
//       success: function(result){
//           if (result === 'invalid user') {
//             console.log('cannot find user with that username');
//           } else if (result === 'invalid password') {
//             console.log('your password id wrong');
//
//           } else {
//             console.log('lets log you in');
//
//             $('#authForm').modal('hide');
//             $('#loginBtn').text('log out');
//
//             $('#jumbotron-heading').text('Welcome ' + username)
//
//             $('.btn-link').removeClass('d-none');
//
//           }
//       },
//       error: function(err){
//           console.log(err);
//           console.log('Something went wrong');
//       }
//     })
//   }
// });
