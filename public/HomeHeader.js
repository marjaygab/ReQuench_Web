var login_button = document.getElementById("login_button");
var signup_button = document.getElementById("signup_button");

function authorize(al,jsobj) {
  if (al == 'USER') {
    sessionStorage.setItem('JSON_Response',jsobj);
    window.location.href = 'Summary.html';
  }else if (al == 'ADMIN') {
    sessionStorage.setItem('JSON_Response',jsobj);
      // window.location.href = 'Admin.php';
  }else if (al == 'CASHIER') {
    sessionStorage.setItem('JSON_Response',jsobj);
    // window.location.href = 'Cashier.php';
  }else{

  }
}


signup_button.onclick = function() {
  //Sign up button clicked
  var opacity_val = 0;
    $("#header_container").css('opacity','0');
    $("#header_container").width("30%");
    $("#header_container").load("SignUpCard.html");
      $("#header_container").animate({
        width:"30%"
      },function() {
          $("#header_container").animate({
            opacity:1
          },function() {
            console.log("Animation Complete");
          });
      });
}


login_button.onclick = function() {
  //login button clicked
  // const provider = new firebase.auth.GoogleAuthProvider();
  // firebase.auth().signInWithRedirect(provider);
  Swal({
  title: 'Login',
  html:  '<img src="assets/images/logoname.png" style="width:200px;"><br/>'+
    '<input id="user_field" type="text" name="User_Name" placeholder="Username" required class="form-control input-lg"/><br/>'+
    '<input id="pass_field" type="password" name="Password" placeholder="Password" required class="form-control input-lg" /><br/>'+
    '<a id="account_link" href="#">Create account</a>',
  confirmButtonText:'Login',
  onBeforeOpen: () => {
    const content = Swal.getContent()
    const $ = content.querySelector.bind(content)
    const user_field = $('#user_field');
    const pass_field = $('#pass_field');
    const create_account = $('#account_link');

    create_account.onclick = function(){
      //lead to sign up page
      console.log("Test1");
    }
  },
  onClose: () => {
  }
  }).then((result) => {
    //do login methods here
    const content = Swal.getContent();
    console.log(content.querySelector("#user_field").value);
    console.log(content.querySelector("#pass_field").value);
    var params = {};
    params.User_Name = content.querySelector("#user_field").value;
    params.Password = content.querySelector("#pass_field").value;
    requestHttp('POST',"Login.php",params,function(e){
      if (this.readyState == 4 && this.status == 200) {
        var response = this.responseText;
        response = response.slice(1,-1);
        if (response != null) {
          console.log(response);
          var json_object = JSON.parse(this.response);
          if (json_object.Success == 'true') {
            var access_level = json_object.Account_Details.Access_Level
            authorize(access_level,this.response);
          }
          else{

            Swal({
              type: 'error',
              title: 'Login Failed!',
              text: 'Either your username or password is incorrect.'
            });
          }
          // window.location.href = 'User.php';
        }
      }
    });
  });
}
