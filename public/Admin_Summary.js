$(document).ready(function () {
    $('.grid').masonry({
        // options
        itemSelector: '.grid-item',
        columnWidth: 500
    });

    var json_response_string = sessionStorage.getItem('JSON_Response');
    var recent_notification_list = [];
    try {
        var json_response_object = JSON.parse(json_response_string);
        console.log(json_response_object);
    } catch (error) {
        Swal({
            type: 'error',
            title: 'Something went Wrong!',
            text: 'Please contact your administrator for assistance. Thank you!'
        }).then(() => {
            windows.location.assign("index.html");
        });
    }

    var params = {};
    params.Acc_ID = json_response_object.Account_Details.Acc_ID;
    requestHttps("https://requench-rest.herokuapp.com/Fetch_Notifs.php", params, data => {

        var recent_notifs_length = data.Notifications.length;
        if(recent_notifs_length >= 2){
            recent_notifs_length = 2;
        }

        console.log(data.Notifications);
        data.Notifications.sort(compDateTime);

        if (data.Notifications.length >=2) {
            recent_notifs_length = 2;
        }

        clearRecentNotifs();

        var recent_notif_list = document.getElementById("recent_notif_list");

        for (let index = 0; index < recent_notifs_length; index++) {
            var html_string = `<div class="dropdown-item notif-item container">
            <img id="notif-icon" class="notif-icon" src="assets/images/profile.jpg" alt="">
            <div class="d-inline-block recent-notif-content">
                <h5 id="notif-title" class="notif-title">${data.Notifications[index].Notif_Title}</h5>
                <p id="notif-description" class="notif-description">${data.Notifications[index].Notif_Desc}</p>
            </div>
            </div>`;
            console.log(html_string);
            var $container = $("#recent_notif_list");
            console.log($container);
            var html = $.parseHTML(html_string);
            $container.append(html);
        }

        console.log(data.Notifications);
    });





    function compDateTime(a,b) {
        var date_1 = new Date(a.Date_Posted + " " + a.Time_Posted);
        var date_2 = new Date(b.Date_Posted + " " + b.Time_Posted);
    
        if (date_1 > date_2) {
            return -1;
        } else {
            return 0;
        }
    }

    function displayRecentNotifs() {
        clearRecentNotifs();
    }

    function clearRecentNotifs() {
        var recent_notif_list = document.getElementById("recent_notif_list");
        recent_notif_list.innerHTML = '';
    }


});
