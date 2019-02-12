
$('document').ready(function() {

  var home_button = document.getElementById('home_button');
  var about_button = document.getElementById('about_button');
  var contact_button = document.getElementById('contact_button');
  var login_button = document.getElementById("login_button");
  var signup_button = document.getElementById("signup_button");


    function authorize(al,jsobj) {
      if (al == 'USER') {
        sessionStorage.setItem('JSON_Response',jsobj);
        window.location.href = 'Summary.html';
      }else if (al == 'ADMIN') {
        sessionStorage.setItem('JSON_Response',jsobj);
        console.log('ADMIN');
        window.location.href = 'Admin_Summary.html';
      }else if (al == 'CASHIER') {
        sessionStorage.setItem('JSON_Response',jsobj);
        window.location.href = 'cashier/load.php';
      }else{

      }
    }

  firebase.auth().onAuthStateChanged(function(user) {
    console.log(user);
    
    if (user) {
      //check if email is present in the backend server
      console.log('State Changed');
      
      params = {};
      params.Email = user.email;
      Swal({
        title: 'Redirecting....',
        onBeforeOpen: () =>{
          Swal.showLoading();
        }
      });
      requestHttp('POST',"https://requench-rest.herokuapp.com/Email_Check.php",params,function(e){
        if (this.readyState == 4 && this.status == 200) {
          var response = this.responseText;

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
    } else {
      // No user is signed in.
    }
  });






  signup_button.onclick = function() {
    window.location.href = "SignUpCard.html";
  }


  login_button.onclick = function() {
    //login button clicked
    const provider = new firebase.auth.GoogleAuthProvider();

    Swal({
    html:  '<img src="assets/images/logoname.png" style="width:200px;"><br/>'+
      '<input id="user_field" type="text" name="User_Name" placeholder="Username" required class="form-control input-lg"/><br/>'+
      '<input id="pass_field" type="password" name="Password" placeholder="Password" required class="form-control input-lg" /><br/>'+
      '<a id="account_link" href="#">Create account</a>'+
      '<button id = "login_button" type="button" class="btn btn-primary">Log In</button>'+
      '<button id = "google_login_button" type="button" class="btn btn-danger">Sign in with Google</button>',
      showConfirmButton:false,
      width:'300px',
    onBeforeOpen: () => {
      const content = Swal.getContent()
      const $ = content.querySelector.bind(content)
      const user_field = $('#user_field');
      const pass_field = $('#pass_field');
      const create_account = $('#account_link');
      const login_button = $('#login_button');
      const google_login_button = $('#google_login_button');

      create_account.onclick = function(){
        //lead to sign up page

      }

      login_button.onclick = function(){
        //lead to sign up page
        const content = Swal.getContent();
        console.log(content.querySelector("#user_field").value);
        console.log(content.querySelector("#pass_field").value);
        var params = {};
        params.User_Name = content.querySelector("#user_field").value;
        params.Password = content.querySelector("#pass_field").value;
        requestHttp('POST',"https://requench-rest.herokuapp.com/Login.php",params,function(e){
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
      }
      google_login_button.onclick = function(){
        //lead to sign up page
        // var provider = new firebase.auth.GoogleAuthProvider();
        // firebase.auth().signInWithRedirect(provider);
        // var provider = new firebase.auth.GoogleAuthProvider();
        // firebase.auth().signInWithRedirect(provider);
        // firebase.auth().getRedirectResult().then(function(result) {
        //   var token = result.credential.accessToken;
        //   currentUser = result.user;
        //   console.log(token);
        // });
        firebase.auth().getRedirectResult().then(function (result) {
          if (result.credential) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            console.log(token);
            
            // The signed-in user info.
            var user = result.user;
          } 
          else {
            var provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithRedirect(provider);
        
           }
        }).catch(function (error) {
          // Handle Errors here.
          console.log(error);
        });
      }
    },
    onClose: () => {

    }
  });
  }





  home_button.onclick = function() {
      // refresh page
  }

  about_button.onclick = function() {
    // resize header container
    // Load About Page on Header
  }

  contact_button.onclick = function() {
    //resize header container
    // Load contact us page
  }



})
