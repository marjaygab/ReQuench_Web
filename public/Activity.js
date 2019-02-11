$('document').ready(function() {
  //init start and date depending on earliest and latest activity of user
  var start_date;
  var end_date;
  var session_var = sessionStorage.getItem('JSON_Response');
  var jsonobj = JSON.parse(session_var);
  var no_activity_banner = document.getElementById('no_activity_banner');
  var list_items_div = document.getElementById('list_items_div');
  //set start and end date here depending on values
  var selected_cat = 'Date';
  var selected_order = 'Descending';
  var start;
  var end;
  var list;
  var all_list;
  var current_list;
  $(".category-item").click(function(){
    selected_cat = $(this).text();
    $("#dropdownMenuButtonCat").html(selected_cat);
    filter(list,selected_cat,selected_order,function(temp_array){
      if (temp_array.length > 0) {
        clearList(list_items_div);
        no_activity_banner.style.display = "none";
        list = temp_array;
        var size = temp_array.length;
        if (size >=5) {
          size = 5;
        }
        for (var i = 0; i < size; i++) {
          if (list[i].Visible == 'true') {
            if (list[i].Transaction_ID != null) {
              addListItem(list[i].Date,list[i].Time,list[i].Machine_Location,"Dispensed " + list[i].Temperature + " Water",list[i].Amount,'#list_items_div');
            }else{
              addListItem(list[i].Date,list[i].Time,null,"Bought ReQuench Points",list[i].Amount,'#list_items_div');
            }
          }
        }
      }
    });
  });

  $(".order-item").click(function(){
    selected_order = $(this).text();
    $("#dropdownMenuButtonOrd").html(selected_order);
    filter(list,selected_cat,selected_order,function(temp_array) {
      if (temp_array.length > 0) {
        clearList(list_items_div);
        no_activity_banner.style.display = "none";
        list = temp_array;
        var size = temp_array.length;
        if (size >=5) {
          size = 5;
        }
        for (var i = 0; i < size; i++) {
          if (list[i].Visible == 'true') {
            if (list[i].Transaction_ID != null) {
              addListItem(list[i].Date,list[i].Time,list[i].Machine_Location,"Dispensed " + list[i].Temperature + " Water",list[i].Amount,'#list_items_div');
            }else{
              addListItem(list[i].Date,list[i].Time,null,"Bought ReQuench Points",list[i].Amount,'#list_items_div');
            }
          }
        }
      }
    });
  });


    fetchHistory(jsonobj.Account_Details.Acc_ID,function(temp_array) {
      all_list = temp_array.slice();
      list = all_list.slice();
      if (temp_array.length > 0) {
        no_activity_banner.style.display = "none";
        list = temp_array;

        for (var i = 0; i < list.length; i++) {
          list[i].Visible = 'true';
        }

        list.sort(compByDateDesc);
        var size = temp_array.length;
        if (size >=5) {
          size = 5;
        }
        for (var i = 0; i < size; i++) {
          if (list[i].Visible == 'true') {
            if (list[i].Transaction_ID != null) {
              addListItem(list[i].Date,list[i].Time,list[i].Machine_Location,"Dispensed " + list[i].Temperature + " Water",list[i].Amount,'#list_items_div');
            }else{
              addListItem(list[i].Date,list[i].Time,null,"Bought ReQuench Points",list[i].Amount,'#list_items_div');
            }
          }
        }
      }
    });


    $('input[name="daterange"]').daterangepicker({
      opens: 'left'
    }, function(start, end, label) {
      clearList(list_items_div);
      console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
      no_activity_banner.style.display = "none";
      list.sort(compByDateDesc);
      var start_date = start.format('YYYY-MM-DD');
      var end_date = end.format('YYYY-MM-DD');
      var temp_array = [];


      for (var i = 0; i < list.length; i++) {
        if (Date.parse(start.format('YYYY-MM-DD')) <= Date.parse(list[i].Date) && Date.parse(end.format('YYYY-MM-DD')) >= Date.parse(list[i].Date))
          list[i].Visible = 'true';
        else
          list[i].Visible = 'false';
      }

      var size = list.length;
      for (var i = 0; i < size; i++) {
        if (list[i].Visible == 'true') {
          if (list[i].Transaction_ID != null) {
            addListItem(list[i].Date,list[i].Time,list[i].Machine_Location,"Dispensed " + list[i].Temperature + " Water",list[i].Amount,'#list_items_div');
          }else{
            addListItem(list[i].Date,list[i].Time,null,"Bought ReQuench Points",list[i].Amount,'#list_items_div');
          }
        }
      }
    });

});


function filter(list,cat,order,fn) {
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


function addListItem(date,time,location,description,amount,id) {
  var loc = location;
  if (location == null) {
    loc = "";
  }
  var string =  `<li class="list-group-item item">
    <div class="row">
      <div class="col-sm-3">
        <h5>${date}</h5>
        <p>${time}</p>
      </div>
      <div class="col-sm-7">
        <h5 style="display:inline;">${description}</h5>
        <p>${loc}</p>
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

function fetchHistory(account_id,set) {
    var params = {};
    params.Acc_ID = account_id;

    requestHttp('POST','https://requench-rest.herokuapp.com/Fetch_History.php',params,function(e) {
      if (this.readyState == 4 && this.status == 200) {
        var response = this.responseText;
        response = response.slice(1,-1);
        if (response != null) {
          var json_object = JSON.parse(response);
          var temp_array = [];
          for (var i = 0; i < json_object.Transactions.length; i++) {
            temp_array.push(json_object.Transactions[i]);
          }
          for (var i = 0; i < json_object.Purchase.length; i++) {
            temp_array.push(json_object.Purchase[i]);
          }
          set(temp_array);
        }
      }
    });
}
