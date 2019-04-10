const messaging = firebase.messaging();
var logout_button = document.getElementById('logout_button');
var notif_list_div = document.getElementById('notif_list');
var notif_count = document.getElementById('notif_count');
var permission = Notification.permission;
var notif_list = [];
var params = {};
console.log(sessionStorage.getItem('JSON_Response'));
var response = JSON.parse(sessionStorage.getItem('JSON_Response'));
var previous_list_count;
var notif_counter = 0;
params.Acc_ID = response.Account_Details.Acc_ID;

var seen_toggler = {
  seen:function(){
    $('.active_notif').removeClass('active_notif').addClass('new_class');
  },
  unseen:function() {
  }
}

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        console.log(user.displayName + " is Signed in");
    } else {
        window.location.href = "index.html";
    }
});

$('.dropdown-menu').click(function (e) {
    e.stopPropagation();
});

$(window).blur(function(e) {
    console.log('Tab Blurred');
});

$(window).focus(function(e) {
    requestHttp('POST', "https://requench-rest.herokuapp.com/Fetch_Notifs.php", params, function (e) {
    if (this.readyState == 4 && this.status == 200) {
        var response = this.responseText;
        if (response != null) {
            var json_object = JSON.parse(this.response);
            if (json_object.Success == true) {
                //enlist parsed notifs
                notif_counter = 0;
                notif_list = [];
                for (var i = 0; i < json_object.Notifications.length; i++) {
                    notif_list.push(json_object.Notifications[i]);
                }
                notif_list.sort(compDateTime);
                console.log(notif_list);
                previous_list_count = notif_list.length;
                clearList(notif_list_div);
                displayNotifs("#notif_list", notif_list, function (notif_list) {
                    var seen_toggler = document.getElementsByClassName('seen_toggler');
                    for (var i = 0; i < seen_toggler.length; i++) {
                        seen_toggler[i].onclick = function () {
                            var notif_id = this.parentElement.parentElement.parentElement.parentElement.id;
                            if (this.className == 'far fa-circle seen_toggler') {
                                //unseens a notif
                                var child_element = this;
                                var parent_div = this.parentElement.parentElement.parentElement.parentElement;
                                updateSeenDB(notif_id, false, parent_div, child_element, function () {
                                    parent_div.className = 'dropdown-item notif-item container active_notif';
                                    notif_counter++;
                                    child_element.className = 'fas fa-circle seen_toggler';
                                    document.getElementById('notif_count').innerHTML = notif_counter;
                                });
                                //put db seen syncs here
                            } else {
                                //seens a notif
                                var child_element = this;
                                var parent_div = this.parentElement.parentElement.parentElement.parentElement;
                                updateSeenDB(notif_id, true, parent_div, child_element, function () {
                                    parent_div.className = 'dropdown-item notif-item container';
                                    //put db seen syncs here
                                    child_element.className = 'far fa-circle seen_toggler';
                                    if (notif_counter != 0) {
                                        notif_counter--;
                                        document.getElementById('notif_count').innerHTML = notif_counter;
                                    }
                                });
                            }
                        }
                    }
                });
                for (var i = 0; i < notif_list.length; i++) {
                    if (!notif_list[i].Seen) {
                        notif_counter++;
                    }
                }
                document.getElementById('notif_count').innerHTML = notif_counter;
            }
            else {
            }
        }
    }
});
});


//get initial notif list
requestHttp('POST', "https://requench-rest.herokuapp.com/Fetch_Notifs.php", params, function (e) {
    if (this.readyState == 4 && this.status == 200) {
        var response = this.responseText;
        if (response != null) {
            var json_object = JSON.parse(this.response);
            if (json_object.Success == true) {
                //enlist parsed notifs
                notif_counter = 0;
                notif_list = [];
                for (var i = 0; i < json_object.Notifications.length; i++) {
                    notif_list.push(json_object.Notifications[i]);
                }
                notif_list.sort(compDateTime);
                previous_list_count = notif_list.length;
                clearList(notif_list_div);
                displayNotifs("#notif_list", notif_list, function (notif_list) {
                    var seen_toggler = document.getElementsByClassName('seen_toggler');
                    for (var i = 0; i < seen_toggler.length; i++) {
                        seen_toggler[i].onclick = function () {
                            var notif_id = this.parentElement.parentElement.parentElement.parentElement.id;
                            if (this.className == 'far fa-circle seen_toggler') {
                                //unseens a notif
                                var child_element = this;
                                var parent_div = this.parentElement.parentElement.parentElement.parentElement;
                                updateSeenDB(notif_id, false, parent_div, child_element, function () {
                                    parent_div.className = 'dropdown-item notif-item container active_notif';
                                    notif_counter++;
                                    child_element.className = 'fas fa-circle seen_toggler';
                                    document.getElementById('notif_count').innerHTML = notif_counter;
                                });
                                //put db seen syncs here
                            } else {
                                //seens a notif
                                var child_element = this;
                                var parent_div = this.parentElement.parentElement.parentElement.parentElement;
                                updateSeenDB(notif_id, true, parent_div, child_element, function () {
                                    parent_div.className = 'dropdown-item notif-item container';
                                    //put db seen syncs here
                                    child_element.className = 'far fa-circle seen_toggler';
                                    if (notif_counter != 0) {
                                        notif_counter--;
                                        document.getElementById('notif_count').innerHTML = notif_counter;
                                    }
                                });
                            }
                        }
                    }
                });
                for (var i = 0; i < notif_list.length; i++) {
                    if (!notif_list[i].Seen) {
                        notif_counter++;
                    }
                }
                document.getElementById('notif_count').innerHTML = notif_counter;
            }
            else {
            }
        }
    }
});

