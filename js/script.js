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
