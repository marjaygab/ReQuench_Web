var submit_button = document.getElementById('submit_button');
var cancel_button = document.getElementById('cancel_button');
var id_field = document.getElementById('id_no');
var uname_field = document.getElementById('u_name');
var fname_field = document.getElementById('f_name');
var lname_field = document.getElementById('l_name');
var email_field = document.getElementById('email');
var pass_field = document.getElementById('pass');




submit_button.onclick = function() {
  //submit data here
  params = {};
  console.log("Submit Button Clicked");
  params.ID_No = id_field.value;
  params.User_Name = uname_field.value;
  params.First_Name = fname_field.value;
  params.Last_Name = lname_field.value;
  params.Email = email_field.value;
  params.Password = pass_field.value;
  console.log(params);
  //put Form validation here
  // if (validated()) {
  //   put here request http to Login.php
  // }

}

cancel_button.onclick = function() {
  //clear all the data first
    params = {};
    window.location.href = "index.html";
}
