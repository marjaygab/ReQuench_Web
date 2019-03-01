$(document).ready(function () {
    const messaging = firebase.messaging();
    var logout_button = document.getElementById('logout_button');
    var notif_list_div = document.getElementById('notif_list');
    var notif_count = document.getElementById('notif_count');
    var permission = Notification.permission;
    var notif_list = [];
    var user_list = [];
    var admin_list = [];
    var cashier_list = [];
    var params = {};
    var response = JSON.parse(sessionStorage.getItem('JSON_Response'));
    var previous_list_count;
    var notif_counter = 0;
    var user_tab = document.getElementById('user_tab');
    var admin_tab = document.getElementById('admin_tab');
    var cashier_tab = document.getElementById('cashier_tab');
    var search_bar = document.getElementById('search_bar');
    var add_account = document.getElementById('add_account');
    var current_active = 'USER';

    //initialize
    var params = {};
    params.Access_Level = 'USER';
    requestHttp('POST', "https://requench-rest.herokuapp.com/Fetch_Accounts.php", params, function (e) {
        if (this.readyState == 4 && this.status == 200) {
            var response = this.responseText;
            if (response != null) {
                var json_object = JSON.parse(this.response);
                if (json_object.Success == true) {
                    for (var i = 0; i < json_object.USER.length; i++) {
                        user_list.push(json_object.USER[i]);
                    }

                    var params = {};
                    params.Access_Level = 'ADMIN';
                    requestHttp('POST', "https://requench-rest.herokuapp.com/Fetch_Accounts.php", params, function (e) {
                        if (this.readyState == 4 && this.status == 200) {
                            var response = this.responseText;
                            if (response != null) {
                                var json_object = JSON.parse(this.response);
                                if (json_object.Success == true) {
                                    for (var i = 0; i < json_object.ADMIN.length; i++) {
                                        admin_list.push(json_object.ADMIN[i]);
                                    }

                                    var params = {};
                                    params.Access_Level = 'CASHIER';
                                    requestHttp('POST', "https://requench-rest.herokuapp.com/Fetch_Accounts.php", params, function (e) {
                                        if (this.readyState == 4 && this.status == 200) {
                                            var response = this.responseText;
                                            if (response != null) {
                                                var json_object = JSON.parse(this.response);
                                                if (json_object.Success == true) {
                                                    for (var i = 0; i < json_object.CASHIER.length; i++) {
                                                        cashier_list.push(json_object.CASHIER[i]);
                                                    }
                                                    clearAccountList();
                                                    displayAccountCards(user_list);
                                                }
                                            }
                                        }
                                    });

                                }
                            }
                        }
                    });

                }
            }
        }
    });


    user_tab.onclick = function () {
        current_active = 'USER';
        search_bar.placeholder = "Search User";
        cashier_tab.className = "nav-link";
        admin_tab.className = "nav-link";
        this.className = "nav-link active";
        clearAccountList();
        displayAccountCards(user_list);
    }

    admin_tab.onclick = function () {
        current_active = 'ADMIN';
        search_bar.placeholder = "Search Admin";
        cashier_tab.className = "nav-link";
        user_tab.className = "nav-link";
        this.className = "nav-link active";
        clearAccountList();
        displayAccountCards(admin_list);
    }

    cashier_tab.onclick = function () {
        current_active = 'CASHIER';
        search_bar.placeholder = "Search Cashier";
        user_tab.className = "nav-link";
        admin_tab.className = "nav-link";
        this.className = "nav-link active";
        clearAccountList();
        displayAccountCards(cashier_list);
    }

    search_bar.oninput = function () {
        switch (current_active) {
            case 'USER':
                var filtered_items = user_list.filter(obj => {
                    return obj.First_Name.toLowerCase().includes(this.value) || obj.Last_Name.toLowerCase().includes(this.value)
                    obj.User_Name.toLowerCase().includes(this.value) || obj.Email.toLowerCase().includes(this.value)
                    obj.ID_Number.toLowerCase().includes(this.value);
                });
                console.log(filtered_items);
                clearAccountList();
                displayAccountCards(filtered_items);
                break;
            case 'ADMIN':
                var filtered_items = admin_list.filter(obj => {
                    return obj.First_Name.toLowerCase().includes(this.value) || obj.Last_Name.toLowerCase().includes(this.value)
                    obj.User_Name.toLowerCase().includes(this.value) || obj.Email.toLowerCase().includes(this.value)
                    obj.ID_Number.toLowerCase().includes(this.value);
                });
                console.log(filtered_items);
                clearAccountList();
                displayAccountCards(filtered_items);
                break;
            case 'CASHIER':
                var filtered_items = cashier_list.filter(obj => {
                    return obj.First_Name.toLowerCase().includes(this.value) || obj.Last_Name.toLowerCase().includes(this.value)
                    obj.User_Name.toLowerCase().includes(this.value) || obj.Email.toLowerCase().includes(this.value)
                    obj.ID_Number.toLowerCase().includes(this.value);
                });
                console.log(filtered_items);
                clearAccountList();
                displayAccountCards(filtered_items);
                break;
            default:

        }
    }

    add_account.onclick = function () {
        Swal({
            title: "Add New Account",
            showConfirmButton: false,
            html: `
            <div class="container">
              <div class="row form-account">
                <div class="col-sm-8">
                  <input id = "ID_Number" type="text" class="form-control" placeholder = "ID Number">
                  <p id="duplicate_id_error" class="error">Duplicated ID Detected!</p>
                </div>
                <div class="dropdown col-sm-4">
                  <button class="btn btn-block btn-secondary dropdown-toggle" type="button" id="dropdownMenuButtonCat" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Access Level</button>
                  <div class="dropdown-menu" aria-labelledby="dropdownMenuButtonCat">
                    <a id="access_level_user" class="dropdown-item category-item active" href="#">USER</a>
                    <a id="access_level_admin" class="dropdown-item category-item" href="#">ADMIN</a>
                    <a id="access_level_cashier" class="dropdown-item category-item" href="#">CASHIER</a>
                  </div>
                </div>
              </div>
              <div class="row form-account">
                <div class="col-sm-6">
                  <input id="First_Name" type="text" class="form-control" placeholder = "First Name" required>
                </div>
                <div class="col-sm-6">
                  <input id="Last_Name" type="text" class="form-control" placeholder = "Last Name" required>
                </div>
              </div>
              <div class="row form-account">
                <div class="col-sm-12">
                  <input id="Email" type="text" class="form-control" placeholder = "Email" required>
                  <p id="duplicate_email_error" class="error">Duplicate Email Detected!</p>
                </div>
              </div>
              <div class="row form-account">
                <div class="col-sm-12">
                  <input id="User_Name" type="text" class="form-control" placeholder = "User Name" required>
                  <p id="username_taken_error" class="error">This username is already taken!</p>
                </div>
              </div>
              <div class="row form-account">
                <div class="col-sm-6">
                  <input id="Password" type="text" class="form-control" placeholder = "Password" required>
                </div>
                <div class="col-sm-6">
                  <input id="Retype_Password" type="password" class="form-control" placeholder = "Retype Password" required>
                  <p id="pass_mismatch_error" class="error">Password Mismatch!</p>
                </div>
              </div>
              <div class="row form-account">
                <div class="col-sm-12">
                  <button id = "submit" type="submit" class="btn btn-primary">Submit</button>
                  <p id="incomplete_info_error" class="error">Please fill out all required fields!</p>
                </div>
              </div>
            </div>
      `,
            onBeforeOpen: function () {
                const content = Swal.getContent();
                const $ = content.querySelector.bind(content);
                const id_num = $('#ID_Number');
                const first_name = $('#First_Name');
                const last_name = $('#Last_Name');
                const user_name = $('#User_Name');
                const password = $('#Password');
                const retype_password = $('#Retype_Password');
                const email = $('#Email');
                const submit = $('#submit');
                const duplicate_id_error = $('#duplicate_id_error');
                const duplicate_email_error = $('#duplicate_email_error');
                const username_taken_error = $('#username_taken_error');
                const pass_mismatch_error = $('#pass_mismatch_error');
                const access_level_user = $('#access_level_user');
                const access_level_admin = $('#access_level_admin');
                const access_level_cashier = $('#access_level_cashier');
                const dropdownMenuButtonCat = $('#dropdownMenuButtonCat');
                duplicate_id_error.style.visibility = "hidden";
                duplicate_email_error.style.visibility = "hidden";
                username_taken_error.style.visibility = "hidden";
                pass_mismatch_error.style.visibility = "hidden";
                incomplete_info_error.style.visibility = "hidden";
                var valid_id = false;
                var valid_email = false;
                // var valid_first = false;
                // var valid_last = false;
                var valid_user = false;
                // var valid_password = false;

                access_level_user.onclick = function () {
                    this.className = "dropdown-item category-item active";
                    access_level_admin.className = "dropdown-item category-item";
                    access_level_cashier.className = "dropdown-item category-item";
                    dropdownMenuButtonCat.innerHTML = 'USER';
                }
                access_level_admin.onclick = function () {
                    this.className = "dropdown-item category-item active";
                    access_level_user.className = "dropdown-item category-item";
                    access_level_cashier.className = "dropdown-item category-item";
                    dropdownMenuButtonCat.innerHTML = 'ADMIN';
                }
                access_level_cashier.onclick = function () {
                    this.className = "dropdown-item category-item active";
                    access_level_admin.className = "dropdown-item category-item";
                    access_level_user.className = "dropdown-item category-user";
                    dropdownMenuButtonCat.innerHTML = 'CASHIER';
                }

                id_num.onblur = function () {
                  var params = {};
                  params.Command = "ID_NUM";
                  params.Variable = this.value;
                  requestHttp('POST',"https://requench-rest.herokuapp.com/Check_Dup.php",params,function(e) {
                    if (this.readyState == 4 && this.status == 200) {
                      var response = this.responseText;
                      if (response != null) {
                        console.log(response);
                        var json_object = JSON.parse(response);
                        console.log(json_object.Success);
                        valid_id = true;
                        if (!json_object.Success) {
                          duplicate_id_error.style.visibility = "visible";
                          valid_id = false;
                        }
                      }
                    }
                  });

                }
                id_num.onfocus = function () {
                    duplicate_id_error.style.visibility = "hidden";

                }

                email.onblur = function () {
                  var params = {};
                  params.Command = "EMAIL";
                  params.Variable = this.value;
                  requestHttp('POST',"https://requench-rest.herokuapp.com/Check_Dup.php",params,function(e) {
                    if (this.readyState == 4 && this.status == 200) {
                      var response = this.responseText;
                      if (response != null) {
                        console.log(response);
                        var json_object = JSON.parse(response);
                        console.log(json_object.Success);
                        valid_email = true;

                        if (!json_object.Success) {
                          duplicate_email_error.style.visibility = "visible";
                          valid_email = false;
                        }
                      }
                    }
                  });
                }

                email.onfocus = function () {

                  duplicate_email_error.style.visibility = "hidden";
                }

                user_name.onblur = function () {
                  var params = {};
                  params.Command = "USER_NAME";
                  params.Variable = this.value;
                  requestHttp('POST',"https://requench-rest.herokuapp.com/Check_Dup.php",params,function(e) {
                    if (this.readyState == 4 && this.status == 200) {
                      var response = this.responseText;
                      if (response != '') {
                        console.log(response);
                        var json_object = JSON.parse(response);
                        console.log(json_object.Success);
                        valid_user = true;

                        if (!json_object.Success) {
                          username_taken_error.style.visibility = "visible";
                          valid_user = false;
                        }
                      }
                    }
                  });
                }

                user_name.onfocus = function () {

                  username_taken_error.style.visibility = "hidden";
                }
                pass_mismatch_error.onfocus = function () {

                  pass_mismatch_error.style.visibility = "hidden";
                }

                submit.onclick = function () {
                    var params = {};
                    params.ID_Number = id_num.value;
                    params.First_Name = first_name.value;
                    params.Last_Name = last_name.value;
                    params.User_Name = user_name.value;
                    params.Password = password.value;
                    params.retype_password = retype_password.value;
                    params.Email = email.value;
                    params.Access_Level = dropdownMenuButtonCat.innerHTML;
                    // var regex = new RegExp('[a-zA-Z]');
                    // params.Access_Level = regex.matchAll(dropdownMenuButtonCat.innerHTML);
                    console.log(params);

                    if (params.Password != params.retype_password) {
                    document.getElementById('Retype_Password').value = '';
                    pass_mismatch_error.style.visibility = "visible";

                    //handle error here
                    }
                    else if (id_num.value == '' || first_name.value == '' || last_name.value == '' || user_name.value == '' || password.value == '') {
                    incomplete_info_error.style.visibility = "visible";
                    //handle error here
                    }
                    else if (valid_id == true && valid_email == true && valid_user == true) {
                        requestHttp('POST', "https://requench-rest.herokuapp.com/Add_Account.php", params, function (e) {
                            if (this.readyState == 4 && this.status == 200) {
                                var response = this.responseText;
                                console.log(response);
                                if (response != null) {
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
                                    Swal.close();
                                }
                            } else {
                                console.log('else');
                            }
                        });
                    }
                }
            },
            onClose: function () {

            }
        });
    }



    params.Acc_ID = response.Account_Details.Acc_ID;

    $('.dropdown-menu').click(function (e) {
        e.stopPropagation();
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
                    notif_list.sort(compByDateDesc);
                    previous_list_count = notif_list.length;
                    clearList(notif_list_div);
                    displayNotifs("#notif_list", notif_list, function () {
                        var seen_toggler = document.getElementsByClassName('seen_toggler');
                        console.log(seen_toggler.length);
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

        requestHttp('POST', "https://requench-rest.herokuapp.com/Fetch_Notifs.php", params, function (e) {
            if (this.readyState == 4 && this.status == 200) {
                console.log('A Message is received!');
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
                        notif_list.sort(compByDateDesc);
                        previous_list_count = notif_list.length;
                        clearList(notif_list_div);
                        displayNotifs("#notif_list", notif_list, function () {
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


    logout_button.onclick = function () {
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


    function clearAccountList() {
        document.getElementById('navi-slots').innerHTML = "";
    }

    function displayAccountCards(list) {
        var size = list.length;
        for (var i = 0; i < list.length; i++) {
            var file_path = list[i].Image_Path;
            if (file_path == null) {
                file_path = "https://requench-rest.herokuapp.com/user_images/logo.png";
            } else {
                file_path = `https://requench-rest.herokuapp.com/${file_path}`;
            }
            var string = `<div class="col-sm-4">
        <div class="card account_card">
          <div id="logo" class="btn logo">
            <div class="card-body">
              <div id="profile_picture" class="profile_picture test inline-elem" style="background-image:url('${file_path}')">
              </div>
              <div class="d-inline-block user_details">
                <h5 class="card-title user_full_name">${list[i].First_Name + ' ' + list[i].Last_Name}</h5>
                <p class="card-text user_join_date">ID Number: <span id="id_num">${list[i].ID_Number}</span></p>
                <p id="demo"></p>
              </div>
            </div>
          </div>
        </div>`;
            console.log(string);
            var $container = $('#navi-slots');
            var html = $.parseHTML(string);
            $container.append(html);

              var session_var = sessionStorage.getItem('JSON_Response');
              var jsonobj = JSON.parse(session_var);
              var params = {};
              params.Acc_ID = jsonobj.Account_Details.Acc_ID;
              console.log(params.Acc_ID);
              var profile_picture_div = document.getElementById('profile_picture');
              var id_num_field = document.getElementById('id_num_field');
              var user_field = document.getElementById('user_field');
              var first_field = document.getElementById('first_field');
              var last_field = document.getElementById('last_field');
              var email_field = document.getElementById('email_field');
              var access_level_field = document.getElementById('access_level_field');
              var pass_field = document.getElementById('pass_field');
              var balance_field = document.getElementById('balance_field');
              var logo = document.getElementsByClassName('logo');

              updateSessionVariable(params,function(response){
                console.log(response);
                var string_json = JSON.stringify(response);
                sessionStorage.setItem('JSON_Response',string_json);

                jsonobj = JSON.parse(sessionStorage.getItem('JSON_Response'));
                console.log(jsonobj);
                // jsonobj = session_var;
                var path = "url('.." + jsonobj.file_path +"')";
                profile_picture_div.style.backgroundImage = "url('../ReQuench/" + jsonobj.file_path +"')";
                id_num_field.value = jsonobj.Account_Details.ID_Number;
                user_field.value = jsonobj.Account_Details.User_Name;
                first_field.value = jsonobj.Account_Details.First_Name;
                last_field.value = jsonobj.Account_Details.Last_Name;
                email_field.value = jsonobj.Account_Details.Email;
                dropdownMenuButtonCat.value = jsonobj.Account_Details.dropdownMenuButtonCat;
                pass_field.value = jsonobj.Account_Details.Password;
                balance_field.value = jsonobj.Account_Details.Balance;
              });

              // var edit_mode = {
              //   accounts:false,
              //   id_num:false,
              //   user_name:false,
              //   first_name:false,
              //   last_name:false,
              //   email:false,
              //   access_level:false,
              //   password:false,
              //   balance:false,
              // };

            logo.ondblclick = function(){
            Swal({
                title: "Edit Existing Account",
                showConfirmButton: false,
                html: `
            <div class="container">
              <div class="row form-account">
                <div class="col-sm-8">
                  <input id = "id_num_field" type="text" class="form-control" placeholder = "ID Number">
                  <p id="duplicate_id_error" class="error">Duplicated ID Detected!</p>
                </div>
                <div class="dropdown col-sm-4">
                <button class="btn btn-block btn-secondary dropdown-toggle" type="button" id="dropdownMenuButtonCat" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Access Level</button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButtonCat">
                  <a id="access_level_user" class="dropdown-item category-item active" href="#">USER</a>
                  <a id="access_level_admin" class="dropdown-item category-item" href="#">ADMIN</a>
                  <a id="access_level_cashier" class="dropdown-item category-item" href="#">CASHIER</a>
                </div>
              </div>
            </div>
              <div class="row form-account">
                <div class="col-sm-6">
                  <input id="First_Name" type="text" class="form-control" placeholder = "First Name" required>
                </div>
                <div class="col-sm-6">
                  <input id="Last_Name" type="text" class="form-control" placeholder = "Last Name" required>
                </div>
              </div>
              <div class="row form-account">
                <div class="col-sm-12">
                  <input id="Email" type="text" class="form-control" placeholder = "Email" required>
                  <p id="duplicate_email_error" class="error">Duplicate Email Detected!</p>
                </div>
              </div>
              <div class="row form-account">
                <div class="col-sm-12">
                  <input id="User_Name" type="text" class="form-control" placeholder = "User Name" required>
                  <p id="username_taken_error" class="error">This username is already taken!</p>
                </div>
              </div>
              <div class="row form-account">
                <div class="col-sm-6">
                  <input id="Password" type="text" class="form-control" placeholder = "Password" required>
                </div>
                <div class="col-sm-6">
                  <input id="Retype_Password" type="password" class="form-control" placeholder = "Retype Password" required>
                  <p id="pass_mismatch_error" class="error">Password Mismatch!</p>
                </div>
              </div>
              <div class="row form-account">
                <div class="col-sm-12">
                  <button id = "submit" type="submit" class="btn btn-primary">Submit</button>
                  <p id="incomplete_info_error" class="error" >Please fill out all required fields!</p>
                </div>
              </div>
            </div>
    `,
                onBeforeOpen: function () {
                    const content = Swal.getContent();
                    const $ = content.querySelector.bind(content);
                    const id_num_field = $('#ID_Number');
                    const first_field = $('#First_Name');
                    const last_field = $('#Last_Name');
                    const user_field = $('#User_Name');
                    const pass_field = $('#Password');
                    const balance_field = $('#Balance');
                    const user_field = $('#User_Name');
                    const pass_field = $('#Password');
                    const retype_password = $('#Retype_Password');
                    const email_field = $('#Email');
                    const access_level_user = $('#access_level_user');
                    const access_level_admin = $('#access_level_admin');
                    const access_level_cashier = $('#access_level_cashier');
                    const dropdownMenuButtonCat = $('#dropdownMenuButtonCat');
                    const submit = $('#submit');
                    const duplicate_id_error = $('#duplicate_id_error');
                    const duplicate_email_error = $('#duplicate_email_error');
                    const username_taken_error = $('#username_taken_error');
                    const pass_mismatch_error = $('#pass_mismatch_error');

                    duplicate_id_error.style.visibility = "hidden";
                    duplicate_email_error.style.visibility = "hidden";
                    username_taken_error.style.visibility = "hidden";
                    pass_mismatch_error.style.visibility = "hidden";
                    incomplete_info_error.style.visibility = "hidden";
                    var valid_id = false;
                    var valid_email = false;
                    var valid_first = false;
                    var valid_last = false;
                    var valid_user = false;
                    var valid_password = false;
            }
          });
        }
    }
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
        fn();
    }


    function clearList(notif_list) {
        notif_list.innerHTML = "";
    }

    function compByDateDesc(a, b) {
        if (Date.parse(a.Date_Posted) > Date.parse(b.Date_Posted)) {
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

});
