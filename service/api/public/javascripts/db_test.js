var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "a_password"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

var test = document.getElementById("test");
test.innerHTML = "Je viens de db_test";