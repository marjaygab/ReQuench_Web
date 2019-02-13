table1 = document.getElementById("purch_summary");
table2 = document.getElementById("purch_sub");
var confirm = document.getElementById("add_item");
var pay = document.getElementById("pay");
var cancel = document.getElementById("cancel");
var total= 0;
var idno= document.getElementById("Input_ID_btn");
var header = document.getElementById('header');
var enter_rfid = document.getElementById('enter_rfid');
var add_links = document.getElementsByClassName('add_links');
var rfid_field = document.getElementById('rfid_field');
var current_list = [];

var unit = {
    ml:true,
    price:false,
    selected: function() {
        if (this.ml) {
            return 'ml';
        } else {
            return 'price';
        }
    }
};
var method = {
    preset:true,
    keypad:false,
    selected: function() {
        if (this.preset) {
            return 'preset';
        } else {
            return 'keypad';
        }
    }
};




rfid_field.onkeypress = function(e) {
    if (e.keyCode == 13) {
        var params = {};
        params.RFID_ID = rfid_field.value;
        requestHttp('POST','https://requench-rest.herokuapp.com/Customer_Login.php',params,function(e) {
            if (this.readyState == 4 && this.status == 200) {
                var response = this.responseText;
                if (response != null) {
                    console.log(response);
                }
            }
        });
    }
}


enter_rfid.onclick = function(){
    var params = {};
    params.RFID_ID = rfid_field.value;
    requestHttp('POST','https://requench-rest.herokuapp.com/Customer_Login.php',params,function(e) {
    if (this.readyState == 4 && this.status == 200) {
        var response = this.responseText;
        if (response != null) {
            console.log(response);
        }
    }
    });
}


for (let index = 0; index < add_links.length; index++) {
    const element = add_links[index];
    element.onclick = function() {
        console.log(this.id);
        var perml = 2;
        var volume;
        var price;
        var newRow = table1.insertRow(table1.rows.length);
    
        var list_item = {
            volume:0,
            price:0,
            isSelected:false
        };
            list_item.price = parseInt(this.id);
            list_item.volume = list_item.price/perml;
        current_list.push(list_item);
        
        var cell1 = newRow.insertCell(0);
        cell1.innerHTML = list_item.volume;
        var cell2 = newRow.insertCell(1);
        cell2.innerHTML = list_item.price;
        
        newRow.onclick = function() {
            console.log('Test Click: ' + this.rowIndex);
            if (this.style.backgroundColor != 'deepskyblue') {
                this.style.backgroundColor = 'deepskyblue';
                console.log(`List Item ${current_list[this.rowIndex-1].volume}`);
                
            }else{
                this.style.backgroundColor = '#fff';
            }
        }
    }
    
}



$('#toggle-method').change(function() {
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

$('#toggle-unit').change(function() {
    if ($(this).prop('checked')) {
        unit.ml = true;
        unit.price = false;
        
    } else {
        unit.ml = false;
        unit.price = true;
    }
    console.log(unit.selected());
 });


confirm.addEventListener("click", function (event) {
    var perml = 2;
    var volume;
    var price;
    var newRow = table1.insertRow(table1.rows.length);

    var list_item = {
        volume:0,
        price:0,
        isSelected:false
    };

    if (unit.selected() == 'ml') {
        list_item.volume = parseInt(document.getElementById('amount_display').value);
        list_item.price = list_item.volume*perml;
    } else {
        list_item.price = parseInt(document.getElementById('amount_display').value);
        list_item.volume = list_item.price/perml;
    }
    current_list.push(list_item);
    console.log(list_item);
    
    var cell1 = newRow.insertCell(0);
    cell1.innerHTML = list_item.volume;
    var cell2 = newRow.insertCell(1);
    cell2.innerHTML = list_item.price;
    
    newRow.onclick = function() {
        console.log('Test Click: ' + this.rowIndex);
        if (this.style.backgroundColor != 'deepskyblue') {
            this.style.backgroundColor = 'deepskyblue';
            console.log(`List Item ${current_list[this.rowIndex-1].volume}`);
            
        }else{
            this.style.backgroundColor = '#fff';
        }
    }

    // var x = document.getElementById('textBox').value ;
    // document.getElementById("total").value = x;
    // var y = document.getElementById('outputmL').value ;
    // document.getElementById("vol_purchased").value = y;
});

equal.addEventListener("click", function (event) {
  var newRow = table1.insertRow(table1.rows.length);
  var cell1 = newRow.insertCell(0);
  cell1.innerHTML = document.getElementById('outputmL').value ;
  var cell2 = newRow.insertCell(1);
  cell2.innerHTML = "25";
  var x = document.getElementById('textBox').value ;
  document.getElementById("total").value = x;
  var y = document.getElementById('outputmL').value ;
  document.getElementById("vol_purchased").value = y;
});
cancel.addEventListener("click", function (event) {
location.reload();
});


var operator = document.getElementsByClassName("operator");
for(var i =0;i<operator.length;i++){
	operator[i].addEventListener('click',function(){
		if(this.id=="clear"){
			printHistory("");
			printOutput("");
		}
		else if(this.id=="backspace"){
			var output=reverseNumberFormat(getOutput()).toString();
			if(output){//if output has a value
				output= output.substr(0,output.length-1);
				printOutput(output);
			}
		}
		else{
			var output=getOutput();
			var history=getHistory();
			if(output==""&&history!=""){
				if(isNaN(history[history.length-1])){
					history= history.substr(0,history.length-1);
				}
			}
			if(output!="" || history!=""){
				output= output==""?output:reverseNumberFormat(output);
				history=history+output;
				if(this.id=="="){
					var result=eval(history);
					printOutput(result);
					printHistory("");
				}
				else{
					history=history+this.id;
					printHistory(history);
					printOutput("");
				}
			}
		}

	});
}
var number = document.getElementsByClassName("number");
for(var i =0;i<number.length;i++){
	number[i].addEventListener('click',function(){
		var output=reverseNumberFormat(getOutput());
		if(output!=NaN){ //if output is a number
			output=output+this.id;
			printOutput(output);
      Volumeconvert(output);
		}
	});
}

function showhide() {

  var x = document.getElementById("calculator");
  var y = document.getElementById("presetbuttons");
  if (x.style.display === "none") {
    x.style.display = "block";
    y.style.display = "none";
    x.value="Numeric Keypad";
    document.getElementById("preset").value="Numeric Keypad";
  } else {
   y.style.display = "block";
    x.style.display = "none";
    document.getElementById("preset").value="Preset Values";
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

function setText(obj){
  var val = obj.value;
  console.log(val);
  document.getElementById('textBox').value = val;
  document.getElementById('outputmL').value=val*25;
}

function Volumeconvert(valNum) {
  var volume_value = valNum*25;
  document.getElementById('outputmL').value=volume_value;
  console.log(volume_value);
}

window.onload = function() {
  document.myform.scan.focus();
  document.getElementById('calculator').style.display = 'none';
}

function getHistory(){
	return document.getElementById("history-value").innerText;
}
function printHistory(num){
	document.getElementById("history-value").innerText=num;
}
function getOutput(){
	return document.getElementById("textBox").value;
}
function printOutput(num){
	if(num==""){
		document.getElementById("textBox").value=num;
	}
	else{
		document.getElementById("textBox").value=getFormattedNumber(num);
	}
}
function getFormattedNumber(num){
	if(num=="-"){
		return "";
	}
	var n = Number(num);
	var value = n.toLocaleString("en");
	return value;
}
function reverseNumberFormat(num){
	return Number(num.replace(/,/g,''));
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