// console.log(seen_toggler.item(2));


if (permission == 'granted') {
    messaging.getToken().then(function (currentToken) {
        if (currentToken) {
            var params = {};
            var response = JSON.parse(sessionStorage.getItem('JSON_Response'));
            params.Acc_ID = response.Account_Details.Acc_ID;
            params.registration_token = currentToken;

            requestHttp('POST', "https://requench-rest.herokuapp.com/Update_Token.php", params, function (e) {
                if (this.readyState == 4 && this.status == 200) {
                    var response = this.responseText;
                    if (response != null) {
                        console.log(response);
                        var json_object = JSON.parse(this.response);
                        if (json_object.Success == true) {
                            //enlist parsed notifs
                            console.log('Update Success');
                        }
                        else {
                            Swal({
                                type: 'error',
                                title: 'Oops!',
                                text: 'Something went wrong! Please try again later.'
                            });
                        }
                        // window.location.href = 'User.php';
                    }
                }
            });
        } else {
            // Show permission request.
            console.log('No Instance ID token available. Request permission to generate one.');
            // Show permission UI.
        }
    }).catch(function (err) {
        console.log('An error occurred while retrieving token. ', err);
        showToken('Error retrieving Instance ID token. ', err);
    });
} else if (permission == 'default') {
    messaging.requestPermission()
        .then(function () {
            messaging.getToken().then(function (currentToken) {
                if (currentToken) {
                    var params = {};
                    var response = JSON.parse(sessionStorage.getItem('JSON_Response'));
                    params.Acc_ID = response.Account_Details.Acc_ID;
                    params.registration_token = currentToken;

                    requestHttp('POST', "https://requench-rest.herokuapp.com/Update_Token.php", params, function (e) {
                        if (this.readyState == 4 && this.status == 200) {
                            var response = this.responseText;
                            if (response != null) {
                                console.log(response);
                                var json_object = JSON.parse(this.response);
                                if (json_object.Success == true) {
                                    //enlist parsed notifs
                                    console.log('Update Success');
                                }
                                else {
                                    Swal({
                                        type: 'error',
                                        title: 'Oops!',
                                        text: 'Something went wrong! Please try again later.'
                                    });
                                }
                                // window.location.href = 'User.php';
                            }
                        }
                    });
                } else {
                    // Show permission request.
                    console.log('No Instance ID token available. Request permission to generate one.');
                    // Show permission UI.
                }
            }).catch(function (err) {
                console.log('An error occurred while retrieving token. ', err);
                showToken('Error retrieving Instance ID token. ', err);
            });
        })
        .catch(function () {
            console.log('Error Occured');
        });
} else {
    console.log('Permission denied');
    var params = {};
    var response = JSON.parse(sessionStorage.getItem('JSON_Response'));
    params.Acc_ID = response.Account_Details.Acc_ID;
    //clear registration token to reject incoming background notifications
    requestHttp('POST', "https://requench-rest.herokuapp.com/Clear_Token.php", params, function (e) { });
}

//Get Generated User Token then update the Back End DB fpr changes.

window.onbeforeunload = function (e) {
    var params = {};
    var response = JSON.parse(sessionStorage.getItem('JSON_Response'));
    params.Acc_ID = response.Account_Details.Acc_ID;
    //clear registration token for later renewal
    requestHttp('POST', "https://requench-rest.herokuapp.com/Clear_Token.php", params, function (e) { });
};


