$(document).ready(function () {
    $('.grid').masonry({
        // options
        itemSelector: '.grid-item',
        columnWidth: 500
    });

    var json_response_string = sessionStorage.getItem('JSON_Response');
    var table_toggle = document.getElementById('table_toggle');
    var date_label = document.getElementById('date_label');
    var time_label = document.getElementById('time_label');

    var recent_notification_list = [];
    var machine_list = [];
    var recent_transactions_list = [];
    var recent_purchase_list = [];



    setInterval(()=>{
        var date_today = moment().format("YYYY-MM-DD");
        var time_today = moment().format("h:mm:ss a");
        date_label.innerHTML = date_today
        time_label.innerHTML = time_today;
    },1000);






    var firestore = firebase.firestore();
    const collectionRef = firestore.collection('Machines');

    var getRealTimeUpdates = function () {
        collectionRef.onSnapshot(function (collection) {
            collection.docs.forEach(element => {
                if (element.exists) {
                    const machine_firestore_data = element.data();

                    machine_list.forEach(machine => {
                        if (machine_firestore_data.mu_id == machine.MU_ID) {
                            machine.API_KEY = machine_firestore_data.api_key;
                            machine.Current_Water_Level = machine_firestore_data.current_water_level;
                            machine.Last_Maintenance_Date = machine_firestore_data.last_maintenance_date;
                            machine.Date_of_Purchase = machine_firestore_data.date_of_purchase;
                            machine.Critical_Level = machine_firestore_data.critical_level;
                            machine.Machine_Location = machine_firestore_data.location;
                            machine.Model_Number = machine_firestore_data.Model_Number;
                            machine.STATUS = machine_firestore_data.status;
                            clearMachineList();
                            displayMachines();
                        }
                    });
                    //update data here
                }
            });
        });
    }



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


    $('#table_toggle').change(function () {
        var table_header_label = document.getElementById('table_header_label');
        if ($(this).prop('checked') == false) {
            //transactions
            console.log('Transactions');
            clearSalesTable();
            displayTransactions();
            table_header_label.innerHTML = 'Recent Transactions';
        } else {
            //purchases
            console.log('Purchase');
            clearSalesTable();
            displayPurchases();
            table_header_label.innerHTML = 'Recent Purchases';
        }
    });



    var params = {};
    params.Acc_ID = json_response_object.Account_Details.Acc_ID;
    requestHttps("https://requench-rest.herokuapp.com/Fetch_Notifs.php", params, data => {

        var recent_notifs_length = data.Notifications.length;
        if (recent_notifs_length >= 2) {
            recent_notifs_length = 2;
        }

        console.log(data.Notifications);
        data.Notifications.sort(compDateTime);

        if (data.Notifications.length >= 4) {
            recent_notifs_length = 4;
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

    var params = {};
    requestHttps('https://requench-rest.herokuapp.com/Fetch_All_Machines.php', params, function (response) {
        if (response.Success) {
            machine_list = response.Machines;
            console.log(machine_list);
            clearMachineList();
            displayMachines();
            getRealTimeUpdates();
        } else {
            console.log(response);
        }
    });


    var params = {};
    requestHttps('https://requench-rest.herokuapp.com/Fetch_All_Sales.php', params, function (response) {
        recent_purchase_list = response.Purchase_History;
        recent_transactions_list = response.Transaction_History;
        clearSalesTable();
        displayTransactions();
    });






    function getPercentage(value, overall) {
        var percentage_value = (value / overall) * 100
        return percentage_value;
    }
    function compDateTime(a, b) {
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

    function clearMachineList() {
        var machine_items = document.getElementById("machine_items");
        machine_items.innerHTML = '';
    }

    function displayMachines() {
        var machine_items = document.getElementById("machine_items");
        var machine_items_length = machine_list.length;
        if (machine_items_length >= 5) {
            machine_items_length = 5;
        }
        console.log("Machine Length" + machine_items_length);

        for (let index = 0; index < machine_items_length; index++) {

            if (machine_list[index].API_KEY == null) {
                machine_list[index].API_KEY = "Not yet configured";
            }

            current_percentage = Math.round(getPercentage(machine_list[index].Current_Water_Level, 20000));
            if (current_percentage <= machine_list[index].Critical_Level) {
                default_bg = "bg-danger";
            } else {
                default_bg = "bg-info";
            }

            if (index == 0) {
                active = "active";
            } else {
                active = " ";
            }

            var html_string = `<div class="carousel-item ${active}">
                <h1>Machine ${machine_list[index].MU_ID}</h1>
                <p class="card-text">Last Maintenance Date:
                    <span>${machine_list[index].Last_Maintenance_Date}</span></p>
                <p class="card-text">Location: <span>${machine_list[index].Machine_Location}</span></p>
                <p class="card-text">API Key: <span>${machine_list[index].API_KEY}</span></p>
                <h5 class="water_level_header">Water Level</h5>
                <div class="progress">
                    <div class="progress-bar ${default_bg}" role="progressbar"
                        style="width: ${current_percentage}%;" aria-valuenow="25" aria-valuemin="0"
                        aria-valuemax="100">${current_percentage}%</div>
                </div>
                </div>`;
            console.log(html_string);
            var $container = $("#machine_items");
            console.log($container);
            var html = $.parseHTML(html_string);
            $container.append(html);
        }

    }

    function displayTransactions() {
        var sales_body = document.getElementById("sales_body");
        var current_list = recent_transactions_list;
        var recent_transactions_list_length = recent_transactions_list.length;
        if (recent_transactions_list_length >= 5) {
            recent_transactions_list_length = 5;
        }

        var pt_table = document.getElementById('pt_table');
        clearSalesTable();
        var total_amount = 0;
        for (let index = 0; index < recent_transactions_list_length; index++) {
            const item = current_list[index];
            var newRow = pt_table.insertRow(pt_table.rows.length);
            var cell1 = newRow.insertCell(0);
            try {
                cell1.innerHTML = current_list[index].Acc_ID;
            } catch (error) {
                cell1.innerHTML = current_list[index].UU_ID;
            }
            var cell2 = newRow.insertCell(1);
            cell2.innerHTML = current_list[index].Amount;
            var cell3 = newRow.insertCell(2);
            cell3.innerHTML = current_list[index].Price_Computed;
            var cell4 = newRow.insertCell(3);
            cell4.innerHTML = current_list[index].Time;
            var cell5 = newRow.insertCell(4);
            cell5.innerHTML = current_list[index].Date;
            newRow.onclick = function () {
                if (this.style.backgroundColor != 'deepskyblue') {
                    this.style.backgroundColor = 'deepskyblue';
                    selected_items.push(this.rowIndex - 1);
                } else {
                    var selected_index = selected_items.indexOf(this.rowIndex - 1);
                    if (selected_index > -1) {
                        selected_items.splice(selected_index, 1);
                    }
                    this.style.backgroundColor = '#fff';
                }
                console.log(selected_items);
            }
        }

    }

    function displayPurchases() {
        var sales_body = document.getElementById("sales_body");
        var current_list = recent_purchase_list;
        var recent_purchase_list_length = recent_purchase_list.length;
        if (recent_purchase_list_length >= 5) {
            recent_purchase_list_length = 5;
        }

        var pt_table = document.getElementById('pt_table');
        clearSalesTable();
        var total_amount = 0;
        for (let index = 0; index < recent_purchase_list_length; index++) {
            const item = current_list[index];
            var newRow = pt_table.insertRow(pt_table.rows.length);
            var cell1 = newRow.insertCell(0);
            try {
                cell1.innerHTML = current_list[index].Acc_ID;
            } catch (error) {
                cell1.innerHTML = current_list[index].UU_ID;
            }
            var cell2 = newRow.insertCell(1);
            cell2.innerHTML = current_list[index].Amount;
            var cell3 = newRow.insertCell(2);
            cell3.innerHTML = current_list[index].Price_Computed;
            var cell4 = newRow.insertCell(3);
            cell4.innerHTML = current_list[index].Time;
            var cell5 = newRow.insertCell(4);
            cell5.innerHTML = current_list[index].Date;
            newRow.onclick = function () {
                if (this.style.backgroundColor != 'deepskyblue') {
                    this.style.backgroundColor = 'deepskyblue';
                    selected_items.push(this.rowIndex - 1);
                } else {
                    var selected_index = selected_items.indexOf(this.rowIndex - 1);
                    if (selected_index > -1) {
                        selected_items.splice(selected_index, 1);
                    }
                    this.style.backgroundColor = '#fff';
                }
                console.log(selected_items);
            }
        }
    }

    function clearSalesTable() {
        var table = document.getElementById("pt_table");
        table.innerHTML = '';
        table.innerHTML = `<tr>
        <th scope="col">ID</th>
        <th scope="col">Amount</th>
        <th scope="col">Price Computed</th>
        <th scope="col">Time</th>
        <th scope="col">Date</th>
        </tr>`;
    }


});
