var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./db/selfie');

db.serialize(function() {
  db.run("CREATE TABLE IF NOT EXISTS user (username varchar(20) PRIMARY KEY, password TEXT)");

  var stmt = db.prepare("INSERT INTO user VALUES (?,?)");
  var i= "Aish";
  var n= "123";
  stmt.run(i, n);
  stmt.finalize();

  db.each("SELECT username, password FROM user", function(err, row) {
      console.log("Details: "+row.username, row.password);
  });
});

db.serialize(function() {
  db.run("CREATE TABLE IF NOT EXISTS category (cat_name TEXT PRIMARY KEY)");

  var stmt1 = db.prepare("INSERT INTO category VALUES (?)");
  var i1= "Helping the elderly";

  stmt1.run(i1);
  //stmt1.finalize();
  var i2= "Community service";
 
  stmt1.run(i2);
  stmt1.finalize();
  db.each("SELECT cat_name FROM category", function(err, row) {
      console.log("Details : "+row.cat_name);
  });
});

db.serialize(function() {
  db.run("CREATE TABLE IF NOT EXISTS acts (act_id varchar(10) PRIMARY KEY NOT NULL,cat_name TEXT NOT NULL,act_caption TEXT NOT NULL, no_upvotes BIGINT DEFAULT 0,imgB64 TEXT,timestamp timestamp,username TEXT,FOREIGN KEY(username) references user(username),FOREIGN KEY(cat_name) references category(cat_name))");

  var stmt1 = db.prepare("INSERT INTO acts VALUES (?,?,?,?,?,?,?)");

  var a1= "A1";
  var c1= "Helping the elderly";
  var p1= "Helped this sweet grandpa with his groceries today";
  var u1="2";
  var i1="xyz";
  var t1="25-02-2019:24-12-10";
  var s1="advithi";

  stmt1.run(a1,c1,p1,u1,i1,t1,s1);
  //stmt1.finalize();
 /* var i2= "Community service";
  var n2= "4";
  stmt1.run(i2, n2);
  stmt1.finalize();
  db.each("SELECT cat_name, no_acts FROM category", function(err, row) {
      console.log("User id : "+row.cat_name, row.no_acts);
  }); */
  var a2= "A2";
  var c2= "Helping the elderly";
  var p2= "Helped this grandma walk today";
  var u2="1";
  var i2="abc";
  var t2="25-02-2019:14-20-11";
  var s2="aiswarya";
  stmt1.run(a2,c2,p2,u2,i2,t2,s2);

    var a2= "A3";
  var c2= "Helping the elderly";
  var p2= "Helped this bleh";
  var u2="1";
  var i2="abcd";
  var t2="21-02-2019:14-20-11";
  var s2="Aish";
  stmt1.run(a2,c2,p2,u2,i2,t2,s2);

  var a3= "B2";
  var c3= "Community service";
  var p3= "Hello trees";
  var u3="0";
  var i3="pqr";
  var t3="21-02-2018:04-10-09";
  var s3="Aish";
  stmt1.run(a3,c3,p3,u3,i3,t3,s3);

  stmt1.finalize();
  db.each("SELECT * FROM acts", function(err, row) {
      console.log("Details : "+row.act_id, row.cat_name, row.act_caption, row.no_upvotes, row.imgB64, row.timestamp, row.username);
});
});
db.close();