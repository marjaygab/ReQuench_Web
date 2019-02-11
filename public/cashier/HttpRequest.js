
function requestHttp(method,url,parameters,fn) {
    var xhr = new XMLHttpRequest();
    var parameter_objects = {};
    xhr.timeout = 60000;
    xhr.open(method,url,true);
    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
    var data = JSON.stringify(parameters);
    xhr.send(data);
    xhr.onreadystatechange = fn;
}

function requestHttpForm(method,url,parameters,fn) {
    var xhr = new XMLHttpRequest();
    var urlEncodedData = '';
    var urlEncodedDataPairs = [];
    for(name in parameters) {
      urlEncodedDataPairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(parameters[name]));
    }
    urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');
    // var parameter_objects = {};
     xhr.timeout = 60000;
     xhr.open(method,url,true);
     xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded; charset=utf-8');
     xhr.send(urlEncodedData);
     xhr.onreadystatechange = fn;

}


function updateSessionVariable(params,callback) {
  requestHttp('POST',"Update_Session.php",params,function(e){
    if (this.readyState == 4 && this.status == 200) {
      var response = this.responseText;
      response = response.slice(1,-1);
      if (response != null) {
        console.log(response);
        var json_object = JSON.parse(this.response);
        if (json_object.Success == 'true') {
          var access_level = json_object.Account_Details.Access_Level
          console.log(access_level);
          callback(json_object);
        }
      }
    }
  });
}
