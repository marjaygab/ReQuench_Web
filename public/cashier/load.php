<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">
    <title>Cashier</title>
    <link rel="stylesheet" href="cashier.css">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js"></script>
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
</head>
  <body background="assets/images/background_3.jpg">
    <center>
      <!-- <a href="#home"><img src="assets/images/logo.png" class="topleft"></a> -->
      <h3 id="header" class="title">ReQuench: A DLSL Water Vending Machine</h3>
    </center>
  <div class="column">

    <div class="account">
      <form name="myform" method="post">
        <input type="text" name="scan" id="scan">
        <input type="submit" class="btn btn-success" value="Enter" id="enter" name="enter"/>
      </form>
      <?php
        session_start();
        include 'ConnectDB.php';

        if (isset($_POST["enter"]))
        {
        $scan = (int) $_POST['scan'];
        $_SESSION['scan']= $scan;

        $SQL = "SELECT * FROM acc_users
        LEFT JOIN unrecorded_users
        ON acc_users.ID_Number= unrecorded_users.ID_Number
        WHERE ID_Number= '$scan'";
        $result = mysqli_query($conn,$SQL);
        $data= mysqli_fetch_assoc($result);
        $countrow= mysqli_num_rows($result);

        if ($countrow>=1){
          $stud_name= $data['First_Name'];
          $current = $data['Balance'];
          $_SESSION['current']=$current;
          ?>
          <h6 class="text_account">Account Name/Stud Number: <?php echo $stud_name; ?> </h6>
          <h6 class="text_account">Available Balance: <?php echo $current; ?></h6>
          <?php
        }
        else if($countrow==0){
          ?>
          <form name="myform" method="post">
            <input type="text" name="input" id="input">
            <input type="submit" class="btn btn-success" value="Add Account" id="Add" name="Add"/>
          </form>
          <?php
          if (isset($_POST["Add"]))
          {
            $input_id = (int) $_POST['input'];
            $scan = $_SESSION['scan'];

        mysqli_query($conn,"INSERT INTO`unrecorded_users`(`UU_ID`, `RFID_ID`, `ID_Number`, `Balance`) VALUES ('','$scan','$input_id','');")
        or die(mysqli_error($conn));
        $stud_name= $data['ID_Number'];
        $current = $data['Balance'];
        $_SESSION['current']=$current;
      }}

      }

        if (isset($_POST["nexttransaction"]))
        {
          $current = (int) $_SESSION['current'];
          $scan = $_SESSION['scan'];
          $vol_purchased = (int) $_POST['vol_purchased'];
          $updated= $current + $vol_purchased;
          $query  = "UPDATE acc_users SET Balance='$updated' WHERE Student_Number ='$scan'";
          mysqli_query($conn, $query)
          or die(mysqli_error($conn));
        }
      ?>
    </div>
    <center>
      <div>
        <p>Amount ( P ):
          <input id="textBox" name="textBox" class="infield"  oninput="Volumeconvert(this.value)" onchange="Volumeconvert(this.value)"/>
        </p>
        <p>Volume (mL):
          <input id="outputmL" class="infield" type="text"  readonly/>
        </p>
      </div>
      <div id="option" class="separator">
        <input id="preset" type="button" class="btn default btn-lg option" value="Numeric Keypad" onclick="showhide()"/>
      </div>
      <div id="calculator" >
        <button class="number" id="7">7</button>
        <button class="number" id="8">8</button>
        <button class="number" id="9">9</button>
        <button class="number" id="4">4</button>
        <button class="number" id="5">5</button>
        <button class="number" id="6">6</button>
        <button class="number" id="1">1</button>
        <button class="number" id="2">2</button>
        <button class="number" id="3">3</button>
        <button class="operator" id="backspace"><-</button>
        <button class="number" id="0">0</button>
        <button class="operator" id="equal" onclick="this.disabled = true;">OK</button>
      </div>
      <div class="separator" id="presetbuttons" >
        <button type="button" class="btn info btn-lg set1" value="10" onclick="setText(this)">P 10</button>
        <button type="button" class="btn info btn-lg set1" value="25" onclick="setText(this)">P 25</button>
        <button type="button" class="btn info btn-lg set1" value="50" onclick="setText(this)">P 50</button>
        <button type="button" class="btn info btn-lg set1" value="75" onclick="setText(this)">P 75</button>
        <button type="button" class="btn info btn-lg set1" value="100" onclick="setText(this)">P 100</button>
        <button type="button" class="btn info btn-lg set1" value="150" onclick="setText(this)">P 150</button>
        <input id="btnSubmit" type="button" class="btn btn-success btn-lg confirm" value="CONFIRM" onclick="this.disabled = true;"/>
      </div>
  </center>
  </div>

  <div class="rightcolumn">
    <center>
    <div class="table" style="height:220px;width:80%;margin-top:20px;">
    <table id="purch_summary" class="table" style="width:100%;background-color: none">
      <tr>
        <th>Volume (mL)</th>
        <th>Price per mL</th>
      </tr>
    </table>
    </div>
    <center>
    <form name="" method="POST" action="">
      <div class="table1" style="height:250px;width:50%;margin-top:20px">
      <table id= "purch_sub" class="table">
          <tr>
            <th>Total</th>
            <td><input type="text" name="total" id="total" class="cash" ></td>
            <!-- total volume purchased -->
            <td><input type="hidden" name="vol_purchased" id="vol_purchased" class="cash" value="vol_purchased"></td>
          </tr>
          <tr>
            <th>Cash</th>
            <td><input type="text" name="cash" id="cash" class="cash" onchange="getchange()"></td>
          </tr>
          <tr>
            <th>Change</th>
            <td><input type="text" name="change" id="change" class="cash" ></td>
          </tr>
        </table>
        <div class="bottom">
          <input id="cancel" type="submit" class="btn btn-danger btn-lg" value="Cancel"/>
          <input id="nexttransaction" name="nexttransaction" type="submit" class="btn btn-warning btn-lg" value="Next Transaction" />
        </div>
      </center>
      </div>
    </form>
  </div>
</body>
<script src="main.js"></script>
<script type="text/javascript" src="HttpRequest.js"></script>
<script type="text/javascript" src="sweetalert2.all.min.js"></script>
</html>
