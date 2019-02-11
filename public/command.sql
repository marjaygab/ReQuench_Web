SELECT accounts.Acc_ID,acc_levels.Access_Level FROM accounts
INNER JOIN acc_levels ON accounts.AL_ID = acc_levels.AL_ID
WHERE User_Name = $username AND Pass_word = $password

-- ADMIN

SELECT accounts.Acc_ID,accounts.User_Name,accounts.Password,acc_levels.Access_Level,acc_admin.Acc_Admin_ID,acc_admin.First_Name,acc_admin.Last_Name,acc_admin.Balance
FROM accounts
INNER JOIN acc_levels ON accounts.AL_ID = acc_levels.AL_ID
INNER JOIN acc_admin on accounts.Acc_ID = acc_admin.Acc_ID
WHERE accounts.Acc_ID = ""

-- CASHIER

SELECT accounts.Acc_ID,accounts.User_Name,accounts.Password,acc_levels.Access_Level,acc_cashier.Acc_Cashier_ID,acc_cashier.First_Name,acc_cashier.Last_Name,acc_cashier.Balance
FROM accounts
INNER JOIN acc_levels ON accounts.AL_ID = acc_levels.AL_ID
INNER JOIN acc_cashier on accounts.Acc_ID = acc_cashier.Acc_ID
WHERE accounts.Acc_ID = ""

-- USER
SELECT accounts.Acc_ID,accounts.User_Name,accounts.Password,acc_levels.Access_Level,acc_users.Acc_user_ID,acc_users.First_Name,acc_users.Last_Name,acc_users.Balance
FROM accounts
INNER JOIN acc_levels ON accounts.AL_ID = acc_levels.AL_ID
INNER JOIN acc_users on accounts.Acc_ID = acc_users.Acc_ID
WHERE accounts.Acc_ID = ""

-- Transaction transaction_history
SELECT transaction_history.Transaction_ID,machine_unit.Machine_Location,transaction_history.Date,transaction_history.Time,transaction_history.Amount_Dispensed,transaction_history.Temperature
,transaction_history.Price_Computed,transaction_history.Remaining_Balance
FROM transaction_history
INNER JOIN machine_unit ON transaction_history.MU_ID = machine_unit.MU_ID
WHERE transaction_history.Acc_ID = ""


-- OTP Check
SELECT OTP FROM accounts WHERE OTP=''

UPDATE OTP from ACCOUNTS WHERE Acc_ID=''

-- Machine Login
SELECT * from accounts WHERE OTP = ''
