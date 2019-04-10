$(document).ready(function () {
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
    var firestore = firebase.firestore();
    const collectionRef = firestore.collection('Machines');

    var getRealTimeUpdates = function () {
        collectionRef.onSnapshot(function (collection) {
            collection.docs.forEach(element => {
                if (element.exists) {
                    const machine_firestore_data = element.data();
                    console.log('Something changed');
                    machine_list.forEach(machine => {
                        if (machine_firestore_data.mu_id == machine.MU_ID) {
                            machine.API_KEY = machine_firestore_data.api_key;
                            machine.Current_Water_Level = machine_firestore_data.current_water_level;
                            machine.Last_Maintenance_Date = machine_firestore_data.last_maintenance_date;
                            machine.Date_of_Purchase = machine_firestore_data.date_of_purchase;
                            machine.Machine_Location = machine_firestore_data.location;
                            machine.Model_Number = machine_firestore_data.Model_Number;
                            machine.STATUS = machine_firestore_data.status;

                        }
                    });
                    clearDisplay();
                    displayMachinesGrid(machine_list);
                    //update data here
                    console.log(machine_firestore_data);
                }
            });
        });
    }


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

            console.log(machine_list);
            displayMachinesGrid(machine_list);
            getRealTimeUpdates();
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
        console.log(machine_list);
        filter(machine_list, current_category, current_order, function (returned_list) { });
        for (let index = 0; index < machine_list.length; index++) {
            const element = machine_list[index];

            if (element.API_KEY != null) {
                var current_water_level = element.Current_Water_Level;
                var percentage = Math.round(getPercentage(current_water_level, 22500));
                var status = element.STATUS;
                var critical_level = element.Critical_Level;
                if (element.Critical_Level == null) {
                    critical_level = 0;
                }
                var status_indicator = 'text-danger';
                if (status == 'ONLINE' || status == 'online') {
                    status_indicator = 'text-success';
                }
                var default_bg = "bg-info";
                if (percentage <= critical_level) {
                    default_bg = "bg-danger";
                }
                var html_string = `<div class="col-sm-4">
                    <div class="card">
                        <div class="card-body machine_card">
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
                        <div class="card-body machine_card">
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
            var machine_cards = document.getElementsByClassName("machine_card");

        }

        for (let index = 0; index < machine_cards.length; index++) {
            const element = machine_cards[index];
            element.addEventListener('dblclick', function () {
                var MU_ID = machine_list[index].MU_ID;
                Swal({
                    title: "Machine Details",
                    showConfirmButton: false,
                    width: 600,
                    allowOutsideClick: false,
                    html: `
                    <div class="container">
                        <div class="row machine_form">
                            <p class="col-4">Machine ID#: <span id="MU_ID">1</span></p>
                            <p class="col-4">Status: <span id="STATUS">OFFLINE</span> </p>
                            <div class='col-4'>
                                <div class="dropdown">
                                    <button class="btn btn-secondary btn-block dropdown-toggle bg-info" type="button" id="notifysilent" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        Notify
                                    </button>
                                    <div class="dropdown-menu" aria-labelledby="notifysilent">
                                        <a id="dropdown_notify" class="dropdown-item" href="#">Notify</a>
                                        <a id="dropdown_silent" class="dropdown-item" href="#">Silent</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row machine_form">
                            <div class="col-6 form-group">
                                <label for="Model_Number" style="text-align:left;">Model Number</label>
                                <input type="text" class="form-control" id="Model_Number">
                            </div>
                            <div class="col-6 form-group">
                                <label for="Machine_Location" style="text-align:left;">Machine Location</label>
                                <input type="text" class="form-control" id="Machine_Location"s>
                            </div>
                        </div>
                        <div class="row machine_form">
                            <div class="col-6 form-group">
                                <label for="Date_of_Purchase">Date of Purchase</label>
                                <input type="date" class="form-control" id="Date_of_Purchase">
                            </div>
                            <div class="col-6 form-group">
                                <label for="Last_Maintenance_Date">Last Maintenance Date</label>
                                <input type="date" class="form-control" id="Last_Maintenance_Date">
                            </div>
                        </div>
                        <div class="row machine_form">
                            <div class="col-12">
                                <div class="input-group mb-3">
                                    <label for="API_KEY">API Key</label>
                                    <input id="API_KEY" type="text" class="form-control input_form" placeholder="API Key" aria-label="Hidden" aria-describedby="basic-addon2" readonly>
                                    <div class="input-group-append">
                                        <button id="renew_key" class="btn btn-outline-info" type="button">Renew Key</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="row machine_form">
                            <div class="col-6 form-group">
                                <label for="critical_level">Critical Level</label>
                                <input id="critical_level" type="number" class="form-control input_form" placeholder="Critical Level">
                            </div>
                            <div class="col-6 form-group">
                                <label for="price_per_ml">Price per mL</label>
                                <input id="price_per_ml" type="number" class="form-control input_form" placeholder="Price per mL">
                            </div>
                        </div>

                        <div class="row machine_form">
                            <div class="col-12">
                                <h5 class="water_level_header">Water Level</h5>
                                <div class="progress">
                                    <div id="machine_water_level" class="progress-bar bg-info" role="progressbar" style="width: 100%;" aria-valuenow="50"
                                        aria-valuemin="0" aria-valuemax="100">100%</div>
                                </div>
                            </div>
                        </div>

                        <div class="row controls_row machine_form">
                            <div class="col-3">
                                <button id = "shutdown" type="button" class="btn btn-outline-danger btn-block">Shutdown</button>
                            </div>
                            <div class="col-3">
                                <button id = "reboot" type="button" class="btn btn-outline-warning btn-block">Reboot</button>
                            </div>
                            <div class="col-3">
                                <button id = "save_changes" type="button" class="btn btn-outline-info btn-block">Save</button>
                            </div>
                            <div class="col-3">
                                <button id = "cancel" type="button" class="btn btn-outline-danger btn-block">Cancel</button>
                            </div>
                        </div>

                        <div class="row controls_row machine_form">
                            <div class="col-12">
                                <button id = "remove_device" type="button" class="btn btn-outline-danger btn-block">Remove Device</button>
                            </div>
                        </div>
                    </div>`,
                    onBeforeOpen: function () {
                        var content = Swal.getContent();
                        var $ = content.querySelector.bind(content);
                        var MU_ID = $('#MU_ID');
                        var Model_Number = $('#Model_Number');
                        var Machine_Location = $('#Machine_Location');
                        var Date_of_Purchase = $('#Date_of_Purchase');
                        var Last_Maintenance_Date = $('#Last_Maintenance_Date');
                        var machine_water_level = $('#machine_water_level');
                        var Critical_Level = $('#critical_level');
                        var Price_per_mL = $('#price_per_ml');
                        var STATUS = $('#STATUS');
                        var API_KEY = $('#API_KEY');
                        var shutdown = $('#shutdown');
                        var reboot = $('#reboot');
                        var save_changes = $('#save_changes');
                        var renew_key = $('#renew_key');
                        var notifysilent = $('#notifysilent');
                        var dropdown_notify = $('#dropdown_notify');
                        var dropdown_silent = $('#dropdown_silent');
                        var remove_device = $('#remove_device');
                        var cancel = $('#cancel');



                        MU_ID.innerHTML = machine_list[index].MU_ID;
                        Model_Number.value = machine_list[index].Model_Number;
                        Machine_Location.value = machine_list[index].Machine_Location;
                        Date_of_Purchase.value = machine_list[index].Date_of_Purchase;
                        Last_Maintenance_Date.value = machine_list[index].Last_Maintenance_Date;
                        var current_water_level = machine_list[index].Current_Water_Level;
                        var percentage = Math.round(getPercentage(current_water_level, 22500));
                        console.log(percentage);
                        machine_water_level.style.width = percentage + "%";
                        machine_water_level.innerHTML = percentage + "%";
                        var notify_boolean = machine_list[index].Notify_Admin;
                        console.log(notify_boolean);
                        if (notify_boolean == 1) {
                            console.log('Notify');
                            notifysilent.innerHTML = 'Notify';
                        } else {
                            console.log('Silent');
                            notifysilent.innerHTML = 'Silent';
                        }




                        dropdown_notify.onclick = function () {
                            notifysilent.innerHTML = 'Notify';
                            notify_boolean = true;
                        }

                        dropdown_silent.onclick = function () {
                            notifysilent.innerHTML = 'Silent';
                            notify_boolean = false;
                        }




                        if (machine_list[index].API_KEY != null) {
                            STATUS.innerHTML = machine_list[index].STATUS.toUpperCase();
                            API_KEY.value = machine_list[index].API_KEY;
                            Critical_Level.value = machine_list[index].Critical_Level;
                            Price_per_mL.value = machine_list[index].Price_Per_ML;
                        } else {
                            machine_water_level.innerHTML = '0%';
                            Critical_Level.value = '0';
                            Price_per_mL.value = '0';
                            STATUS.innerHTML = "N/A";
                            API_KEY.value = 'Not Yet Configured';
                            renew_key.innerHTML = "Generate Secret";
                        }

                        if (STATUS.innerHTML == 'OFFLINE' || STATUS.innerHTML == 'REBOOTING' || STATUS.innerHTML == 'offline' || STATUS.innerHTML == 'rebooting') {
                            shutdown.disabled = true;
                            reboot.disabled = true;
                        }else{
                            shutdown.disabled = false;
                            reboot.disabled = false;
                        }



                        renew_key.onclick = function () {
                            if (this.innerHTML == 'Generate Secret') {
                                // generate secret
                                Swal({
                                    title: "Generate Secret",
                                    showConfirmButton: false,
                                    allowOutsideClick: false,
                                    html: `
                                    <div class="container">
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
                                                <button class="btn btn-outline-info btn-block" type="button" id="submit_button">Done</button>
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
                                        generate_secret.onclick = function () {
                                            var params = {};
                                            params.Command = 'Secret';
                                            requestHttps('https://requench-rest.herokuapp.com/Generate_API_Key.php', params, function (response) {
                                                if (response.Success) {
                                                    secret_field.value = response.Secret;
                                                    var params = {};
                                                    params.MU_ID = MU_ID.innerHTML;
                                                    
                                                    requestHttps('https://requench-rest.herokuapp.com/Generate_Secret.php', params, function (response) {
                                                        console.log(response);
                                                        if (response.Success) {
                                                            secret_field.value = response.Secret;
                                                            var params = {};
                                                            params.MU_ID = MU_ID.innerHTML;
                                                            
                                                        }
                                                    });

                                                }
                                            });
                                        }

                                        submit_button.onclick = function () {
                                            Swal.close();
                                        }
                                        cancel_button.onclick = function () {
                                            Swal.close();
                                        }
                                    },
                                    onClose: function () {

                                    }
                                });
                            } else {
                                //renew key
                            }
                        }


                        save_changes.onclick = function () {
                            var params = {};
                            params.mu_id = MU_ID.innerHTML;
                            params.Model_Number = Model_Number.value;
                            params.date_of_purchase = Date_of_Purchase.value;
                            params.last_maintenance_date = Last_Maintenance_Date.value;
                            params.current_water_level = current_water_level;
                            params.status = STATUS.innerHTML;
                            params.price_per_ml = price_per_ml.value;
                            params.critical_level = Critical_Level.value;
                            params.notify_admin = notify_boolean;
                            params.api_key = API_KEY.value;
                            params.location = Machine_Location.value;

                            console.log(params);

                            if (STATUS.innerHTML == 'OFFLINE') {
                                //just update here
                                requestHttps("https://requench-rest.herokuapp.com/Update_Machine_State.php", params, function (response) {
                                    if (response.Success) {
                                        var docReferece = collectionRef.doc(MU_ID.innerHTML);
                                        return docReferece.update(params)
                                            .then(() => {
                                                Swal.fire(
                                                    'Updated!',
                                                    'Machine has been updated',
                                                    'success'
                                                ).then(() => {
                                                    requestHttps('https://requench-rest.herokuapp.com/Fetch_All_Machines.php', params, function (response) {
                                                        if (response.Success) {
                                                            machine_list = response.Machines;
                                                            console.log('Im here');
                                                            console.log(machine_list);
                                                            displayMachinesGrid(machine_list);
                                                        } else {
                                                            console.log(response);
                                                        }
                                                    });
                                                });
                                            })
                                            .catch(() => {
                                                Swal.fire(
                                                    'Firebase error occured!',
                                                    'Please try again later',
                                                    'error'
                                                );
                                            });

                                    } else {
                                        Swal.fire(
                                            'An error occured!',
                                            'Please try again later',
                                            'error'
                                        );
                                    }
                                });
                            } else {
                                //need to reboot after updating
                                Swal.fire(
                                    'Machine is online!',
                                    'Please shutdown machine before saving.',
                                    'error'
                                );
                            }
                        }


                        remove_device.onclick = function () {
                            console.log('Clicked Remove button');
                            
                            if (API_KEY.value === 'Not Yet Configured') {
                                //remove from db only
                                Swal.fire({
                                    title: 'Are you sure?',
                                    text: "You won't be able to revert this!",
                                    type: 'warning',
                                    showCancelButton: true,
                                    confirmButtonColor: '#3085d6',
                                    cancelButtonColor: '#d33',
                                    confirmButtonText: 'Yes, delete it!'
                                  }).then((result) => {
                                    if (result.value) {
                                        var params = {};
                                        params.MU_ID = MU_ID.innerHTML;
                                        requestHttps("https://requench-rest.herokuapp.com/Remove_Machine.php",params,function(response) {
                                            if (response.Success) {
                                                Swal.fire(
                                                    'Deleted!',
                                                    'Your device has been deleted.',
                                                    'success'
                                                  ).then(()=>{
                                                    requestHttps('https://requench-rest.herokuapp.com/Fetch_All_Machines.php', params, function (response) {
                                                        if (response.Success) {
                                                            machine_list = response.Machines;
                                                            console.log('Im here');
                                                            console.log(machine_list);
                                                            displayMachinesGrid(machine_list);
                                                        } else {
                                                            console.log(response);
                                                        }
                                                    });
                                                  });          
                                            }
                                        })
                                    }
                                  });

                            } else {
                                //remove from db, then remove from db. make sure machine is offline remove from firebase

                            }
                        }

                        shutdown.onclick = function() {
                            if (STATUS.innerHTML == 'ONLINE') {
                                var params = {};
                                params.mu_id = MU_ID.innerHTML;
                                params.Model_Number = Model_Number.value;
                                params.date_of_purchase = Date_of_Purchase.value;
                                params.last_maintenance_date = Last_Maintenance_Date.value;
                                params.current_water_level = current_water_level;
                                params.status = 'OFFLINE';
                                params.price_per_ml = price_per_ml.value;
                                params.critical_level = Critical_Level.value;
                                params.notify_admin = notify_boolean;
                                params.api_key = API_KEY.value;
                                params.location = Machine_Location.value;
                                console.log(params);
                                requestHttps("https://requench-rest.herokuapp.com/Update_Machine_State.php", params, function (response) {
                                    if (response.Success) {
                                        var docReferece = collectionRef.doc(MU_ID.innerHTML);
                                        return docReferece.update(params)
                                            .then(() => {
                                                Swal.fire(
                                                    'Machine Shutdown!',
                                                    'Machine has been shutted down',
                                                    'success'
                                                ).then(() => {
                                                    requestHttps('https://requench-rest.herokuapp.com/Fetch_All_Machines.php', params, function (response) {
                                                        if (response.Success) {
                                                            machine_list = response.Machines;
                                                            console.log('Im here');
                                                            console.log(machine_list);
                                                            displayMachinesGrid(machine_list);
                                                        } else {
                                                            console.log(response);
                                                        }
                                                    });
                                                });
                                            })
                                            .catch(() => {
                                                Swal.fire(
                                                    'Firebase error occured!',
                                                    'Please try again later',
                                                    'error'
                                                );
                                            });

                                    } else {
                                        Swal.fire(
                                            'An error occured!',
                                            'Please try again later',
                                            'error'
                                        );
                                    }
                                });
                            }else{

                            }
                        }



                        cancel.onclick = function () {
                            Swal.close();
                        }


                    }
                });
            });
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
        if (getPercentage(a.Current_Water_Level, 22500) < getPercentage(b.Current_Water_Level, 22500)) {
            return -1;
        } else {
            return 0;
        }
    }

    function compByWaterLevelDesc(a, b) {
        if (getPercentage(a.Current_Water_Level, 22500) > getPercentage(b.Current_Water_Level, 22500)) {
            return -1;
        } else {
            return 0;
        }
    }

});
