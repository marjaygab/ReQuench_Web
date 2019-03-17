$(document).ready(function () {
    var logout_button = document.getElementById('logout_button');
    var params = {};
    var response = JSON.parse(sessionStorage.getItem('JSON_Response'));
    params.Acc_ID = response.Account_Details.Acc_ID;
    var grid_view_button = document.getElementById('grid_view_button');
    var list_view_button = document.getElementById('list_view_button');
    var category_items = document.getElementsByClassName('category-item');
    var order_items = document.getElementsByClassName('order-item');
    var machine_list = [];
    var add_button = document.getElementById('add_button');
    var monitoring_panel = document.getElementById('monitoring_panel');
    var current_category = 'Machine_ID';
    var current_order = 'Descending';
    $('.dropdown-menu').click(function (e) {
        e.stopPropagation();
    });

    for (let index = 0; index < category_items.length; index++) {
        const element = category_items[index];
        element.onclick = function () {
            for (let index = 0; index < category_items.length; index++) {
                const element = category_items[index];
                element.classList.remove('active');
            }
            this.classList.add('active');
            document.getElementById('dropdownMenuButtonCat').innerHTML = this.innerHTML;
            current_category = this.innerHTML;
            //sort by this.innerHTML category current list and current list unrecorded
            filter(machine_list, current_category, current_order, function (list_returned) {
                console.log(list_returned);
            });
            clearDisplay();
            displayMachinesGrid(machine_list);
        }
    }

    for (let index = 0; index < order_items.length; index++) {
        const element = order_items[index];
        element.onclick = function () {
            for (let index = 0; index < order_items.length; index++) {
                const element = order_items[index];
                element.classList.remove('active');
            }
            this.classList.add('active');
            document.getElementById('dropdownMenuButtonOrd').innerHTML = this.innerHTML;
            current_order = this.innerHTML;

            filter(machine_list, current_category, current_order, function (list_returned) {
                console.log(list_returned);
            });

            clearDisplay();
            displayMachinesGrid(machine_list);
        }
    }

    var params = {};
    requestHttps('https://requench-rest.herokuapp.com/Fetch_All_Machines.php', params, function (response) {
        if (response.Success) {
            machine_list = response.Machines;
            console.log(machine_list);
            displayMachinesGrid(machine_list);
        } else {
            console.log(response);
        }
    });



    add_button.onclick = function () {
        Swal({
            title: "Add New Machine",
            showConfirmButton: false,
            allowOutsideClick: false,
            html: `
            <div class="container">
                <div class="row form-account machine_form">
                    <div class="col-sm-6">
                        <input id="Model_Number" type="text" class="form-control input_form" placeholder = "Model Number" required>
                    </div>
                    <div class="col-sm-6">
                        <input id="Machine_Location" type="text" class="form-control input_form" placeholder = "Machine Location" required>
                    </div>
                </div>
                <div class="row form-account machine_form">
                    <div class="col-sm-12">
                        <input id="date_of_purchase" type="date" class="form-control input_form" placeholder = "Date Of Purchase" required>
                    </div>
                </div>
                <div class="row form-account machine_form">
                    <div class="col-sm-8">
                        <div class="input-group mb-3">
                            <input id="secret_field" type="text" class="form-control input_form" placeholder="Secret Key" aria-label="Hidden" aria-describedby="basic-addon2" readonly>
                            <div class="input-group-append">
                                <button id="copy_button" class="btn btn-outline-info" type="button"><span class="far fa-clipboard"></span></button>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-4">
                        <button class="btn btn-outline-info" type="button" id="generate_secret">Generate</button>
                    </div>
                </div>
                <div class="row form-account machine_form">
                    <div class="col-2"></div>
                    <div class="col-4">
                        <button class="btn btn-outline-info btn-block" type="button" id="submit_button">Submit</button>
                    </div>
                    <div class="col-4">
                        <button class="btn btn-outline-danger btn-block" type="button" id="cancel_button">Cancel</button>
                    </div>
                    <div class="col-2"></div>
                </div>
            </div>`,
            onBeforeOpen: function () {
                const content = Swal.getContent();
                const $ = content.querySelector.bind(content);
                const model_num = $('#Model_Number');
                const machine_loc = $('#Machine_Location');
                const date_of_purchase = $('#date_of_purchase');
                const secret_field = $('#secret_field');
                const copy_clipboard = $('#copy_button');
                const submit_button = $('#submit_button');
                const cancel_button = $('#cancel_button');
                const generate_secret = $('#generate_secret');
                // const input_form = $('.input_form');
                const input_form = content.getElementsByClassName('input_form');
                copy_clipboard.onclick = function () {
                    if (secret_field.value != '' || secret_field.value != null) {
                        secret_field.select();
                        document.execCommand("copy");
                        console.log(secret_field.value);
                    }
                }

                console.log(input_form);

                for (let index = 0; index < input_form.length; index++) {
                    const element = input_form[index];
                    element.onblur = function () {
                        console.log(element.value);
                        if (element.value.length <= 0) {
                            element.classList.add('is-invalid');
                        } else {
                            element.classList.remove('is-invalid');
                        }
                    }
                }


                generate_secret.onclick = function () {
                    var params = {};
                    params.Command = 'Secret';
                    requestHttps('https://requench-rest.herokuapp.com/Generate_API_Key.php', params, function (response) {
                        if (response.Success) {
                            secret_field.value = response.Secret;
                        }
                    });
                }

                submit_button.onclick = function () {
                    var all_valid_count = 0;
                    for (let index = 0; index < input_form.length; index++) {
                        const element = input_form[index];
                        if (element.value.length <= 0) {
                            element.classList.add('is-invalid');
                        } else {
                            element.classList.remove('is-invalid');
                            all_valid_count++;
                        }
                    }

                    if (all_valid_count == input_form.length) {
                        //ready for submitting
                        var params = {};
                        params.Model_Number = model_num.value;
                        params.Machine_Location = machine_loc.value;
                        params.Date_of_Purchase = date_of_purchase.value;
                        params.Secret = secret_field.value;

                        requestHttps('https://requench-rest.herokuapp.com/Add_Machine.php', params, function (response) {
                            if (response.Success) {
                                window.location.reload();
                            }
                        });
                        //refresh page
                    } else {

                    }

                }

                cancel_button.onclick = function () {
                    Swal.close();
                }
            },
            onClose: function () {

            }
        });
    }


    var selected_view = {
        grid: true,
        list: false,
        toggle: function () {
            if (this.grid) {
                this.grid = false;
                this.list = true;
                $('#grid_view_button').removeClass('isDisabled');
                $('#list_view_button').removeClass('isDisabled');
                $('#grid_view_button').addClass('isDisabled');
            } else {
                this.grid = true;
                this.list = false;
                $('#grid_view_button').removeClass('isDisabled');
                $('#list_view_button').removeClass('isDisabled');
                $('#list_view_button').addClass('isDisabled');
            }
        },
        toggle: function (view) {
            if (view == 'grid') {
                this.grid = true;
                this.list = false;
                $('#grid_view_button').removeClass('isDisabled');
                $('#list_view_button').removeClass('isDisabled');
                $('#list_view_button').addClass('isDisabled');
            } else if (view == 'list') {
                this.grid = false;
                this.list = true;
                $('#grid_view_button').removeClass('isDisabled');
                $('#list_view_button').removeClass('isDisabled');
                $('#grid_view_button').addClass('isDisabled');
            } else {
                //nothing will happen
            }
        }
    };




    grid_view_button.onclick = function () {
        console.log('Test');
        selected_view.toggle('grid');
    }


    list_view_button.onclick = function () {
        console.log('Test');
        selected_view.toggle('list');
    }

    // console.log(seen_toggler.item(2));

    //Get Generated User Token then update the Back End DB fpr changes.
    logout_button.onclick = function () {
        // firebase.auth().signOut().then(function() {
        //   var params = {};
        //   var response = JSON.parse(sessionStorage.getItem('JSON_Response'));
        //   params.Acc_ID = response.Account_Details.Acc_ID;
        //   //clear registration token for later renewal
        //   requestHttp('POST',"https://requench-rest.herokuapp.com/Clear_Token.php",params,function(e){});
        //   window.location.href = "index.html";
        // }, function(error) {
        //   Swal({
        //     type: 'error',
        //     title: 'Something went Wrong!',
        //     text: 'Please contact your administrator for assistance. Thank you!'
        //   });
        // });
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

    function displayMachinesGrid(machine_list) {
        clearDisplay();
        filter(machine_list, current_category, current_order, function (returned_list) { });
        for (let index = 0; index < machine_list.length; index++) {
            const element = machine_list[index];
            var status_indicator = 'text-danger';
            if (status == 'ONLINE') {
                status_indicator = 'text-success';
            }
            if (element.API_KEY != null) {
                var current_water_level = element.Current_Water_Level;
                var percentage = getPercentage(current_water_level, 20000);
                var status = element.STATUS;
                
                var default_bg = "bg-info";
                if (percentage <= 20) {
                    default_bg = "bg-danger";
                }
                var html_string = `<div class="col-sm-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Machine ${element.MU_ID}<span class="fas ${status_indicator} fa-circle"></span></h5>
                            <p class="card-text">Last Maintenance Date: <span>${element.Last_Maintenance_Date}</span></p>
                            <p class="card-text">Location: <span>${element.Machine_Location}</span></p>
                            <p class="card-text">API Key: <span>${element.API_KEY}</span></p>
                            <h5 class="water_level_header">Water Level</h5>
                            <div class="progress">
                                <div class="progress-bar ${default_bg}" role="progressbar" style="width: ${percentage}%;" aria-valuenow="25"
                                    aria-valuemin="0" aria-valuemax="100">${percentage}%</div>
                            </div>
                        </div>
                    </div>
                </div>`;
            } else {
                var html_string = `<div class="col-sm-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Machine ${element.MU_ID}<span class="far ${status_indicator} fa-circle"></span></h5>
                            <p class="card-text">Location: <span>${element.Machine_Location}</span></p>
                            <p class="card-text">API Key: <span> Not Yet Configured. </span></p>
                        </div>
                    </div>
                </div>`;
            }

            var $container = $('.monitoring_panel');
            var html = $.parseHTML(html_string);
            $container.append(html);
        }
    }

    function clearDisplay() {
        var monitoring_panel = document.getElementById('monitoring_panel');
        monitoring_panel.innerHTML = '';
    }

    function getPercentage(value, overall) {
        var percentage_value = (value / overall) * 100
        return percentage_value;
    }


    function filter(list, cat, order, fn) {
        if (list != '') {
            switch (order) {
                case 'Ascending':
                    switch (cat) {
                        case 'Machine_ID':
                            list.sort(compByIDAsc);
                            break;
                        case 'Maintenance Date':
                            list.sort(compByDateMAsc);
                            break;
                        case 'Location':
                            list.sort(compByLocationAsc);
                            break;
                        case 'Water Level':
                            list.sort(compByWaterLevelAsc);
                            break;
                        default:
                            break;
                    }
                    break;

                case 'Descending':
                    switch (cat) {
                        case 'Machine_ID':
                            list.sort(compByIDDesc);
                            break;
                        case 'Maintenance Date':
                            list.sort(compByDateMDesc);
                            break;
                        case 'Location':
                            list.sort(compByLocationDesc);
                            break;
                        case 'Water Level':
                            list.sort(compByWaterLevelDesc);
                            break;
                        default:
                            break;
                    }
                    break;

                default:
                    break;
            }
            fn(list);
        }
    }

    function compByDatePAsc(a, b) {
        if (Date.parse(a.Date_of_Purchase) < Date.parse(b.Date_of_Purchase)) {
            return -1;
        } else {
            return 0;
        }
    }
    function compByDatePDesc(a, b) {
        if (Date.parse(a.Date_of_Purchase) > Date.parse(b.Date_of_Purchase)) {
            return -1;
        } else {
            return 0;
        }
    }

    function compByDateMAsc(a, b) {
        if (Date.parse(a.Last_Maintenance_Date) < Date.parse(b.Last_Maintenance_Date)) {
            return -1;
        } else {
            return 0;
        }
    }
    function compByDateMDesc(a, b) {
        if (Date.parse(a.Last_Maintenance_Date) > Date.parse(b.Last_Maintenance_Date)) {
            return -1;
        } else {
            return 0;
        }
    }

    function compByLocationAsc(a, b) {
        if (parseFloat(a.Machine_Location) < parseFloat(b.Machine_Location)) {
            return -1;
        } else {
            return 0;
        }
    }

    function compByLocationDesc(a, b) {
        if (parseFloat(a.Machine_Location) > parseFloat(b.Machine_Location)) {
            return -1;
        } else {
            return 0;
        }
    }

    function compByModelNumberAsc(a, b) {
        if (parseFloat(a.Model_Number) < parseFloat(b.Model_Number)) {
            return -1;
        } else {
            return 0;
        }
    }

    function compByModelNumberDesc(a, b) {
        if (parseFloat(a.Model_Number) > parseFloat(b.Model_Number)) {
            return -1;
        } else {
            return 0;
        }
    }
    function compByIDAsc(a, b) {
        if (parseFloat(a.MU_ID) < parseFloat(b.MU_ID)) {
            return -1;
        } else {
            return 0;
        }
    }

    function compByIDDesc(a, b) {
        if (parseFloat(a.MU_ID) > parseFloat(b.MU_ID)) {
            return -1;
        } else {
            return 0;
        }
    }

    function compByWaterLevelAsc(a, b) {
        if (getPercentage(a.Current_Water_Level, 20000) < getPercentage(b.Current_Water_Level, 20000)) {
            return -1;
        } else {
            return 0;
        }
    }

    function compByWaterLevelDesc(a, b) {
        if (getPercentage(a.Current_Water_Level, 20000) > getPercentage(b.Current_Water_Level, 20000)) {
            return -1;
        } else {
            return 0;
        }
    }

});
