table1 = document.getElementById("purch_summary");
table2 = document.getElementById("purch_sub");
var confirm = document.getElementById("add_item");
var pay = document.getElementById("pay");
var cancel = document.getElementById("cancel");
var total = 0;
var idno = document.getElementById("Input_ID_btn");
var header = document.getElementById('header');
var enter_rfid = document.getElementById('enter_rfid');
var add_links = document.getElementsByClassName('add_links');
var keypad_button = document.getElementsByClassName('keypad_button');
var rfid_field = document.getElementById('rfid_field');
var acc_num_display = document.getElementById('acc_num_display');
var balance_display = document.getElementById('balance_display');
var backspace_button = document.getElementById('backspace_button');
var remove_button = document.getElementById('remove_button');
var clear_button = document.getElementById('clear_button');
var checkout_button = document.getElementById('checkout_button');
var amount_field = document.getElementById('amount_field');
var total_field = document.getElementById('total_field');
var change_field = document.getElementById('change_field');
var account_name = document.getElementById('account_name');
var logout_button = document.getElementById('logout_button');
var current_list = [];
var selected_items = [];
var current_account = {
    unrec: {
        isSelected: true,
        UU_ID: ''
    },
    rec: {
        isSelected: false,
        Acc_ID: ''
    },
    selected: function () {
        if (this.unrec.isSelected) {
            return 'unrec';
        } else {
            return 'rec';
        }
    },
    getSelectedID: function () {
        if (this.unrec.isSelected) {
            return this.unrec.UU_ID;
        } else {
            return this.rec.Acc_ID;
        }
    }
}

var unit = {
    ml: true,
    price: false,
    selected: function () {
        if (this.ml) {
            return 'ml';
        } else {
            return 'price';
        }
    }
};
var method = {
    preset: true,
    keypad: false,
    selected: function () {
        if (this.preset) {
            return 'preset';
        } else {
            return 'keypad';
        }
    }
};



for (let index = 0; index < keypad_button.length; index++) {
    const element = keypad_button[index];
    element.onclick = function () {
        console.log(this.innerHTML);
        var output = formatNum(getOutput());
        if (output != NaN) { //if output is a number
            output = output + this.innerHTML;
            printOutput(output);
            // Volumeconvert(output);
        }
    }
}


amount_field.oninput = function () {
    if (parseInt(total_field.value) <= parseInt(amount_field.value)) {
        change_field.value = parseInt(amount_field.value) - parseInt(total_field.value);
    } else {
        change_field.value = '';
    }
}

remove_button.onclick = function () {
    for (let index = 0; index < selected_items.length; index++) {
        var selected_index = selected_items[index];
        if (selected_index > -1) {
            current_list.splice(selected_index, 1);
        }
    }
    displayList(current_list);
    selected_items = [];
}

clear_button.onclick = function () {
    current_list = [];
    displayList(current_list);
    selected_items = [];
}


