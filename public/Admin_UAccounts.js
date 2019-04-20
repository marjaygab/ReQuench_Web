$(document).ready(function () {
    const messaging = firebase.messaging();
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
    fetch();


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
                console.log(user_list);
                var filtered_items = user_list.filter(obj => {
                    return obj.First_Name.toLowerCase().includes(this.value.toLowerCase()) || obj.Last_Name.toLowerCase().includes(this.value.toLowerCase()) ||
                    obj.User_Name.toLowerCase().includes(this.value.toLowerCase()) || obj.Email.toLowerCase().includes(this.value.toLowerCase()) ||
                    obj.ID_Number.toLowerCase().includes(this.value.toLowerCase()); 
                });
                clearAccountList();
                displayAccountCards(filtered_items);
                break;
            case 'ADMIN':
                var filtered_items = admin_list.filter(obj => {
                    return obj.First_Name.toLowerCase().includes(this.value.toLowerCase()) || obj.Last_Name.toLowerCase().includes(this.value.toLowerCase()) ||
                    obj.User_Name.toLowerCase().includes(this.value.toLowerCase()) || obj.Email.toLowerCase().includes(this.value.toLowerCase()) || 
                    obj.ID_Number.toLowerCase().includes(this.value.toLowerCase());
                });
                console.log(filtered_items);
                clearAccountList();
                displayAccountCards(filtered_items);
                break;
            case 'CASHIER':
                var filtered_items = cashier_list.filter(obj => {
                    return obj.First_Name.toLowerCase().includes(this.value.toLowerCase()) || obj.Last_Name.toLowerCase().includes(this.value.toLowerCase()) || 
                    obj.User_Name.toLowerCase().includes(this.value.toLowerCase()) || obj.Email.toLowerCase().includes(this.value.toLowerCase()) ||
                    obj.ID_Number.toLowerCase().includes(this.value.toLowerCase());
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
                  USER</button>
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
                <div class="col-sm-6">
                  <button id = "submit" type="submit" class="btn btn-primary btn-block">Submit</button>
                  <p id="incomplete_info_error" class="error">Please fill out all required fields!</p>
                </div>
                <div class="col-sm-6">
                  <button id = "cancel" type="button" class="btn btn-danger btn-block">Cancel</button>
                </div>
              </div>
            </div>`,
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
                const cancel = $('#cancel');
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
                dropdownMenuButtonCat.innerHTML = 'USER';
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
                    requestHttp('POST', "https://requench-rest.herokuapp.com/Check_Dup.php", params, function (e) {
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
                    requestHttp('POST', "https://requench-rest.herokuapp.com/Check_Dup.php", params, function (e) {
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
                    requestHttp('POST', "https://requench-rest.herokuapp.com/Check_Dup.php", params, function (e) {
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
                                        fetch();
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
                cancel.onclick = function() {
                    Swal.close();
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




    function fetch() {
        var params = {};
        params.Access_Level = 'USER';
        user_list = [];
        admin_list = [];
        cashier_list = [];
    requestHttp('POST', "https://requench-rest.herokuapp.com/Fetch_Accounts.php", params, function (e) {
        if (this.readyState == 4 && this.status == 200) {
            
            var response = this.responseText;
            if (response != null) {
                var json_object = JSON.parse(this.response);
                console.log(json_object);
                if (json_object.Success == true) {
                    for (var i = 0; i < json_object.USER.length; i++) {
                        user_list.push(json_object.USER[i]);
                    }
                    console.log(user_list);
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
                                                    if (current_active == 'ADMIN') {
                                                        displayAccountCards(admin_list);
                                                    }else if (current_active == 'CASHIER') {
                                                        displayAccountCards(cashier_list);
                                                    }else{
                                                        displayAccountCards(user_list);
                                                    }
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
                file_path = `https://requench-rest.herokuapp.com${file_path}`;
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

            // var session_var = sessionStorage.getItem('JSON_Response');
            // console.log(session_var);
            
            // var jsonobj = JSON.parse(session_var);
            var params = {};
            params.Acc_ID = list[i].Acc_ID;
            console.log(params.Acc_ID);
            // var profile_picture_div = document.getElementById('profile_picture');
            // var id_num_field = document.getElementById('id_num_field');
            // var user_field = document.getElementById('user_field');
            // var first_field = document.getElementById('first_field');
            // var last_field = document.getElementById('last_field');
            // var email_field = document.getElementById('email_field');
            // var access_level_field = document.getElementById('access_level_field');
            // var pass_field = document.getElementById('pass_field');
            // var balance_field = document.getElementById('balance_field');
            var logo = document.getElementsByClassName('logo');

            // updateSessionVariable(params, function (response) {
            //     console.log(response);
            //     var string_json = JSON.stringify(response);
            //     sessionStorage.setItem('JSON_Response', string_json);

            //     jsonobj = JSON.parse(sessionStorage.getItem('JSON_Response'));
            //     console.log(jsonobj);
            //     // jsonobj = session_var;
            //     var path = "url('.." + jsonobj.file_path + "')";
            //     profile_picture_div.style.backgroundImage = "url('../ReQuench/" + jsonobj.file_path + "')";
            //     id_num_field.value = jsonobj.Account_Details.ID_Number;
            //     user_field.value = jsonobj.Account_Details.User_Name;
            //     first_field.value = jsonobj.Account_Details.First_Name;
            //     last_field.value = jsonobj.Account_Details.Last_Name;
            //     email_field.value = jsonobj.Account_Details.Email;
            //     dropdownMenuButtonCat.value = jsonobj.Account_Details.dropdownMenuButtonCat;
            //     pass_field.value = jsonobj.Account_Details.Password;
            //     balance_field.value = jsonobj.Account_Details.Balance;
            // });

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
            for (let index = 0; index < logo.length; index++) {
                const element = logo[index];
                element.addEventListener("dblclick",function() {
                    Swal({
                        title: "Edit Existing Account",
                        showConfirmButton: false,
                        html: `
                        <div class="container">
                        <input type="text" autofocus style="display:none;">
                        <div class="row form-account">
                            <div class="col-4">
                            <input id = "id_num_field" type="text" class="form-control" placeholder = "ID Number">
                            <p id="duplicate_id_error" class="error">Duplicated ID Detected!</p>
                            </div>
                            <div class="col-4">
                            <input id = "rfid_field" type="text" class="form-control" placeholder = "RFID Number">
                            <p id="duplicate_rfid_error" class="error">Duplicated ID Detected!</p>
                            </div>
                            <div class="dropdown col-4">
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
                            <div class="col-6">
                            <input id="First_Name" type="text" class="form-control" placeholder = "First Name" required>
                            </div>
                            <div class="col-6">
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
                            <div class="col-6">
                                <input id="User_Name" type="text" class="form-control" placeholder = "User Name" required>
                                <p id="username_taken_error" class="error">This username is already taken!</p>
                            </div>
                            <div class="col-6">
                                <input id="Balance" type="number" class="form-control" placeholder = "Balance" required>
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
                            <div class="col-4">
                                <button id = "submit" type="button" class="btn btn-outline-primary btn-block">Submit</button>
                                <p id="incomplete_info_error" class="error">Please fill out all required fields!</p>
                            </div>
                            <div class="col-4">
                                <button id = "remove_account" type="button" class="btn btn-outline-warning btn-block">Remove Account</button>
                            </div>
                            <div class="col-4">
                                <button id = "cancel" type="button" class="btn btn-outline-danger btn-block">Cancel</button>
                            </div>
                        </div>
                        </div>`,
                        onBeforeOpen: function () {
                            var content = Swal.getContent();
                            var $ = content.querySelector.bind(content);
                            var id_num_field = $('#id_num_field');
                            var rfid_field = $('#rfid_field');
                            var first_field = $('#First_Name');
                            var last_field = $('#Last_Name');
                            var user_field = $('#User_Name');
                            var pass_field = $('#Password');
                            var balance_field = $('#Balance');
                            var user_field = $('#User_Name');
                            var pass_field = $('#Password');
                            var retype_password = $('#Retype_Password');
                            var email_field = $('#Email');
                            var access_level_user = $('#access_level_user');
                            var access_level_admin = $('#access_level_admin');
                            var access_level_cashier = $('#access_level_cashier');
                            var dropdownMenuButtonCat = $('#dropdownMenuButtonCat');
                            var submit = $('#submit');
                            var remove_account = $('#remove_account');
                            var cancel = $('#cancel');
                            var duplicate_id_error = $('#duplicate_id_error');
                            var duplicate_rfid_error = $('#duplicate_rfid_error');
                            var duplicate_email_error = $('#duplicate_email_error');
                            var username_taken_error = $('#username_taken_error');
                            var pass_mismatch_error = $('#pass_mismatch_error');
    
                            duplicate_id_error.style.visibility = "hidden";
                            duplicate_rfid_error.style.visibility = "hidden";
                            duplicate_email_error.style.visibility = "hidden";
                            username_taken_error.style.visibility = "hidden";
                            pass_mismatch_error.style.visibility = "hidden";
                            incomplete_info_error.style.visibility = "hidden";
                            var valid_id = true;
                            var valid_rfid = true;
                            var valid_email = true;
                            var valid_first = true;
                            var valid_last = true;
                            var valid_user = true;
                            var valid_password = true;

                            //get user data here
                            var params = {};
                            params.Acc_ID = list[index].Acc_ID;
                            console.log(params);
                            var data_response = {};
                            requestHttps("https://requench-rest.herokuapp.com/Fetch_Profile.php",params,function(data) {
                                console.log(data);
                                data_response = data;
                                id_num_field.value = data.Account_Details.ID_Number;
                                rfid_field.value = data.Account_Details.RFID_ID;
                                first_field.value = data.Account_Details.First_Name;
                                last_field.value = data.Account_Details.Last_Name;
                                user_field.value = data.Account_Details.User_Name;
                                pass_field.value = data.Account_Details.Password;
                                retype_password.value = data.Account_Details.Password;
                                email_field.value = data.Account_Details.Email;
                                balance_field.value = data.Account_Details.Balance;
                                dropdownMenuButtonCat.innerHTML = data.Account_Details.Access_Level;

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
                
                                id_num_field.onblur = function () {
                                    if (data_response.Account_Details.ID_Number != id_num_field.value) {
                                        var params = {};
                                    params.Command = "ID_NUM";
                                    params.Variable = this.value;
                                    requestHttp('POST', "https://requench-rest.herokuapp.com/Check_Dup.php", params, function (e) {
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
                                }
    
                                rfid_field.onblur = function () {
                                    if (data_response.Account_Details.RFID_ID != rfid_field.value) {   
                                    var params = {};
                                    params.Command = "RFID";
                                    params.Variable = this.value;
                                    requestHttp('POST', "https://requench-rest.herokuapp.com/Check_Dup.php", params, function (e) {
                                        if (this.readyState == 4 && this.status == 200) {
                                            var response = this.responseText;
                                            if (response != null) {
                                                console.log(response);
                                                var json_object = JSON.parse(response);
                                                console.log(json_object.Success);
                                                valid_rfid = true;
                                                if (!json_object.Success) {
                                                    duplicate_rfid_error.style.visibility = "visible";
                                                    valid_rfid = false;
                                                }
                                            }
                                        }
                                    });    
                                    }
                                }
    
                                id_num_field.onfocus = function () {
                                    duplicate_id_error.style.visibility = "hidden";
                                }
    
                                rfid_field.onfocus = function () {
                                    duplicate_rfid_error.style.visibility = "hidden";
                                }
                
                                email_field.onblur = function () {
                                    if (data_response.Account_Details.Email != email_field.value) {
                                        var params = {};
                                    params.Command = "EMAIL";
                                    params.Variable = this.value;
                                    requestHttp('POST', "https://requench-rest.herokuapp.com/Check_Dup.php", params, function (e) {
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
                                }
                
                                email_field.onfocus = function () {
                
                                    duplicate_email_error.style.visibility = "hidden";
                                }
                
                                user_field.onblur = function () {
                                    if(data_response.Account_Details.User_Name !=  user_field.value){
                                        var params = {};
                                    params.Command = "USER_NAME";
                                    params.Variable = this.value;
                                    requestHttp('POST', "https://requench-rest.herokuapp.com/Check_Dup.php", params, function (e) {
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
                                }
                
                                user_field.onfocus = function () {
                                    username_taken_error.style.visibility = "hidden";
                                }
                                pass_mismatch_error.onfocus = function () {
                                    pass_mismatch_error.style.visibility = "hidden";
                                }
                
                                submit.onclick = function () {
                                    var params = {};
                                    params.Acc_ID = data_response.Account_Details.Acc_ID;
                                    params.ID_Number = id_num_field.value;
                                    params.First_Name = first_field.value;
                                    params.Last_Name = last_field.value;
                                    params.User_Name = user_field.value;
                                    params.Password = pass_field.value;
                                    params.retype_password = retype_password.value;
                                    params.Email = email_field.value;
                                    params.Access_Level = dropdownMenuButtonCat.innerHTML;
                                    params.Balance = balance_field.value;
                                    params.RFID_ID = rfid_field.value;
                                    // var regex = new RegExp('[a-zA-Z]');
                                    // params.Access_Level = regex.matchAll(dropdownMenuButtonCat.innerHTML);
                                    console.log(params);
                
                                    if (params.Password != params.retype_password) {
                                        document.getElementById('Retype_Password').value = '';
                                        pass_mismatch_error.style.visibility = "visible";
                                        //handle error here
                                    }
                                    else if (id_num_field.value == '' || first_field.value == '' || last_field.value == '' || user_field.value == '' || pass_field.value == '') {
                                        incomplete_info_error.style.visibility = "visible";
                                        //handle error here
                                    }
                                    else if (valid_id && valid_email && valid_user && valid_rfid) {
                                        //Set params.command to update. Set to 'all' to update all at once. 
                                        params.Command = 'all';
                                        requestHttps("https://requench-rest.herokuapp.com/Update_Account.php",params,function(response) {
                                             //result_json is of type JSON. No need to parse.
                                            //do something here after updating

                                            console.log(response);
                                            if(response.Update_Success){
                                                fetch();
                                                Swal.close();
                                            }
                                        });
                                    }
                                }
    
                                remove_account.onclick = function() {
                                    Swal.fire({
                                        title: 'Are you sure?',
                                        text: "You won't be able to revert this!",
                                        type: 'warning',
                                        showCancelButton: true,
                                        confirmButtonColor: '#3085d6',
                                        cancelButtonColor: '#d33',
                                        confirmButtonText: 'Yes, delete it!',
                                        allowOutsideClick: false,
                                      }).then((result) => {
                                        if (result.value) {
                                            var params = {};
                                            params.Acc_ID = list[index].Acc_ID;
                                            params.Account_Type = current_active;
                                            requestHttps('https://requench-rest.herokuapp.com/Remove_Account.php',params,function(response) {
                                                if (response.Success) {
                                                    Swal.fire(
                                                        'Deleted!',
                                                        'Account has been deleted',
                                                        'success'
                                                    );
                                                    fetch();    
                                                }
                                            });
                                        }
                                      });
                                }
                            });
                            

                            cancel.onclick = function() {
                                Swal.close();
                            }

                        }
                    });    
                });
            }
        }
    }


});
