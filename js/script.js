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
            itemCard(); // we need to rework this so that it appends and empties, rather than switches from d-flex to d-none
        },
        error: function(){
            console.log('cannot find config.json file, cannot run application');
        }
    });

    showItems();
});

showItems = () => {
    
};

$('#loginBtn').click(() => {

});

$('#loginForm').submit(() => {

});

$('#registerBtn').click(() => {

});

$('#registerForm').submit(() => {

});

$('#addItemForm').submit(() => {

});

$('#editItemBtn').click(() => {

});

$('#editItemForm').submit(() => {

});
