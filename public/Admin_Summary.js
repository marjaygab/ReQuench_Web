$(document).ready(function () {
    $('.grid').masonry({
        // options
        itemSelector: '.grid-item',
        columnWidth: 500
    });

    var json_response_string = sessionStorage.getItem('JSON_Response');
    var recent_notification_list = [];
    var machine_list = [];


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

    var params = {};
    params.Acc_ID = json_response_object.Account_Details.Acc_ID;
    requestHttps("https://requench-rest.herokuapp.com/Fetch_Notifs.php", params, data => {

        var recent_notifs_length = data.Notifications.length;
        if (recent_notifs_length >= 2) {
            recent_notifs_length = 2;
        }

        console.log(data.Notifications);
        data.Notifications.sort(compDateTime);

        if (data.Notifications.length >= 2) {
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
                }else{
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



});
