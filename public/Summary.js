$('document').ready(function () {
    var user_fn_banner = document.getElementById('user_fn');
    var balance_label = document.getElementById('balance');
    var details_balance = document.getElementById('details_balance');
    var details_activity = document.getElementById('details_activity');
    var category_drop = document.getElementById('dropdownMenuButtonCat');
    var order_drop = document.getElementById('dropdownMenuButtonOrd');
    var drop_time = document.getElementById('drop_cat_time');
    var drop_date = document.getElementById('drop_cat_date');
    var drop_amount = document.getElementById('drop_cat_amount');
    var drop_asc = document.getElementById('drop_order_asc');
    var drop_desc = document.getElementById('drop_order_desc');
    var no_activity_banner = document.getElementById('no_activity_banner')
    var view_all_link = document.getElementById('view_all');
    var session_var = sessionStorage.getItem('JSON_Response');
    var list_items_div = document.getElementById('list_items_div');
    var logout_button = document.getElementById('logout_button');
    var jsonobj = JSON.parse(session_var);
    console.log(jsonobj);
    
    var profile_picture_div = document.getElementById('profile_picture');
    var path = "url('.." + jsonobj.file_path + "')";
    profile_picture_div.style.backgroundImage = "url('https://requench-rest.herokuapp.com" + jsonobj.file_path + "')";
    user_fn_banner.innerHTML = jsonobj.Account_Details.First_Name;
    balance_label.innerHTML = jsonobj.Account_Details.Balance + " mL"
    var i = 0;
    var list;
    var selected_cat = 'Date';
    var selected_order = 'Descending';
    $('.dropdown-toggle').dropdown();






    $(".category-item").click(function () {
        selected_cat = $(this).text();
        $("#dropdownMenuButtonCat").html(selected_cat);
        filter(list, selected_cat, selected_order, function (temp_array) {
            if (temp_array.length > 0) {
                clearList(list_items_div);
                no_activity_banner.style.display = "none";
                list = temp_array;
                var size = temp_array.length;
                if (size >= 5) {
                    size = 5;
                }
                for (var i = 0; i < size; i++) {
                    if (list[i].Transaction_ID != null) {
                        addListItem(list[i].Date, list[i].Time, "Dispensed " + list[i].Temperature + " Water", list[i].Amount, '#list_items_div');
                    } else {
                        addListItem(list[i].Date, list[i].Time, "Bought ReQuench Points", list[i].Amount, '#list_items_div');
                    }
                }
            }
        });
    });


    $(".order-item").click(function () {
        selected_order = $(this).text();
        $("#dropdownMenuButtonOrd").html(selected_order);
        filter(list, selected_cat, selected_order, function (temp_array) {
            if (temp_array.length > 0) {
                clearList(list_items_div);
                no_activity_banner.style.display = "none";
                list = temp_array;
                var size = temp_array.length;
                if (size >= 5) {
                    size = 5;
                }
                for (var i = 0; i < size; i++) {
                    if (list[i].Transaction_ID != null) {
                        addListItem(list[i].Date, list[i].Time, "Dispensed " + list[i].Temperature + " Water", list[i].Amount, '#list_items_div');
                    } else {
                        addListItem(list[i].Date, list[i].Time, "Bought ReQuench Points", list[i].Amount, '#list_items_div');
                    }
                }
            }
        });
    });


    fetchHistory(jsonobj.Account_Details.Acc_ID, function (temp_array) {
        if (temp_array.length > 0) {
            no_activity_banner.style.display = "none";
            list = temp_array;
            list.sort(compByDateDesc);
            var size = temp_array.length;
            if (size >= 5) {
                size = 5;
            }
            for (var i = 0; i < size; i++) {
                if (list[i].Transaction_ID != null) {
                    addListItem(list[i].Date, list[i].Time, "Dispensed " + list[i].Temperature + " Water", list[i].Amount, '#list_items_div');
                } else {
                    addListItem(list[i].Date, list[i].Time, "Bought ReQuench Points", list[i].Amount, '#list_items_div');
                }
            }
        }

    });


    logout_button.onclick = function () {
        firebase.auth().signOut().then(function() {
          window.location.href = "index.html";
        }, function(error) {
          Swal({
            type: 'error',
            title: 'Something went Wrong!',
            text: 'Please contact your administrator for assistance. Thank you!'
          });
        });
    }


    view_all_link.onclick = function () {
        console.log(jsonobj.Account_Details.Acc_ID);

    }

    details_balance.onclick = function () {

        console.log(list);
    }

});


// function toggle(selected) {
//     $('#dropdownMenuButtonCat').innerHTML = selected;
// }
function filter(list, cat, order, fn) {
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
                default:
                    break;
            }
            break;

        default:
            break;
    }

    fn(list);
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


function addListItem(date, time, description, amount, id) {
    var string = `<li class="list-group-item item">
    <div class="row">
      <div class="col-sm-3">
        <h5 style="float:left;">${date}</h5>
        <p style="float:left;">${time}</p>
      </div>
      <div class="col-sm-7">
        <h5 style="display:inline;">${description}</h5>
      </div>
      <div class="col-sm-2">
        <span style="float:right;">${amount} PHP</span>
      </div>
    </div>
  </li>`;
    var $container = $(id);
    var html = $.parseHTML(string);
    $container.append(html);
}


function clearList(list_items_div) {
    list_items_div.innerHTML = "";
}

function fetchHistory(account_id, set) {
    var params = {};
    params.Acc_ID = account_id;

    requestHttps('https://requench-rest.herokuapp.com/Fetch_History.php',params,function(response) {
        var json_object = response;
        var temp_array = [];
        for (var i = 0; i < json_object.Transactions.length; i++) {
            temp_array.push(json_object.Transactions[i]);
        }
        for (var i = 0; i < json_object.Purchase.length; i++) {
            temp_array.push(json_object.Purchase[i]);
        }
        set(temp_array);
    });
}
