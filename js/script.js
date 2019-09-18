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