checkout_button.onclick = function () {
    if (checkout_button.innerHTML == 'CONFIRM') {
        checkout_button.innerHTML = 'CHECKOUT';
        checkout_button.classList.remove('btn-secondary');
        checkout_button.classList.add('btn-info');
        //enable amount 
        amount_field.disabled = false;

    } else {

        var amount_input = parseInt(amount_field.value);
        var total_price = parseInt(total_field.value);
        if (amount_input < total_price) {

            Swal.fire(
                'Oops..',
                'You entered insufficient amount for the price.',
                'error'
            );

        } else {
            var params = {};
            console.log(current_list);
            amount_field.disabled = true;
            console.log(current_account.selected() + ' ' + current_account.getSelectedID());
            var account_type = '';
            if (current_account.selected() == 'rec') {
                account_type = 'Recorded';
                params.Acc_ID = current_account.getSelectedID();
            } else {
                account_type = 'Unrecorded';
                params.UU_ID = current_account.getSelectedID();
            }
            params.Account_Type = account_type;
            var total_volume = 0;
            for (let index = 0; index < current_list.length; index++) {
                const element = current_list[index];
                total_volume = total_volume + parseInt(current_list[index].volume);
            }

            params.Load = total_volume;
            params.Price = total_price;
            console.log('I am here');
            console.log(params);
            Swal.fire({
                title: 'Updating..',
                onBeforeOpen: () => {
                    Swal.showLoading();
                    requestHttp('POST', 'https://requench-rest.herokuapp.com/Update_Balance.php', params, function (e) {
                        if (this.readyState == 4 && this.status == 200) {
                            var response = this.responseText;
                            if (response != null) {
                                var json_object = JSON.parse(response);
                                if (json_object.Success) {
                                    Swal.fire({
                                        title: "Update Complete!",
                                        type: 'success'
                                    }).then((result) => {
                                        if (result.value) {
                                            window.location.reload();
                                        }
                                    });
                                } else {
                                    console.log(json_object);
                                }
                            }
                        }
                    });
                },
                onClose: () => {
                }
            }).then((result) => {
                if (
                    // Read more about handling dismissals
                    result.dismiss === Swal.DismissReason.timer
                ) {
                    console.log('I was closed by the timer')
                }
            })

            checkout_button.innerHTML = 'CONFIRM';
            checkout_button.classList.remove('btn-info');
            checkout_button.classList.add('btn-secondary');
            total_field.value = '';
            amount_field.value = '';
            change_field.value = '';
            current_list = [];
            displayList(current_list);
        }
    }
}


backspace_button.onclick = function () {
    var output = formatNum(getOutput()).toString();
    if (output) {//if output has a value
        output = output.substr(0, output.length - 1);
        printOutput(output);
    }
}

logout_button.onclick = function () {
    window.location.assign('../index.html');
}

