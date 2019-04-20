$(document).ready(function() {
    //should have method to update data every reloading of another page
    var session_var = sessionStorage.getItem('JSON_Response');
    var jsonobj = JSON.parse(session_var);
    var params = {};
    params.Acc_ID = jsonobj.Account_Details.Acc_ID;
    console.log(params.Acc_ID);
    var profile_picture_div = document.getElementById('profile_picture');
    var fullnamelabel = document.getElementById('full_name');
    var id_num_field = document.getElementById('id_num_field');
    var user_field = document.getElementById('user_field');
    var firstname_field = document.getElementById('firstname_field');
    var lastname_field = document.getElementById('lastname_field');
    var pass_field = document.getElementById('pass_field');
    var email_field = document.getElementById('email_field');
    var edit_account = document.getElementById('edit_account');
    var edit_email = document.getElementById('edit_email');
    var update_photo = document.getElementById('update_photo');
    var change_pass_link = document.getElementById('change_pass_link');


    updateSessionVariable(params,function(response){
      console.log(response);
      var string_json = JSON.stringify(response);
      sessionStorage.setItem('JSON_Response',string_json);

      jsonobj = JSON.parse(sessionStorage.getItem('JSON_Response'));
      console.log(jsonobj);
      // jsonobj = session_var;
      var path = "url('.." + jsonobj.file_path +"')";
      profile_picture_div.style.backgroundImage = "url('https://requench-rest.herokuapp.com" + jsonobj.file_path +"')";
      var fullname = jsonobj.Account_Details.First_Name +' '+ jsonobj.Account_Details.Last_Name;
      console.log(fullname);
      fullnamelabel.innerHTML = fullname;
      user_field.value = jsonobj.Account_Details.User_Name;
      firstname_field.value = jsonobj.Account_Details.First_Name;
      lastname_field.value = jsonobj.Account_Details.Last_Name;
      id_num_field.value = jsonobj.Account_Details.ID_Number;
      email_field.value = jsonobj.Account_Details.Email;
    });

    var edit_mode = {
      accounts:false,
      email:false
    };

    update_photo.onclick = async function() {
      const {value: file} = await Swal({
        title: 'Select image',
        input: 'file',
        inputAttributes: {
          'accept': 'image/*',
          'aria-label': 'Upload your profile picture'
        }
      })

      if (file) {
        const reader = new FileReader
        reader.onload = (e) => {
          var str = e.target.result;
          var file_type = str.substring(0, str.indexOf(","))
          .substring(0, str.indexOf(";"))
          .substring(str.indexOf("/") + 1);
          str = str.substring(str.indexOf(",") + 1);
          Swal({
            title: 'You uploaded picture',
            imageUrl: e.target.result,
            imageAlt: 'The uploaded picture',
            confirmButtonText:'Submit',
            onBeforeOpen:() => {

            },
            onClose:() => {

            }
          }).then((result) => {
            if (result.dismiss == 'overlay') {

            }else{
              //upload picture here
              var params = {};
              params.Acc_ID = jsonobj.Account_Details.Acc_ID;
              params.file_name = jsonobj.Account_Details.Access_Level + '_' + params.Acc_ID + '.' +file_type;
              params.image_string = str;
              requestHttp('POST',"https://requench-rest.herokuapp.com/Upload_Image.php",params,function(e){
                if (this.readyState == 4 && this.status == 200) {
                  var response = this.responseText;
                  if (response != null) {
                    console.log(response);
                    var json_object = JSON.parse(response);
                    if (json_object.Update_Success == true) {
                      Swal({
                        type: 'success',
                        title: 'Profile Picture was changed!'
                      }).then((result) => {
                        var params = {};
                        params.Acc_ID = jsonobj.Account_Details.Acc_ID;
                        updateSessionVariable(params,function(response){
                          var string_json = JSON.stringify(response);
                          sessionStorage.setItem('JSON_Response',string_json);
                          jsonobj = JSON.parse(sessionStorage.getItem('JSON_Response'));
                          var path = "url('.." + jsonobj.file_path +"')";
                          profile_picture_div.style.backgroundImage = "url('../ReQuench_REST" + jsonobj.file_path +"')";
                        });
                      });
                    }else if (json_object.Update_Success == false) {
                      Swal({
                        type: 'error',
                        title: 'Oops..',
                        text: "Something went wrong! Please try again later."
                      });
                    }
                    else{
                      Swal({
                        type: 'error',
                        title: 'Oops..',
                        text: 'Something went Wrong! Please try again later.'
                      });
                    }
                  }else{
                    Swal({
                      type: 'error',
                      title: 'Oops..',
                      text: 'Something went Wrong! Please try again later.'
                    });
                  }
                }
              });
            }
          });
        }

        reader.readAsDataURL(file)
      }
    }


    edit_account.onclick = function() {
      if ($(this).attr('class') == 'fas fa-edit') {
        $(this).removeClass('fas fa-edit').addClass('far fa-save');
        $('#change_pass_link').removeClass('isDisabled');
        $('.account_details').prop('readonly',false);
        edit_mode.accounts = true;
      }else{
        $(this).removeClass('far fa-save').addClass('fas fa-edit');
        $('#change_pass_link').addClass('isDisabled');
        $('.account_details').prop('readonly',true);
        edit_mode.accounts = false;
        //do saving here
        var params = {};
        params.Command = 'accounts';
        params.Acc_ID = jsonobj.Account_Details.Acc_ID;
        params.ID_Number = id_num_field.value;
        params.User_Name = user_field.value;
        params.First_Name = firstname_field.value;
        params.Last_Name = lastname_field.value;
        requestHttp('POST',"https://requench-rest.herokuapp.com/Update_Account.php",params,function(e){
          if (this.readyState == 4 && this.status == 200) {
            var response = this.responseText;
            // response = response.slice(1,-1);
            if (response != null) {
              console.log(response);
              var json_object = JSON.parse(response);
              if (json_object.Update_Success == true) {
                updateSessionVariable(params,function(response){
                  var string_json = JSON.stringify(response);
                  sessionStorage.setItem('JSON_Response',string_json);
                  jsonobj = JSON.parse(sessionStorage.getItem('JSON_Response'));
                  console.log(jsonobj);
                  // jsonobj = session_var;
                  Swal({
                    type: 'success',
                    title: 'Account Changes Saved!'
                  });
                });
              }
              else{
                Swal({
                  type: 'error',
                  title: 'Oops..',
                  text: 'Something went Wrong! Please try again later.'
                });
              }
            }else{
              Swal({
                type: 'error',
                title: 'Oops..',
                text: 'Something went Wrong! Please try again later.'
              });
            }
          }
        });
      }
    }

    edit_email.onclick = function() {
      if ($(this).attr('class') == 'fas fa-edit') {
        $(this).removeClass('fas fa-edit').addClass('far fa-save');
        $('.email_details').prop('readonly',false);
        edit_mode.email = true;
      }else{
        $(this).removeClass('far fa-save').addClass('fas fa-edit');
        $('.email_details').prop('readonly',true);
        edit_mode.email = false;
        //do saving here
        var params = {};
        params.Command = 'email';
        params.Acc_ID = jsonobj.Account_Details.Acc_ID;
        params.Email = email_field.value;
        requestHttp('POST',"https://requench-rest.herokuapp.com/Update_Account.php",params,function(e){
          if (this.readyState == 4 && this.status == 200) {
            var response = this.responseText;
            // response = response.slice(1,-1);
            if (response != null) {
              console.log(response);
              var json_object = JSON.parse(response);

              if (json_object.Update_Success == true) {
                updateSessionVariable(params,function(response){
                  var string_json = JSON.stringify(response);
                  sessionStorage.setItem('JSON_Response',string_json);
                  jsonobj = JSON.parse(sessionStorage.getItem('JSON_Response'));
                  console.log(jsonobj);
                  // jsonobj = session_var;
                  Swal({
                    type: 'success',
                    title: 'Email Changes Saved!'
                  });
                });

              }
              else{
                Swal({
                  type: 'error',
                  title: 'Oops..',
                  text: 'Something went Wrong! Please try again later.'
                });
              }
            }else{
              Swal({
                type: 'error',
                title: 'Oops..',
                text: 'Something went Wrong! Please try again later.'
              });
            }
          }
        });

        //HTTP REQUEST FORMAT
        // requestHttp('POST',"https://requench-rest.herokuapp.com/Update_Account.php",params,function(e) {
        //   if (this.readyState == 4 && this.status == 200) {
        //     var response = this.responseText;
        //     if (response != null) {
        //       console.log(response);
        //       var json_object = JSON.parse(response);
              
        //     }
        //   }
        // });


      }
    }


    change_pass_link.onclick = function() {   
      if (edit_mode.accounts == true) {
        Swal({
        title: 'Change Password',
        width: 400,
        html: '<input id="Old_Password" type="password" name="Old_Password" placeholder="Old Password" required class="form-control input-lg"/><br/>'+
          '<input id="New_Password" type="password" name="New_Password" placeholder="New Password" required class="form-control input-lg"/><br/>'+
          '<input id="Retype_Password" type="password" name="Retype_Password" placeholder="Retype Password" required class="form-control input-lg"/><br/>',
        confirmButtonText:'Submit',
        onBeforeOpen: () => {
          const content = Swal.getContent()
          const $ = content.querySelector.bind(content)
          const old_pass_field = $('#Old_Password');
          const new_pass_field = $('#New_Password');
          const retype_pass_field = $('#Retype_Password');
        },
        onClose: () => {
          console.log('Closed');
        }
        }).then((result) => {
          //do login methods here
          if (result.dismiss == 'overlay') {
            console.log('Dismissed via Overlay');
          }else{
            const content = Swal.getContent();
            const old_password = content.querySelector("#Old_Password").value;
            const new_password = content.querySelector("#New_Password").value;
            const retype_password = content.querySelector("#Retype_Password").value;
            var params = {};
            params.Acc_ID = jsonobj.Account_Details.Acc_ID;
            params.Old_Password = old_password;
            params.New_Password = new_password;
            params.Retype_Password = retype_password;
            params.Command = 'password';
            console.log(params);
          }

          if (params.New_Password != params.Retype_Password) {
            Swal({
              type: 'error',
              title: 'Oops..',
              text: 'Something went Wrong! Please try again later.'
            });
          }else{
            requestHttp('POST',"https://requench-rest.herokuapp.com/Update_Account.php",params,function(e){
              if (this.readyState == 4 && this.status == 200) {
                var response = this.responseText;
                // response = response.slice(1,-1);

                if (response != null) {
                  console.log(response);
                  var json_object = JSON.parse(response);

                  if (json_object.Update_Success == true) {
                    Swal({
                      type: 'success',
                      title: 'Password was changed!'
                    });
                  }else if (json_object.Update_Success == false && json_object.Error == 'Mismatch') {
                    Swal({
                      type: 'error',
                      title: 'Oops..',
                      text: "The password you entered didn't match your Old Password"
                    });
                  }
                  else{
                    Swal({
                      type: 'error',
                      title: 'Oops..',
                      text: 'Something went Wrong! Please try again later.'
                    });
                  }
                }else{
                  Swal({
                    type: 'error',
                    title: 'Oops..',
                    text: 'Something went Wrong! Please try again later.'
                  });
                }
              }
            });
          }
        });
      }
    }

});
