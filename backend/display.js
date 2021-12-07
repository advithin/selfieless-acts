var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./db/selfie');

 
//let sql = "SELECT * from user";

db.each("SELECT * FROM user", function(err, row) {
      console.log("User id : "+row.username, row.password);
});

db.each("SELECT * FROM category", function(err, row) {
      console.log("User id : "+row.cat_name);

});
db.each("SELECT * FROM acts", function(err, row) {
      console.log("User id : "+row.act_id,row.cat_name, row.act_caption, row.no_upvotes, row.imgB64, row.timestamp, row.username); 
});

db.close();