rfid_field.onkeypress = function (e) {
    if (e.keyCode == 13) {
        var params = {};
        params.RFID_ID = rfid_field.value;
        requestHttp('POST', 'https://requench-rest.herokuapp.com/Customer_Login.php', params, function (e) {
            if (this.readyState == 4 && this.status == 200) {
                var response = this.responseText;
                if (response != null) {
                    var json_object = JSON.parse(response);
                    console.log(json_object);
                    if (json_object.Success && json_object.Account_Type == 'Unrecorded') {
                        current_account.unrec.isSelected = true;
                        current_account.unrec.UU_ID = json_object.Account.UU_ID;
                        current_account.rec.isSelected = false;
                        balance_display.value = json_object.Account.Balance;
                        account_name.innerHTML = 'Unrecorded Account'
                        if (json_object.Account.ID_Number == null) {
                            acc_num_display.value = 'Unset';
                            Swal.fire({
                                title: 'This ID does not have any Associated ID Number. Please enter the ID Number.',
                                input: 'text',
                                inputAttributes: {
                                    autocapitalize: 'off'
                                },
                                showCancelButton: true,
                                confirmButtonText: 'Submit',
                                showLoaderOnConfirm: true,
                                preConfirm: (ID_NUMBER) => {
                                    var params = {};
                                    params.UU_ID = current_account.unrec.UU_ID;
                                    params.ID_Number = ID_NUMBER;
                                    console.log(params);
                                    console.log(json_object);
                                    const otherParam = {
                                        headers: {
                                            "content-type": "application/json; charset=UTF-8"
                                        },
                                        body: JSON.stringify(params),
                                        method: "POST"
                                    }
                                    return fetch(`https://requench-rest.herokuapp.com/Set_IDNumber.php`, otherParam)
                                        .then(response => {
                                            if (!response.ok) {
                                                throw new Error(response.statusText)
                                            }
                                            return response.json()
                                        })
                                        .catch(error => {
                                            Swal.showValidationMessage(
                                                `Request failed: ${error}`
                                            )
                                        })
                                },
                                allowOutsideClick: () => !Swal.isLoading()
                            }).then((result) => {
                                if (result.value) {
                                    acc_num_display.value = result.value.ID_Number;
                                }
                            });
                        } else {
                            acc_num_display.value = json_object.Account.ID_Number;
                        }
                    } else if (json_object.Success && json_object.Account_Type == 'Recorded') {
                        current_account.unrec.isSelected = false;
                        current_account.rec.isSelected = true;
                        current_account.rec.Acc_ID = json_object.Account.Acc_ID;
                        acc_num_display.value = json_object.Account.ID_Number;
                        balance_display.value = json_object.Account.Balance;
                        var params = {};
                        params.Acc_ID = current_account.rec.Acc_ID;
                        console.log(params);
                        requestHttp('POST', 'https://requench-rest.herokuapp.com/Fetch_Profile.php', params, function (e) {
                            if (this.readyState == 4 && this.status == 200) {
                                var response = this.responseText;
                                if (response != null) {
                                    var json_object = JSON.parse(response);
                                    account_name.innerHTML = json_object.Account_Details.First_Name + ' ' + json_object.Account_Details.Last_Name;
                                }
                            }
                        });


                    } else if (json_object.Success && json_object.Account_Type == 'Inserted_Unrecorded') {
                        current_account.unrec.isSelected = true;
                        current_account.rec.isSelected = false;
                        current_account.unrec.UU_ID = json_object.Insert_ID;
                        acc_num_display.value = 'Unset';
                        balance_display.value = json_object.Balance;
                        account_name.innerHTML = 'Unrecorded';
                        Swal.fire({
                            title: 'This ID does not have any Associated ID Number. Please enter the ID Number.',
                            input: 'text',
                            inputAttributes: {
                                autocapitalize: 'off'
                            },
                            showCancelButton: true,
                            confirmButtonText: 'Submit',
                            showLoaderOnConfirm: true,
                            preConfirm: (ID_NUMBER) => {
                                var params = {};
                                params.UU_ID = json_object.Insert_ID;
                                params.ID_Number = ID_NUMBER;
                                const otherParam = {
                                    headers: {
                                        "content-type": "application/json; charset=UTF-8"
                                    },
                                    body: JSON.stringify(params),
                                    method: "POST"
                                }
                                return fetch(`https://requench-rest.herokuapp.com/Set_IDNumber.php`, otherParam)
                                    .then(response => {
                                        if (!response.ok) {
                                            throw new Error(response.statusText)
                                        }
                                        return response.json()
                                    })
                                    .catch(error => {
                                        Swal.showValidationMessage(
                                            `Request failed: ${error}`
                                        )
                                    })
                            },
                            allowOutsideClick: () => !Swal.isLoading()
                        }).then((result) => {
                            if (result.value) {
                                console.log(result.value);

                                acc_num_display.value = result.value.ID_Number;
                            }
                        })
                    }
                    else {
                        json_object.Success == false;
                    }

                }
            }
        });
    }
}


