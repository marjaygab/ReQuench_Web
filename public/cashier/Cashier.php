<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">
  <title>Cashier</title>
  <!-- Mobiscroll JS and CSS Includes -->
  <link rel="stylesheet" href="cashier.css">
</head>
<?php

if(isset($_GET['View'])){
  switch ($_GET['View']){

    case "scan_ID":
    ?>

    <form action="" method="POST">
      <div><input id="Input_ID" name="Input_ID" required /></div>
      <button id="Input_ID_btn" name="Input_ID_btn"  type="button" class="btn btn-warning btn-lg">OK</button>
    </form>

    <?php
    if (isset($_POST['Input_ID_btn']))
    {
      $SQL = "SELECT * FROM `acc_users` WHERE `Student_Number`= $Input_ID ";
      $result = mysqli_query($con,$SQL);
      $data= mysqli_fetch_assoc($result);
      echo "ii";
      header("Location: http://localhost/ReQuench/load.php");
    }
    break;

    case "load_account":
    include "ConnectDB.php";
    if (isset($_POST['Input_ID_btn']))
    {
      $SQL = "SELECT * FROM `acc_users` WHERE `Student_Number`= $Input_ID ";
      $result = mysqli_query($con,$SQL);
      $data= mysqli_fetch_assoc($result);

      $id = $data['Student_Number'];
      $bal = $data['Balance'];
      echo "lo";

      // header("Location: http://localhost/ReQuench/load.php");
      }
      break;
    }
  }
  ?>
</html>
