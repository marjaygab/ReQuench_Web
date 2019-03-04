$(document).ready(function () {
    const messaging = firebase.messaging();
    var logout_button = document.getElementById('logout_button');
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
    var current_list,current_list_unrecorded;
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


    $('#record_toggler').change(function() {
        console.log($(this).prop('checked'));
        toggleListDisplay($(this).prop('checked'));
        if ($(this).prop('checked') == false) {
            //unrecorded
            displayList(current_list_unrecorded);
        }else{
            //recorded
            displayList(current_list);
        }
      });
    
    for (let index = 0; index < category_items.length; index++) {
        const element = category_items[index];
        element.onclick = function() {
            for (let index = 0; index < category_items.length; index++) {
                const element = category_items[index];
                element.classList.remove('active');
            }
            this.classList.add('active');
            document.getElementById('dropdown_sorter').innerHTML = this.innerHTML;
            category_selected = this.innerHTML;
            //sort by this.innerHTML category current list and current list unrecorded
            filter(current_list,category_selected,order_selected,function(list_returned) {
                console.log(list_returned);
            });
            filter(current_list_unrecorded,category_selected,order_selected,function(list_returned) {
                console.log(list_returned);
            });
            clearListDisplay();
            if ($("#record_toggler").prop('checked')) {
                displayList(current_list);
            }else{
                displayList(current_list_unrecorded);
            }
        }    
    }

    for (let index = 0; index < order_items.length; index++) {
        const element = order_items[index];
        element.onclick = function() {
            for (let index = 0; index < order_items.length; index++) {
                const element = order_items[index];
                element.classList.remove('active');
            }
            this.classList.add('active');
            document.getElementById('dropdown_order').innerHTML = this.innerHTML;
            order_selected = this.innerHTML;
            
            filter(current_list,category_selected,order_selected,function(list_returned) {
                console.log(list_returned);
            });
            filter(current_list_unrecorded,category_selected,order_selected,function(list_returned) {
                console.log(list_returned);
            });
            
            clearListDisplay();
            if ($("#record_toggler").prop('checked')) {
                displayList(current_list);
            }else{
                displayList(current_list_unrecorded);
            }


        }    
    }

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
            // showToken('Error retrieving Instance ID token. ', err);
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
        // firebase.auth().signOut().then(function () {
        //     var params = {};
        //     var response = JSON.parse(sessionStorage.getItem('JSON_Response'));
        //     params.Acc_ID = response.Account_Details.Acc_ID;
        //     //clear registration token for later renewal
        //     requestHttp('POST', "https://requench-rest.herokuapp.com/Clear_Token.php", params, function (e) { });
        //     window.location.href = "index.html";
        // }, function (error) {
        //     Swal({
        //         type: 'error',
        //         title: 'Something went Wrong!',
        //         text: 'Please contact your administrator for assistance. Thank you!'
        //     });
        // });
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


    function displayList(current_list) {
        var table1 = document.getElementById('transaction_table');
        clearListDisplay();
        var total_amount = 0;
        for (let index = 0; index < current_list.length; index++) {
            const item = current_list[index];
            var newRow = table1.insertRow(table1.rows.length);
            var cell1 = newRow.insertCell(0);
            if($("#record_toggler").prop('checked')){
                cell1.innerHTML = current_list[index].Acc_ID;
            }else{
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

    function filter(list,cat,order,fn) {
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
      
      
      function compByDateAsc(a,b) {
        if (Date.parse(a.Date) < Date.parse(b.Date)) {
          return -1;
        }else {
          return 0;
        }
      }
      function compByDateDesc(a,b) {
        if (Date.parse(a.Date) > Date.parse(b.Date)) {
          return -1;
        }else {
          return 0;
        }
      }
      
      function compByTimeAsc(a,b) {
        if (a.Time < b.Time) {
          return -1;
        }else {
          return 0;
        }
      }
      
      function compByTimeDesc(a,b) {
        if (a.Time > b.Time) {
          return -1;
        }else {
          return 0;
        }
      }
      
      function compByAmountAsc(a,b) {
        if (parseFloat(a.Amount) < parseFloat(b.Amount)) {
          return -1;
        }else {
          return 0;
        }
      }

      function compByAmountDesc(a,b) {
        if (parseFloat(a.Amount) > parseFloat(b.Amount)) {
          return -1;
        }else {
          return 0;
        }
      }

      function compByPriceAsc(a,b) {
        if (parseFloat(a.Price_Computed) < parseFloat(b.Price_Computed)) {
          return -1;
        }else {
          return 0;
        }
      }

      function compByPriceDesc(a,b) {
        if (parseFloat(a.Price_Computed) > parseFloat(b.Price_Computed)) {
          return -1;
        }else {
          return 0;
        }
      }
      
      function compByMachineAsc(a,b) {
        if (a.Machine_Location < b.Machine_Location) {
          return -1;
        }else {
          return 0;
        }
      }

      function compByMachineDesc(a,b) {
        if (a.Machine_Location > b.Machine_Location) {
          return -1;
        }else {
          return 0;
        }
      }
      function compByTempAsc(a,b) {
        if (a.Temperature < b.Temperature) {
          return -1;
        }else {
          return 0;
        }
      }

      function compByTempDesc(a,b) {
        if (a.Temperature > b.Temperature) {
          return -1;
        }else {
          return 0;
        }
      }

});