enter_rfid.onclick = function () {
    var params = {};
    params.RFID_ID = rfid_field.value;
    requestHttp('POST', 'https://requench-rest.herokuapp.com/Customer_Login.php', params, function (e) {
        if (this.readyState == 4 && this.status == 200) {
            var response = this.responseText;
            if (response != null) {
                var json_object = JSON.parse(response);
                console.log(json_object);
                if (json_object.Success && json_object.Account_Type == 'Unrecorded') {
                    current_account.unrec.isSelected = true;
                    current_account.rec.isSelected = false;
                    current_account.unrec.UU_ID = json_object.Account.UU_ID;
                    balance_display.value = json_object.Account.Balance;
                    console.log(json_object);

                    if (json_object.Account.ID_Number == null) {
                        acc_num_display.value = 'Unset';
                        Swal.fire({
                            title: 'This ID does not have any Associated ID Number. Please enter the ID Number.',
                            input: 'text',
                            inputAttributes: {
                                autocapitalize: 'off'
                            },
                            showCancelButton: true,
                            confirmButtonText: 'Submit',
                            showLoaderOnConfirm: true,
                            preConfirm: (ID_NUMBER) => {
                                var params = {};
                                params.UU_ID = current_account.unrec.UU_ID;
                                params.ID_Number = ID_NUMBER;
                                console.log(params);
                                console.log(json_object);
                                const otherParam = {
                                    headers: {
                                        "content-type": "application/json; charset=UTF-8"
                                    },
                                    body: JSON.stringify(params),
                                    method: "POST"
                                }
                                return fetch(`https://requench-rest.herokuapp.com/Set_IDNumber.php`, otherParam)
                                    .then(response => {
                                        if (!response.ok) {
                                            throw new Error(response.statusText)
                                        }
                                        return response.json()
                                    })
                                    .catch(error => {
                                        Swal.showValidationMessage(
                                            `Request failed: ${error}`
                                        )
                                    })
                            },
                            allowOutsideClick: () => !Swal.isLoading()
                        }).then((result) => {
                            if (result.value) {
                                acc_num_display.value = result.value.ID_Number;
                            }
                        });
                    } else {
                        acc_num_display.value = json_object.Account.ID_Number;
                    }
                } else if (json_object.Success && json_object.Account_Type == 'Recorded') {
                    current_account.unrec.isSelected = false;
                    current_account.rec.isSelected = true;
                    current_account.rec.Acc_ID = json_object.Account.Acc_ID;
                    acc_num_display.value = json_object.Account.ID_Number;
                    balance_display.value = json_object.Account.Balance;
                } else if (json_object.Success && json_object.Account_Type == 'Inserted_Unrecorded') {
                    current_account.unrec.isSelected = false;
                    current_account.rec.isSelected = true;
                    current_account.unrec.UU_ID = json_object.Insert_ID;
                    console.log(json_object.Insert_ID);
                    acc_num_display.value = 'Unset';
                    balance_display.value = json_object.Balance;
                    Swal.fire({
                        title: 'This ID does not have any Associated ID Number. Please enter the ID Number.',
                        input: 'text',
                        inputAttributes: {
                            autocapitalize: 'off'
                        },
                        showCancelButton: true,
                        confirmButtonText: 'Submit',
                        showLoaderOnConfirm: true,
                        preConfirm: (ID_NUMBER) => {
                            var params = {};
                            params.UU_ID = json_object.Insert_ID;
                            params.ID_Number = ID_NUMBER;
                            const otherParam = {
                                headers: {
                                    "content-type": "application/json; charset=UTF-8"
                                },
                                body: JSON.stringify(params),
                                method: "POST"
                            }
                            return fetch(`https://requench-rest.herokuapp.com/Set_IDNumber.php`, otherParam)
                                .then(response => {
                                    if (!response.ok) {
                                        throw new Error(response.statusText)
                                    }
                                    return response.json()
                                })
                                .catch(error => {
                                    Swal.showValidationMessage(
                                        `Request failed: ${error}`
                                    )
                                })
                        },
                        allowOutsideClick: () => !Swal.isLoading()
                    }).then((result) => {
                        if (result.value) {
                            acc_num_display.value = result.value.ID_Number;
                        }
                    })
                }
                else {
                    // json_object.Success == false
                }

            }
        }
    });
}


for (let index = 0; index < add_links.length; index++) {
    const element = add_links[index];
    element.onclick = function () {
        console.log(this.id);
        var perml = 0.02;
        var volume;
        var price;
        var newRow = table1.insertRow(table1.rows.length);

        var list_item = {
            volume: 0,
            price: 0,
            isSelected: false
        };
        list_item.price = parseInt(this.id);
        list_item.volume = list_item.price / perml;
        current_list.push(list_item);

        displayList(current_list);
        // var cell1 = newRow.insertCell(0);
        // cell1.innerHTML = list_item.volume;
        // var cell2 = newRow.insertCell(1);
        // cell2.innerHTML = list_item.price;

        // newRow.onclick = function() {
        //     console.log('Test Click: ' + this.rowIndex);
        //     if (this.style.backgroundColor != 'deepskyblue') {
        //         this.style.backgroundColor = 'deepskyblue';
        //         console.log(`List Item ${current_list[this.rowIndex-1].volume}`);
        //         selected_items.push(this.rowIndex-1);
        //     }else{
        //         var selected_index = selected_items.indexOf(this.rowIndex-1);
        //         if(selected_index > -1){
        //           selected_items.splice(selected_index,1);
        //         }
        //         this.style.backgroundColor = '#fff';
        //     }
        //     console.log(selected_items);
        //   }
        remove_button.disabled = false;
        clear_button.disabled = false;
    }

}



