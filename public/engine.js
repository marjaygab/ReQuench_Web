let $ = require("jquery");
let {PythonShell} = require('python-shell');
let path = require('path');
let current_ml_dispensed = 0;
$(document).ready(main);


function main(){
  let Swal = require('sweetalert2');
  var interval;
  var toggle_state = true;

  $('#toggle_switch').bootstrapToggle('on');
  $("button").click(function(){
    var current = $(this).text();
    var current_id = $(this).attr("id");
    console.log(current+ " " + current_id);

    if (toggle_state == 'Manual') {
      //do things for manual dispensing
      var data = {};
      switch (current_id) {
        case "hot-button":
        if(current=="Hot"){
          data.command = 'start';
          $('#toggle_switch').bootstrapToggle('disable');
          $(this).removeClass().addClass("btn");
          // interval = setInterval(mouseaction,100,current_ml_dispensed);
          interval = setInterval(tester,100);
          $(this).text("Stop");
          $("#cold-button").prop('disabled',true);
        }else{
          data.command = 'stop';
          $('#toggle_switch').bootstrapToggle('enable');
          $(this).removeClass().addClass("btn btn-danger");
          $(this).text("Hot");
          clearInterval(interval);
          $("#cold-button").prop('disabled',false);
        }
          break;
        case "cold-button":
        if(current=="Cold"){
          data.command = 'start';
          $('#toggle_switch').bootstrapToggle('disable');
          $(this).removeClass().addClass("btn");
          interval = setInterval(mouseaction,200,current_ml_dispensed);
          $(this).text("Stop");
          $("#hot-button").prop('disabled',true)
        }else{
          data.command = 'stop';
          $('#toggle_switch').bootstrapToggle('enable');
          $(this).removeClass().addClass("btn btn-primary");
          $(this).text("Cold");
          clearInterval(interval);
          $("#hot-button").prop('disabled',false)
        }
          break;
        default:
          break;
      }

    }else{
      //do things for automatic dispensing
      var amount = 0.00;
      Swal({
        title: 'Amount',
        html:
          'Enter the amount of water to be dispensed:<br/><br/><button id="decrease" class="btn btn-info"><strong>-</strong></button>' +
          '<input type="text" id=amount>' +
          '<button id="increase" class="btn btn-danger"><strong>+</strong></button>',
        confirmButtonText:'Dispense',
        onBeforeOpen: () => {
          const content = Swal.getContent();
          const $ = content.querySelector.bind(content);

          const input = $('#amount');
          const stop = $('#stop');
          const increase = $('#increase');
          content.querySelector("#amount").value= amount;

          decrease.onclick = function() {
            const content = Swal.getContent();
            const $ = content.querySelector.bind(content);
            const input = $('#amount');
            if (amount > 0) {
              amount--;
              content.querySelector("#amount").value = amount;
            }
          }
          increase.onclick = function() {
            const content = Swal.getContent();
            const $ = content.querySelector.bind( content);
            const input = $('#amount');
            amount++;
            content.querySelector("#amount").value = amount;
          }

        },
        onClose: () => {
          console.log(amount + "  mL");
          autostartdispense(amount,function(message) {
            console.log(message);
          });
          amount = 0;
        }
      });


    }
  });


  $('#toggle_switch').change(function() {
    if ($(this).prop('checked') == false) {
        toggle_state = 'Manual';
    }else{
      toggle_state = 'Automatic';
    }
    console.log(toggle_state);
  });
  
  window.onbeforeunload = function(e){
    PythonShell.terminate();
  }

}

function mouseaction(){
  var height = $("#water-level").height();
  height-=10;
  $("#water-level").animate({height:height+'px'});
  startdispense(display_output);
}

function display_output() {
  console.log('Value: ' + current_ml_dispensed);
}

function startdispense(callback) {
  var options = {
    scriptPath: path.join(__dirname,'/python_scripts'),
    args : [current_ml_dispensed]
  }
  var filename = 'manual_dispense.py';
  var py_object = new PythonShell(filename,options);

  PythonShell.run(filename, options, function (err, results) {
    if (err) throw err;
    current_ml_dispensed = results[0];
    callback();
  });

}

function tester() {
  console.log('This is a test');
}

function autostartdispense(amount,callback) {
  var options = {
    scriptPath: path.join(__dirname,'/python_scripts'),
    args : [amount]
  }
  var filename = 'test1.py';
  var filename2 = 'test2.py';
  var py_object = new PythonShell(filename,options);
  var py_object2 = new PythonShell(filename2,options);

  py_object.on('message', function (message) {
    callback(message);
  });

  py_object.end(function (err,code,signal) {
    if (err) throw err;
  });

}
