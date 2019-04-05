$(document).ready(function () {
    const messaging = firebase.messaging();
    var notif_list_div = document.getElementById('notif_list');
    var notif_count = document.getElementById('notif_count');
    var category_items = document.getElementsByClassName('category-item');
    var order_items = document.getElementsByClassName('order-item');
    var record_toggler = document.getElementById('record_toggler');
    var permission = Notification.permission;
    var notif_list = [];
    var params = {};
    var response = JSON.parse(sessionStorage.getItem('JSON_Response'));
    var previous_list_count;
    var current_list, current_list_unrecorded;
    var notif_counter = 0;
    var selected_items = [];
    var category_selected = 'Machine Location';
    var order_selected = 'Descending';

    // var seen_toggler = {
    //   seen:function(){
    //     $('.active_notif').removeClass('active_notif').addClass('new_class');
    //
    //   },
    //   unseen:function() {
    //
    //   }
    // }

    $('.dropdown-menu').click(function (e) {
        e.stopPropagation();
    });


    $('#record_toggler').change(function () {
        console.log($(this).prop('checked'));
        toggleListDisplay($(this).prop('checked'));
        if ($(this).prop('checked') == false) {
            //unrecorded
            displayList(current_list_unrecorded);
        } else {
            //recorded
            displayList(current_list);
        }
    });

    for (let index = 0; index < category_items.length; index++) {
        const element = category_items[index];
        element.onclick = function () {
            for (let index = 0; index < category_items.length; index++) {
                const element = category_items[index];
                element.classList.remove('active');
            }
            this.classList.add('active');
            document.getElementById('dropdown_sorter').innerHTML = this.innerHTML;
            category_selected = this.innerHTML;
            //sort by this.innerHTML category current list and current list unrecorded
            filter(current_list, category_selected, order_selected, function (list_returned) {
                console.log(list_returned);
            });
            filter(current_list_unrecorded, category_selected, order_selected, function (list_returned) {
                console.log(list_returned);
            });
            clearListDisplay();
            if ($("#record_toggler").prop('checked')) {
                displayList(current_list);
            } else {
                displayList(current_list_unrecorded);
            }
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
            document.getElementById('dropdown_order').innerHTML = this.innerHTML;
            order_selected = this.innerHTML;

            filter(current_list, category_selected, order_selected, function (list_returned) {
                console.log(list_returned);
            });
            filter(current_list_unrecorded, category_selected, order_selected, function (list_returned) {
                console.log(list_returned);
            });

            clearListDisplay();
            if ($("#record_toggler").prop('checked')) {
                displayList(current_list);
            } else {
                displayList(current_list_unrecorded);
            }


        }
    }

    generate_pdf.onclick = function () {
        Swal({
            title: 'Generate PDF',
            allowOutsideClicks: false,
            showConfirmButton: false,
            html: 
            `<div class="row">
                <div class= 'col-6' >
                    <label class="sr-only" for="startdate">Start Date</label>
                    <div class="input-group mb-2">
                        <div class="input-group-prepend">
                            <div class="input-group-text"><span class="fas fa-calendar"></span></div>
                        </div>
                        <input type="date" class="form-control" id="startdate" placeholder="Start Date">
                    </div>
                </div>
                <div class='col-6'>
                    <label class="sr-only" for="enddate">End Date</label>
                    <div class="input-group mb-2">
                        <div class="input-group-prepend">
                            <div class="input-group-text"><span class="fas fa-calendar"></span></div>
                        </div>
                        <input type="date" class="form-control" id="enddate" placeholder="End Date">
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-6">
                    <button id = "submit_button"  target="_blank" type="button" class="btn btn-info btn-block">Submit</button>
                </div>
                <div class="col-6">
                    <button id = "cancel_button" type="button" class="btn btn-danger btn-block">Cancel</button>
                </div>
            </div>`,
            onBeforeOpen: ()=>{
                const content = Swal.getContent();
                const $ = content.querySelector.bind(content);
                var startdate = $("#startdate");
                var enddate = $("#enddate");    
                var submit_button = $("#submit_button");
                var cancel_button = $("#cancel_button");    

                submit_button.onclick = function() {
                    var date_start = startdate.value;
                    var date_end = enddate.value;

                    var params = {};
                    params.Start_Date = date_start;
                    params.End_Date = date_end;
                    console.log(params);

                    //Request for file here
                    window.location.assign('https://requench-rest.herokuapp.com/pdf_transaction.php?Start_Date=' + params.Start_Date + 
                    "&End_Date="+params.End_Date);
                    Swal.close();
                }

                cancel_button.onclick = function() {
                    Swal.close();
                }

            }

        });
    }

    var params = {};
    requestHttp('POST', "https://requench-rest.herokuapp.com/Fetch_All_Transaction.php", params, function (e) {
        if (this.readyState == 4 && this.status == 200) {
            var response = this.responseText;
            console.log(response);

            if (response != null) {
                var json_object = JSON.parse(response);
                current_list = json_object.Transaction_List;
                current_list_unrecorded = json_object.Transaction_List_Unrecorded;
                console.log(json_object);

                clearListDisplay();
                displayList(current_list);
            }
        }
    });
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


    function displayList(current_list) {
        var table1 = document.getElementById('transaction_table');
        clearListDisplay();
        var total_amount = 0;
        for (let index = 0; index < current_list.length; index++) {
            const item = current_list[index];
            var newRow = table1.insertRow(table1.rows.length);
            var cell1 = newRow.insertCell(0);
            if ($("#record_toggler").prop('checked')) {
                cell1.innerHTML = current_list[index].Acc_ID;
            } else {
                cell1.innerHTML = current_list[index].UU_ID;
            }
            var cell2 = newRow.insertCell(1);
            cell2.innerHTML = current_list[index].Machine_Location;
            var cell3 = newRow.insertCell(2);
            cell3.innerHTML = current_list[index].Time;
            var cell4 = newRow.insertCell(3);
            cell4.innerHTML = current_list[index].Date;
            var cell5 = newRow.insertCell(4);
            cell5.innerHTML = current_list[index].Amount;
            var cell6 = newRow.insertCell(5);
            cell6.innerHTML = current_list[index].Temperature;
            var cell7 = newRow.insertCell(6);
            cell7.innerHTML = current_list[index].Price_Computed;
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


    function clearListDisplay() {
        var table = document.getElementById("transaction_table");
        table.innerHTML = '';
        table.innerHTML = `<tr>
        <th scope="col">Acc_ID</th>
        <th scope="col">Machine Location</th>
        <th scope="col">Time</th>
        <th scope="col">Date</th>
        <th scope="col">Amount</th>
        <th scope="col">Temperature</th>
        <th scope="col">Price</th>
        </tr>`;
    }

    function toggleListDisplay(mode) {
        var table = document.getElementById("transaction_table");
        table.innerHTML = '';
        if (mode) {
            table.innerHTML = `<tr>
            <th scope="col">Acc_ID</th>
            <th scope="col">Machine Location</th>
            <th scope="col">Time</th>
            <th scope="col">Date</th>
            <th scope="col">Amount</th>
            <th scope="col">Temperature</th>
            <th scope="col">Price</th>
            </tr>`;
        } else {
            table.innerHTML = `<tr>
            <th scope="col">UU_ID</th>
            <th scope="col">Machine Location</th>
            <th scope="col">Time</th>
            <th scope="col">Date</th>
            <th scope="col">Amount</th>
            <th scope="col">Temperature</th>
            <th scope="col">Price</th>
            </tr>`;
        }

    }



    function filter(list, cat, order, fn) {
        if (list != '') {
            switch (order) {
                case 'Ascending':
                    switch (cat) {
                        case 'Time':
                            list.sort(compByTimeAsc);
                            break;
                        case 'Date':
                            list.sort(compByDateAsc);
                            break;
                        case 'Amount':
                            list.sort(compByAmountAsc);
                            break;
                        case 'Machine Location':
                            list.sort(compByMachineAsc);
                            break;
                        case 'Temperature':
                            list.sort(compByTempAsc);
                            break;
                        case 'Price':
                            list.sort(compByPriceAsc);
                            break;
                        default:
                            break;
                    }
                    break;

                case 'Descending':
                    switch (cat) {
                        case 'Time':
                            list.sort(compByTimeDesc);
                            break;
                        case 'Date':
                            list.sort(compByDateDesc);
                            break;
                        case 'Amount':
                            list.sort(compByAmountDesc);
                            break;
                        case 'Machine Location':
                            list.sort(compByMachineDesc);
                            break;
                        case 'Temperature':
                            list.sort(compByTempDesc);
                            break;
                        case 'Price':
                            list.sort(compByPriceDesc);
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


    function compByDateAsc(a, b) {
        if (Date.parse(a.Date) < Date.parse(b.Date)) {
            return -1;
        } else {
            return 0;
        }
    }
    function compByDateDesc(a, b) {
        if (Date.parse(a.Date) > Date.parse(b.Date)) {
            return -1;
        } else {
            return 0;
        }
    }

    function compByTimeAsc(a, b) {
        if (a.Time < b.Time) {
            return -1;
        } else {
            return 0;
        }
    }

    function compByTimeDesc(a, b) {
        if (a.Time > b.Time) {
            return -1;
        } else {
            return 0;
        }
    }

    function compByAmountAsc(a, b) {
        if (parseFloat(a.Amount) < parseFloat(b.Amount)) {
            return -1;
        } else {
            return 0;
        }
    }

    function compByAmountDesc(a, b) {
        if (parseFloat(a.Amount) > parseFloat(b.Amount)) {
            return -1;
        } else {
            return 0;
        }
    }

    function compByPriceAsc(a, b) {
        if (parseFloat(a.Price_Computed) < parseFloat(b.Price_Computed)) {
            return -1;
        } else {
            return 0;
        }
    }

    function compByPriceDesc(a, b) {
        if (parseFloat(a.Price_Computed) > parseFloat(b.Price_Computed)) {
            return -1;
        } else {
            return 0;
        }
    }

    function compByMachineAsc(a, b) {
        if (a.Machine_Location < b.Machine_Location) {
            return -1;
        } else {
            return 0;
        }
    }

    function compByMachineDesc(a, b) {
        if (a.Machine_Location > b.Machine_Location) {
            return -1;
        } else {
            return 0;
        }
    }
    function compByTempAsc(a, b) {
        if (a.Temperature < b.Temperature) {
            return -1;
        } else {
            return 0;
        }
    }

    function compByTempDesc(a, b) {
        if (a.Temperature > b.Temperature) {
            return -1;
        } else {
            return 0;
        }
    }

});