$('#toggle-method').change(function () {
    if ($(this).prop('checked')) {
        method.preset = true;
        method.keypad = false;
        $('#preset').show();
        $('#keypad').hide();
    } else {
        method.preset = false;
        method.keypad = true;
        $('#preset').hide();
        $('#keypad').show();
    }


});

$('#toggle-unit').change(function () {

    var perml = 0.020;

    if ($(this).prop('checked')) {
        unit.ml = true;
        unit.price = false;
        if (document.getElementById('amount_display').value != '') {
            var current_value = parseInt(formatNum(document.getElementById('amount_display').value));
            document.getElementById('amount_display').value = current_value / perml;
        }
    } else {
        unit.ml = false;
        unit.price = true;
        if (document.getElementById('amount_display').value != '') {
            var current_value = parseInt(formatNum(document.getElementById('amount_display').value));
            document.getElementById('amount_display').value = current_value * perml;
        }
    }
    console.log(unit.selected());
});


confirm.addEventListener("click", function (event) {
    var perml = 0.020;
    var volume;
    var price;
    var newRow = table1.insertRow(table1.rows.length);

    var list_item = {
        volume: 0,
        price: 0,
        isSelected: false
    };

    if (unit.selected() == 'ml') {
        list_item.volume = parseInt(formatNum(document.getElementById('amount_display').value));
        list_item.price = list_item.volume * perml;
    } else {
        list_item.price = parseInt(formatNum(document.getElementById('amount_display').value));
        list_item.volume = list_item.price / perml;
    }
    current_list.push(list_item);
    console.log(list_item);
    displayList(current_list);
    remove_button.disabled = false;
    clear_button.disabled = false;
    // var x = document.getElementById('textBox').value ;
    // document.getElementById("total").value = x;
    // var y = document.getElementById('outputmL').value ;
    // document.getElementById("vol_purchased").value = y;
});

equal.addEventListener("click", function (event) {
    var newRow = table1.insertRow(table1.rows.length);
    var cell1 = newRow.insertCell(0);
    cell1.innerHTML = document.getElementById('outputmL').value;
    var cell2 = newRow.insertCell(1);
    cell2.innerHTML = "25";
    var x = document.getElementById('textBox').value;
    document.getElementById("total").value = x;
    var y = document.getElementById('outputmL').value;
    document.getElementById("vol_purchased").value = y;
});
cancel.addEventListener("click", function (event) {
    location.reload();
});


var operator = document.getElementsByClassName("operator");
for (var i = 0; i < operator.length; i++) {
    operator[i].addEventListener('click', function () {
        if (this.id == "clear") {
            printHistory("");
            printOutput("");
        }
        else if (this.id == "backspace") {
            var output = formatNum(getOutput()).toString();
            if (output) {//if output has a value
                output = output.substr(0, output.length - 1);
                printOutput(output);
            }
        }
        else {
            var output = getOutput();
            var history = getHistory();
            if (output == "" && history != "") {
                if (isNaN(history[history.length - 1])) {
                    history = history.substr(0, history.length - 1);
                }
            }
            if (output != "" || history != "") {
                output = output == "" ? output : formatNum(output);
                history = history + output;
                if (this.id == "=") {
                    var result = eval(history);
                    printOutput(result);
                    printHistory("");
                }
                else {
                    history = history + this.id;
                    printHistory(history);
                    printOutput("");
                }
            }
        }

    });
}
var number = document.getElementsByClassName("number");
for (var i = 0; i < number.length; i++) {
    number[i].addEventListener('click', function () {
        var output = formatNum(getOutput());
        if (output != NaN) { //if output is a number
            output = output + this.id;
            printOutput(output);
            Volumeconvert(output);
        }
    });
}


