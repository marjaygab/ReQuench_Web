$('document').ready(function(params) {
    var notifications_list = [];
    var response = JSON.parse(sessionStorage.getItem('JSON_Response'));
    var params = {};
    params.Acc_ID = response.Account_Details.Acc_ID;

    requestHttps('https://requench-rest.herokuapp.com/Fetch_Notifs.php',params,function(response) {
        if (response.Success) {
            console.log(response);
            notifications_list = response.Notifications;
            notifications_list.sort(compDateTime);
            displayNotifs(notifications_list,function(notifications) {
                var seen_toggler = document.getElementsByClassName('your_seen_toggler');
                for (var i = 0; i < seen_toggler.length; i++) {
                    seen_toggler[i].onclick = function () {
                        var notif_id = this.parentElement.parentElement.parentElement.parentElement.id;
                        
                        if (this.className == 'far fa-circle your_seen_toggler') {
                            //unseens a notif
                            
                            updateSeenDB(notif_id, false,this, function (child_element) {
                                child_element.className = 'fas fa-circle your_seen_toggler';
                                console.log('Unseens');
                                updateNotifs();
                            });
                            //put db seen syncs here
                        } else {
                            //seens a notif
                            var child_element = this;
                            var parent_div = this.parentElement.parentElement.parentElement.parentElement;
                            updateSeenDB(notif_id, true,this, function (child_element) {
                                child_element.className = 'far fa-circle your_seen_toggler';
                                console.log('Seens');
                                updateNotifs();
                            });
                        }
                    }
                }
                for (var i = 0; i < notif_list.length; i++) {
                    if (!notif_list[i].Seen) {
                        notif_counter++;
                    }
                }
            });
        }
    });


    function displayNotifs(notifications,fn) {
        clearYourNotifs();
        var size = notifications.length;
        for (var i = 0; i < size; i++) {
            var fromnow = moment(notifications[i].Date_Posted + ' ' + notifications[i].Time_Posted).fromNow();
            if (notifications[i].Seen) {
                var string = `<div class="card bg-light your_notif_card">
                <div class="card-body">
                    <div id="recent_notif_list" class="notif-list">
                        <div id="${notifications[i].Notif_ID}" class="your_notification_item">
                            <img id="" class="your_notif_icon" src="assets/images/logo.png" alt="">
                            <div class="d-inline-block your_notif_content">
                                <h5 id="" class="your_notif_title">${notifications[i].Notif_Title}<a href=#><span
                                            class="far fa-circle your_seen_toggler"></span></a></h5>
                                <p id="" class="your_notif_description">${notifications[i].Notif_Desc}</p>
                                <small class="time_ago">${fromnow}</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
            } else {
                var string = `<div class="card bg-light your_notif_card">
                <div class="card-body">
                    <div id="recent_notif_list" class="notif-list">
                        <div id="${notifications[i].Notif_ID}" class="your_notification_item">
                            <img id="" class="your_notif_icon" src="assets/images/logo.png" alt="">
                            <div class="d-inline-block your_notif_content">
                                <h5 id="" class="your_notif_title">${notifications[i].Notif_Title}<a href=#><span
                                            class="fas fa-circle your_seen_toggler"></span></a></h5>
                                <p id="" class="your_notif_description">${notifications[i].Notif_Desc}</p>
                                <small class="time_ago">${fromnow}</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
            }
            var $container = $('#your_notifs_container');
            var html = $.parseHTML(string);
            $container.append(html);
        }

        fn(notifications);
    }

    function clearYourNotifs() {
        var your_notifs_container = document.getElementById('your_notifs_container');
        your_notifs_container.innerHTML = '';
    }

    function compDateTime(a,b) {
        var date_1 = new Date(a.Date_Posted + " " + a.Time_Posted);
        var date_2 = new Date(b.Date_Posted + " " + b.Time_Posted);
    
        if (date_1 > date_2) {
            return -1;
        } else {
            return 0;
        }
    }

    function updateSeenDB(notif_id, seen,child_element, fn) {
        var params = {};
        var response = JSON.parse(sessionStorage.getItem('JSON_Response'));
        params.Acc_ID = response.Account_Details.Acc_ID;
        params.Notif_ID = notif_id;
        params.Seen = seen;
        var success = false;
        requestHttp('POST', "https://requench-rest.herokuapp.com/Update_Seen.php", params, function (e) {
            if (this.readyState == 4 && this.status == 200) {
                var response = this.responseText;
                if (response != null) {
                    var response_object = JSON.parse(response);
                    console.log(response_object);
                    if (response_object.Success == true) {
                        fn(child_element);
                    }
                    else {
                        // success = false;
                    }
                }
            } else {
                // success = false;
            }
        });
    }
});