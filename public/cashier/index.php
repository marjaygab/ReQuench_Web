<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
  	<link rel="stylesheet" href="assets/css/main.css">
    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
    <link rel="stylesheet" href="https://www.w3schools.com/lib/w3-theme-dark-grey.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
    <script src="https://www.gstatic.com/firebasejs/5.8.0/firebase.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <script>
      // Initialize Firebase
      var config = {
        apiKey: "AIzaSyCVk9YOp5EvIFVVLa8t4Gx48qwYe87PASY",
        authDomain: "requench-fireapp.firebaseapp.com",
        databaseURL: "https://requench-fireapp.firebaseio.com",
        projectId: "requench-fireapp",
        storageBucket: "requench-fireapp.appspot.com",
        messagingSenderId: "793188493760"
      };
      firebase.initializeApp(config);
    </script>
  </head>
  <body id="body_id">
    <title>ReQuench</title>

<!-- Navbar -->
<nav class="w3-top navbar navbar-expand-lg navbar-dark bg-dark">
  <a class="navbar-brand" href="#">
    <img src="assets/images/logo.png" width="35" height="30" alt="">
  </a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarNav">
    <ul class="navbar-nav">
      <li class="nav-item active">
        <a id="home_button" class="nav-link" href="#">Home</a>
      </li>
      <li class="nav-item">
        <a id="about_button" class="nav-link" href="#about">About</a>
      </li>
      <li class="nav-item">
        <a id="contact_button" class="nav-link" href="#contact">Contact Us</a>
      </li>
      <!-- for disabling nav bar button -->
      <!-- <li class="nav-item">
        <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
      </li> -->
    </ul>
  </div>
</nav>

<!-- center title -->
<div id="header_container" class="container">
  <img class="image_banner" id="image_banner" src="assets/images/BrandwLogo.png" alt="">
  <h1 id="header_label">A DLSL Water Vending Machine</h1>
  <div class="container button_header_container">
    <button id="login_button" class="btn btn-info header_button" type="button" name="button">Log In</button>
    <button id="signup_button" class="btn btn-danger header_button" type="button" name="button">Create an Account</button>
  </div>
</div>

<!-- About -->
<div class="w3-row-padding w3-padding-64 w3-theme-d5 w3-center" id="about">
  <div class="w3-padding-16"><span class="w3-xlarge w3-border-teal w3-bottombar">ABOUT</span></div>
  <p style="width:70%;margin:auto;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec pellentesque elementum aliquet. Aenean non tortor pellentesque, euismod quam ac, euismod diam. Phasellus egestas ligula et risus commodo, et luctus dui dapibus. In tellus mauris, tincidunt a sem suscipit, bibendum dictum orci. Proin vel metus odio. Aliquam sit amet nisi at ex luctus interdum vitae laoreet mauris. Etiam eget erat porta ligula vulputate consequat. Etiam ac justo urna. Nam hendrerit ut dui vel sollicitudin. Morbi et tortor non augue vestibulum facilisis. Nunc vel pharetra sapien, et lacinia risus. In hac habitasse platea dictumst. In hac habitasse platea dictumst. Mauris auctor hendrerit posuere. Cras ac orci a sapien scelerisque laoreet. Sed at molestie lacus.</p>
  <p style="width:70%;margin:auto;">Praesent vel maximus justo. Proin sit amet rhoncus neque, at viverra lorem. Mauris lacinia justo quis nibh auctor porttitor. Nullam porttitor elit non dictum cursus. Ut ac eros vitae purus pharetra tristique. Nam viverra nunc id metus euismod pulvinar. Sed ut scelerisque elit. Donec laoreet mattis nibh eget blandit.</p>
</div>

<!-- Team Container -->
<div class="w3-row-padding w3-padding-64 w3-theme w3-center">

<div class="w3-padding-16"><span class="w3-xlarge w3-border-teal w3-bottombar">OUR TEAM</span></div>
<p>Meet the team:</p>

<div class="w3-row"><br>