messaging.onMessage(function (payload) {
    //handle notification arrival here
    console.log(document.getElementById('notif_count').innerHTML);
    requestHttp('POST', "https://requench-rest.herokuapp.com/Fetch_Notifs.php", params, function (e) {
        if (this.readyState == 4 && this.status == 200) {
            var response = this.responseText;
            if (response != null) {
                var json_object = JSON.parse(this.response);
                if (json_object.Success == true) {
                    //enlist parsed notifs
                    console.log(json_object);

                    notif_counter = 0;
                    notif_list = [];
                    for (var i = 0; i < json_object.Notifications.length; i++) {
                        notif_list.push(json_object.Notifications[i]);
                    }
                    notif_list.sort(compDateTime);
                    previous_list_count = notif_list.length;
                    clearList(notif_list_div);
                    displayNotifs("#notif_list", notif_list, function (notif_list) {
                        var seen_toggler = document.getElementsByClassName('seen_toggler');
                        for (var i = 0; i < seen_toggler.length; i++) {
                            seen_toggler[i].onclick = function () {
                                var notif_id = this.parentElement.parentElement.parentElement.parentElement.id;
                                if (this.className == 'far fa-circle seen_toggler') {
                                    //unseens a notif
                                    var child_element = this;
                                    var parent_div = this.parentElement.parentElement.parentElement.parentElement;
                                    updateSeenDB(notif_id, false, parent_div, child_element, function () {
                                        parent_div.className = 'dropdown-item notif-item container active_notif';
                                        notif_counter++;
                                        child_element.className = 'fas fa-circle seen_toggler';
                                        document.getElementById('notif_count').innerHTML = notif_counter;
                                    });
                                    //put db seen syncs here
                                } else {
                                    //seens a notif
                                    var child_element = this;
                                    var parent_div = this.parentElement.parentElement.parentElement.parentElement;
                                    updateSeenDB(notif_id, true, parent_div, child_element, function () {
                                        parent_div.className = 'dropdown-item notif-item container';
                                        //put db seen syncs here
                                        child_element.className = 'far fa-circle seen_toggler';
                                        if (notif_counter != 0) {
                                            notif_counter--;
                                            document.getElementById('notif_count').innerHTML = notif_counter;
                                        }
                                    });
                                }
                            }
                        }
                        for (var i = 0; i < notif_list.length; i++) {
                            if (!notif_list[i].Seen) {
                                notif_counter++;
                            }
                        }
                        document.getElementById('notif_count').innerHTML = notif_counter;
                    });
                }
                else {
                }

            }
        }
    });
});


logout_button.onclick = function () {
    console.log('Testing');

    firebase.auth().signOut().then(function () {
        var params = {};
        var response = JSON.parse(sessionStorage.getItem('JSON_Response'));
        params.Acc_ID = response.Account_Details.Acc_ID;
        //clear registration token for later renewal
        requestHttp('POST', "https://requench-rest.herokuapp.com/Clear_Token.php", params, function (e) { });
        window.location.href = "index.html";
    }, function (error) {
        Swal({
            type: 'error',
            title: 'Something went Wrong!',
            text: 'Please contact your administrator for assistance. Thank you!'
        });
    });
}




function displayNotifs(id, notifications, fn) {
    var size = notifications.length;
    if (size > 5) {
        size = 5;
    }
    for (var i = 0; i < size; i++) {
        if (notifications[i].Seen) {
            var string = `<div id="${notifications[i].Notif_ID}" class="dropdown-item notif-item container">
      <img id="notif-icon" class="notif-icon" src="assets/images/profile.jpg" alt="">
      <div class="d-inline-block notif-content">
        <h5 id="notif-title" class="notif-title">${notifications[i].Notif_Title} <a href=#><span class="far fa-circle seen_toggler"></span></a></h5>
        <p id="notif-description" class="notif-description">${notifications[i].Notif_Desc}</p>
      </div>
    </div>`;
        } else {
            var string = `<div id="${notifications[i].Notif_ID}" class="dropdown-item notif-item container active_notif">
      <img id="notif-icon" class="notif-icon" src="assets/images/profile.jpg" alt="">
      <div class="d-inline-block notif-content">
        <h5 id="notif-title" class="notif-title">${notifications[i].Notif_Title}<a href=#><span class="fas fa-circle seen_toggler"></span></a></h5>
        <p id="notif-description" class="notif-description">${notifications[i].Notif_Desc}</p>
      </div>
    </div>`;
        }
        var $container = $(id);
        var html = $.parseHTML(string);
        $container.append(html);
    }

    fn(notifications);
}





function clearList(notif_list) {
    notif_list.innerHTML = "";
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



function compByDateDesc(a, b) {
    console.log(a.Date_Posted + " " + a.Time_Posted + " VS " + b.Date_Posted + " " + b.Time_Posted );
    
    if (Date.parse(a.Date_Posted) < Date.parse(b.Date_Posted)) {
        if (a.Time_Posted > b.Time_Posted) {
            return -1;
        } else {
            return 0;
        }
    } else {
        if (a.Time_Posted > b.Time_Posted) {
            return -1;
        } else {
            return 0;
        }
    }
}

function compByTimeDesc(a, b) {
    if (a.Time_Posted > b.Time_Posted) {
        return -1;
    } else {
        return 0;
    }
}

function updateSeenDB(notif_id, seen, parent_div, child_element, fn) {
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
                    fn(parent_div, child_element);
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