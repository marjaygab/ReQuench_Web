

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

function requestHttpURL(method,url,parameters,fn) {
  var xhr = new XMLHttpRequest();
  var parameter_objects = {};
  xhr.timeout = 60000;
  xhr.open(method,url,true);
  xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded; charset=utf-8');
  var data = JSON.stringify(parameters);
  xhr.send(data);
  xhr.onreadystatechange = fn;
}

function requestHttps(URL,params,callback) {
  const otherParam = {
    headers:{
      "content-type":"application/json; charset=UTF-8"
    },
    body:JSON.stringify(params),
    method: "POST"
  }
  fetch(URL,otherParam)
  .then(res =>res.json())
  .then(data => callback(data))
  .catch(error => console.log(error));
}

function requestHttpsNoResponse(URL,params,callback) {
  const otherParam = {
    headers:{
      "content-type":"application/json; charset=UTF-8"
    },
    body:JSON.stringify(params),
    method: "POST"
  }
  fetch(URL,otherParam)
  .then(data => callback())
  .catch(error => console.log(error));
}



function updateSessionVariable(params,callback) {
  requestHttp('POST',"https://requench-rest.herokuapp.com/Update_Session.php",params,function(e){
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
