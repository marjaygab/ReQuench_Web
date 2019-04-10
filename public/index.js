
$('document').ready(function () {

	var home_button = document.getElementById('home_button');
	var about_button = document.getElementById('about_button');
	var contact_button = document.getElementById('contact_button');
	var login_button = document.getElementById("login_button");
	var signup_button = document.getElementById("signup_button");
	var from_normal_login = false;
	var normal_login_email = '';
	function authorize(al, jsobj) {
		if (al == 'USER') {
			sessionStorage.setItem('JSON_Response', jsobj);
			window.location.href = 'Summary.html';
		} else if (al == 'ADMIN') {
			sessionStorage.setItem('JSON_Response', jsobj);
			console.log('ADMIN');
			window.location.href = 'Admin_Summary.html';
		} else if (al == 'CASHIER') {
			sessionStorage.setItem('JSON_Response', jsobj);
			window.location.href = 'cashier/Cashier.html';
		} else {

		}
	}

	$('.dropdown-menu').click(function (e) {
		e.stopPropagation();
	});


	firebase.auth().onAuthStateChanged(function (user) {
		console.log(user);
		if ( user != null) {
			//check if email is present in the backend server
			console.log('State Changed');
			params = {};
			params.Email = user.email;
			Swal({
				title: 'Redirecting....',
				onBeforeOpen: () => {
					Swal.showLoading();
				}
			});

			if (from_normal_login) {
				params.Email = normal_login_email
			}
			requestHttp('POST', "https://requench-rest.herokuapp.com/Email_Check.php", params, function (e) {
				if (this.readyState == 4 && this.status == 200) {
					var response = this.responseText;
					if (response != null) {
						console.log(response);
						var json_object = JSON.parse(this.response);
						if (json_object.Success == 'true') {
							var access_level = json_object.Account_Details.Access_Level
							authorize(access_level, this.response);
						}
						else {
							Swal({
								type: 'error',
								title: 'Login Failed!',
								text: 'Error 101: Either your username or password is incorrect.'
							});
						}
					}
				}
			});
		} else {
			// No user is signed in.
		}
	});


	signup_button.onclick = function () {
		window.location.href = "SignUpCard.html";
	}


	login_button.onclick = function () {
		//login button clicked
		const provider = new firebase.auth.GoogleAuthProvider();

		Swal({
			html: '<img src="assets/images/logoname.png" style="width:200px;"><br/>' +
				'<input id="user_field" type="text" name="User_Name" placeholder="Username" required class="form-control input-lg"/><br/>' +
				'<input id="pass_field" type="password" name="Password" placeholder="Password" required class="form-control input-lg" /><br/>' +
				'<a id="account_link" href="#">Create account</a>' +
				'<button id = "login_button" type="button" class="btn btn-primary">Log In</button>' +
				'<button id = "google_login_button" type="button" class="btn btn-danger">Sign in with Google</button>',
			showConfirmButton: false,
			width: '300px',
			onBeforeOpen: () => {
				const content = Swal.getContent()
				const $ = content.querySelector.bind(content)
				const user_field = $('#user_field');
				const pass_field = $('#pass_field');
				const create_account = $('#account_link');
				const login_button = $('#login_button');
				const google_login_button = $('#google_login_button');

				create_account.onclick = function () {
					//lead to sign up page

				}

				login_button.onclick = function () {
					//lead to sign up page
					const content = Swal.getContent();
					console.log(content.querySelector("#user_field").value);
					console.log(content.querySelector("#pass_field").value);
					var params = {};
					params.User_Name = content.querySelector("#user_field").value;
					params.Password = content.querySelector("#pass_field").value;

					requestHttps("https://requench-rest.herokuapp.com/Login.php", params, function (response) {
						var json_object = response;

						if (json_object.Success == 'true') {
							var access_level = json_object.Account_Details.Access_Level;
							
							if (access_level == 'ADMIN') {
								var token = response.Custom_Token;
							firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
								.then(function () {
									from_normal_login = true;
									normal_login_email = json_object.Account_Details.Email;
									return firebase.auth().signInWithCustomToken(token);
								})
								.then(() => {
									setTimeout(function() {
										console.log(response);
										authorize(access_level,JSON.stringify(response));
									},5000)
								})
								.catch(function (error) {
									// Handle Errors here.
									var errorCode = error.code;
									var errorMessage = error.message;
									console.log(error);
								});
						}
						else {
							
							Swal({
								type: 'error',
								title: 'Login Failed!',
								text: 'Error 102: Either your username or password is incorrect.'
							});
						}
					});
				}
				google_login_button.onclick = function () {
					//lead to sign up page
					var provider = new firebase.auth.GoogleAuthProvider();
					firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
						.then(function () {
							return firebase.auth().signInWithPopup(provider);
						})
						.then(function (result) {
							var token = result.credential.accessToken;
							var user = result.user;
							console.log(user.displayName + ":" + token);
						})
						.catch(function (error) {
							// Handle Errors here.
							var errorCode = error.code;
							var errorMessage = error.message;
							console.log(error);
						});
				}
			},
			onClose: () => {

			}
		});
	}





	home_button.onclick = function () {
		// refresh page
	}

	about_button.onclick = function () {
		// resize header container
		// Load About Page on Header
	}

	contact_button.onclick = function () {
		//resize header container
		// Load contact us page
	}



})