<div class="w3-third">
  <img src="leader.jpg" alt="Boss" style="width:45%" class="w3-circle w3-hover-opacity">
  <h3>Marjay Gabriel Tapay</h3>
  <p>insert description</p>
  <a class="im w3-button w3-large w3-teal" href="https://www.facebook.com/frozenpenofmind" title="Facebook"><i class=" fa-lg fa fa-facebook"></i></a>
  <a class="im w3-button w3-large w3-teal" href="https://twitter.com/MarjayGab" title="Twitter"><i class="fa-lg fa fa-twitter"></i></a>
  <a class="im w3-button w3-large w3-teal" href="https://www.instagram.com/marjaygab/?hl=en" title="Instagram"><i class="fa-lg fa fa-instagram"></i></a>
</div>

<div class="w3-third">
  <img src="hardware.jpg" alt="Boss" style="width:45%" class="w3-circle w3-hover-opacity">
  <h3>Steven Daniel Lara</h3>
  <p>insert description</p>
  <a class="im w3-button w3-large w3-teal" href="https://www.facebook.com/vienlara" title="Facebook"><i class=" fa-lg fa fa-facebook"></i></a>
  <a class="im w3-button w3-large w3-teal" href="#" title="Twitter"><i class="fa-lg fa fa-twitter"></i></a>
  <a class="im w3-button w3-large w3-teal" href="https://www.instagram.com/viennnyboy/?hl=en" title="Instagram"><i class="fa-lg fa fa-instagram"></i></a>

</div>

<div class="w3-third">
  <img src="software.jpg" alt="Boss" style="width:45%" class="w3-circle w3-hover-opacity">
  <h3>Loren Joyce Mendoza</h3>
  <p>insert description</p>
<a class="im w3-button w3-large w3-teal" href="https://www.facebook.com/lorenjoyce" title="Facebook"><i class=" fa-lg fa fa-facebook"></i></a>
<a class="im w3-button w3-large w3-teal" href="https://twitter.com/mlorenjoyce" title="Twitter"><i class="fa-lg fa fa-twitter"></i></a>
<a class="im w3-button w3-large w3-teal" href="https://www.instagram.com/lorenjoycemendoza/?hl=en" title="Instagram"><i class="fa-lg fa fa-instagram"></i></a>
</div>

</div>
</div>

<!-- Contact Container -->
<div class="w3-container w3-padding-64 w3-theme-l4" id="contact">
  <div class="w3-row">
    <div class="w3-col m5">
    <div class="w3-padding-16"><span class="w3-xlarge w3-border-teal w3-bottombar">Contact Us</span></div>
      <h3>Address</h3>
      <p>Swing by for a cup of coffee, cold water or whatever.</p>
      <p><i class="fa fa-map-marker w3-text-teal w3-xlarge"></i>  De La Salle Lipa, Lipa City, Batangas</p>
      <p><i class="fa fa-phone w3-text-teal w3-xlarge"></i> +6391 2345 6789</p>
      <p><i class="fa fa-envelope-o w3-text-teal w3-xlarge"></i> ReQuench@gmail.com</p>
    </div>
    <div class="w3-col m7">
      <form class="w3-container w3-card-4 w3-padding-16 w3-white" action="/action_page.php" target="_blank">
      <div class="w3-section">
        <label>Name</label>
        <input class="w3-input" type="text" name="Name" required>
      </div>
      <div class="w3-section">
        <label>Email</label>
        <input class="w3-input" type="text" name="Email" required>
      </div>
      <div class="w3-section">
        <label>Message</label>
        <input class="w3-input" type="text" name="Message" required>
      </div>
      <input class="w3-check" type="checkbox" checked name="Like">
      <label>I Like it!</label>
      <button type="submit" class="w3-button w3-right w3-theme">Send</button>
      </form>
    </div>
  </div>
</div>
  </body>
  <script type="text/javascript" src="index.js"></script>
  <script type="text/javascript" src="HttpRequest.js"></script>
  <script type="text/javascript" src="sweetalert2.all.min.js"></script>
</html>