function displayList(current_list) {
    clearListDisplay();
    var total_field = document.getElementById('total_field');
    var remove_button = document.getElementById('remove_button');
    var clear_button = document.getElementById('clear_button');
    console.log(`Current List Length = ${current_list.length}`);


    var total_amount = 0;
    for (let index = 0; index < current_list.length; index++) {
        const item = current_list[index];
        total_amount = total_amount + parseInt(item.price);
        var newRow = table1.insertRow(table1.rows.length);
        var cell1 = newRow.insertCell(0);
        cell1.innerHTML = current_list[index].volume;
        var cell2 = newRow.insertCell(1);
        cell2.innerHTML = current_list[index].price;
        newRow.onclick = function () {
            console.log('Test Click: ' + this.rowIndex);
            if (this.style.backgroundColor != 'deepskyblue') {
                this.style.backgroundColor = 'deepskyblue';
                console.log(`List Item ${current_list[this.rowIndex - 1].volume}`);
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
    total_field.value = total_amount;
    if (current_list.length <= 0) {
        remove_button.disabled = true;
        clear_button.disabled = true;
    } else {
        remove_button.disabled = false;
        clear_button.disabled = false;
    }
}

function clearListDisplay() {
    var table = document.getElementById("purch_summary");
    table.innerHTML = '';
    table.innerHTML = `<tr>
    <th>Volume (mL)</th>
    <th>Price per mL</th>
    </tr>`;
}



function showhide() {
    var x = document.getElementById("calculator");
    var y = document.getElementById("presetbuttons");
    if (x.style.display === "none") {
        x.style.display = "block";
        y.style.display = "none";
        x.value = "Numeric Keypad";
        document.getElementById("preset").value = "Numeric Keypad";
    } else {
        y.style.display = "block";
        x.style.display = "none";
        document.getElementById("preset").value = "Preset Values";
    }
}
function getchange() {
    var total = document.getElementsByName('total')[0].value;
    var cash = document.getElementsByName('cash')[0].value;
    var vol_purchased = document.getElementById('vol_purchased');
    var change = (+cash) - (+total);
    document.getElementsByName('change')[0].value = change;
    vol_purchased.value = document.getElementById('outputmL').value;
}

function setText(obj) {
    var val = obj.value;
    console.log(val);
    document.getElementById('textBox').value = val;
    document.getElementById('outputmL').value = val * 25;
}

function Volumeconvert(valNum) {
    var volume_value = valNum * 25;
    document.getElementById('outputmL').value = volume_value;
    console.log(volume_value);
}

window.onload = function () {
    document.myform.scan.focus();
    document.getElementById('calculator').style.display = 'none';
}

function getHistory() {
    return document.getElementById("history-value").innerText;
}
function printHistory(num) {
    document.getElementById("history-value").innerText = num;
}
function getOutput() {
    return document.getElementById("amount_display").value;
}
function printOutput(num) {
    if (num == "") {
        document.getElementById("amount_display").value = num;
    }
    else {
        document.getElementById("amount_display").value = getFormattedNumber(num);
    }
}
function getFormattedNumber(num) {
    if (num == "-") {
        return "";
    }
    var n = Number(num);
    var value = n.toLocaleString("en");
    return value;
}
function formatNum(num) {
    return Number(num.replace(/,/g, ''));
}

//
// function newacc(){
//   swal({
//     title: "Register New User",
//     text: "Please enter the student number:",
//     type: "input",
//     showCancelButton: true,
//     closeOnConfirm: false,
//     inputPlaceholder: "Student Number"
//   }, function (inputValue) {
//     if (inputValue === false) return false;
//     if (inputValue === "") {
//       swal.showInputError("Please enter the student number!");
//       return false
//     }
//     swal("Success!", "Student Number: " + inputValue, "success");
//   });
// }
