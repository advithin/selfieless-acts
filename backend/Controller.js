const sqlite3 = require('sqlite3').verbose();
 
// open the database
let db = new sqlite3.Database('../db/selfie', (err) => {
  if (err) {
    console.error(err.message);
  }
});


exports.add_user=function(req,res){
  //app.post('/api/v1/users', (req, res) => {

  if(!req.body.username) {
    return res.status(400).send({
      success: 'false',
      message: 'username is required'
    });
  } else if(!req.body.password) {
    return res.status(400).send({
      success: 'false',
      message: 'password is required'
    });
  }
  var ct=0;

if (/([a-fA-F0-9]+)/.test(req.body.password) && req.body.password.length>3) {
       db.run("INSERT INTO user(username,password) VALUES(?,?)", [req.body.username, req.body.password], function(err) {
       if (err) {
         //return console.log(err.message);
         console.log(err.message);
         return res.status(400).send();
    }
    // get the last insert id
    console.log(`A row has been inserted with rowid ${this.lastID}`);
    return res.status(201).send({})
  });
}
else {
    return res.status(400).send ({
      success: 'false',
      message: 'pass does not match SHA'
      });
  }

};

exports.add_categories=function(req,res){
//app.post('/api/v1/categories', (req, res) => {

   db.run("INSERT INTO category (cat_name) VALUES(?)", [req.body.cat_name], function(err) {
    if (err) {
      console.log(err.message);
      return res.status(400).send()
    }
    // get the last insert id
    console.log(`A row has been inserted with rowid ${this.lastID}`);
    return res.status(201).send()
  });

},

exports.list_actincat=function(req,res){
  var ct=[];
//app.get('/api/v1/categories/:categoryName/acts/size', (req, res) => {
  
  //db.get("select count(*) c from acts where cat_name= ?", [req.params.categoryName], (err,row)=>{
  const id= req.params.categoryName;
  console.log(id);
  db.each("SELECT COUNT(*) AS c FROM acts WHERE cat_name= ?", id , (err,row)=>{
    if (err) {
          return console.log(err.message);
      }
      console.log(typeof row+row)
      ct.push(row.c);
      if (ct!=0){
        console.log("no of acts" + req.params.categoryName + ct);
      return res.status(200).send(ct);
    }
    else
      return res.status(204).send();
    
  });
  

};

exports.remove_user=function(req,res){
  //app.delete("/api/v1/users/:username", (req, res) => {
    const id =req.params.username;
    console.log(id);
    db.each("SELECT COUNT(*) AS numCount FROM user WHERE username= ? ",id, function(err, row) {
      if (err) {
      throw err;
        }
        console.log(typeof row);
        if(row.numCount==0){
        console.log("No row found");
        return res.status(400).send();
      } 
      else{
        db.run(`DELETE FROM user WHERE username=?`, id, function(err) {
          if (err) {
            return console.error(err.message);
            //return res.status(400).send();
          }
          console.log(`Row(s) deleted ${this.changes}`);
          if(this.changes==1){
            return res.status(200).send({});
          }
        });
      } 
  });
  };

exports.remove_category=function(req,res){
  //app.delete("/api/v1/categories/:categoryName", (req, res) => {
    const id =req.params.categoryName;
    console.log(id);
    db.each("SELECT COUNT(*) AS numCount FROM category WHERE cat_name= ? ",id, function(err, row) {
      if (err) {
      throw err;
        }
        console.log(typeof row);
        if(row.numCount==0){
        console.log("No row found");
        return res.status(400).send();
      } 
      else{
    db.run(`DELETE FROM category WHERE cat_name=?`, id, function(err) {
    if (err) {
      return console.error(err.message);
      //return res.status(400).send();
    }
    console.log(`Row(s) deleted ${this.changes}`);
    if(this.changes==1){
      return res.status(200).send({});
    }
  });

}
});
};


exports.remove_act=function(req,res){
  //app.delete("/api/v1/acts/:act_id", (req, res) => {
    const id =req.params.act_id;
    console.log(id);
    db.each("SELECT COUNT(*) AS numCount FROM acts WHERE act_id= ? ",id, function(err, row) {
      if (err) {
      throw err;
        }
        console.log(typeof row);
        if(row.numCount==0){
        console.log("No row found");
        return res.status(400).send();
      } 
      else{
    db.run(`DELETE FROM acts WHERE act_id=?`, id, function(err) {
    if (err) {
      return console.error(err.message);
      //return res.status(400).send();
    }
    console.log(`Row(s) deleted ${this.changes}`);
    if(this.changes==1){
      return res.status(200).send({});
    }
  });

}
});
};

exports.error=function(req,res){
	return res.status(405).send();
};


exports.list_acts=function(req,res){
  //app.get("/api/v1/categories/:categoryName/acts", (req, res) => {
    var ob={};
    var arr=[];
    const id =req.params.categoryName;
      console.log(id);
    db.get("SELECT COUNT(*) AS ct FROM acts WHERE cat_name=?",id, function(err, row) {
      if(err){
        throw err;
      }
      if(row.ct==0){
        console.log("No Content");
        return res.status(204).send({});
      }
      else if(row.ct<100){
      db.all("SELECT * FROM acts WHERE cat_name=?",id, function(err, rows) {
      //ob={}
      rows.forEach((ro)=>{
      ob={
        actId: ro.act_id,
        username: ro.username,
        timestamp: ro.timestamp,
        caption: ro.act_caption,
                upvotes: ro.no_upvotes,
                imgB64:ro.imgB64
      };
      arr.push(ob);
      console.log(arr);
    });
      return res.status(200).send(arr);
    });
    }
    else{
      console.log("too large");
      return res.status(413).send({});
    }
      })  

  };

exports.list_category=function(req,res){
  //app.get("/api/v1/categories", (req, res) => {
    var ob={}
    db.all("SELECT DISTINCT(cat_name) FROM category ",function(err,rows){
      if(err){
        console.log(err.message);
        res.status(400).send({});
      }
      console.log(rows.length);
      if(rows.length<1)
      {
        console.log("No Content");
        return res.status(204).send({});
      }
      else{
        console.log(rows.length);
        rows.forEach((row)=>{
          db.each("SELECT COUNT(*) AS ct FROM acts WHERE cat_name=?",row.cat_name,function(err,ro){
            console.log(row.cat_name)
            console.log(ro.ct)
            ob[row.cat_name]=ro.ct;
            if(Object.keys(ob).length==rows.length)
            {
              return res.status(200).send(ob);
            }
          })
        })
      }
    })
  };


exports.list_actincat_range=function(req,res){

  //app.get('/api/v1/categories/:categoryName/acts', (req, res) => {
  var ob={};
  var arr=[];
  
  //db.get("select count(*) c from acts where cat_name= ?", [req.params.categoryName], (err,row)=>{
  const start= req.query.start;
  const end= req.query.end;
  var ct=start;
  db.all("SELECT * FROM acts where cat_name= ? ORDER BY timestamp DESC",req.params.categoryName, (err,row)=>{
    console.log(row.length);
    if(row.length==0)
    {
      console.log("bleh")
      console.log(err);
      return res.status(204).send();
    }
    if((end-start+1)>=100)
    {
      return res.status(413).send();
    }
    if(start>=1 && end<=row.length){
      console.log("here");
      for(var ct=start;ct<=end; ct++)
    {
      console.log(ct);
      arr.push(row[ct-1]);
    }
     }
    else if(end>row.count)
    {
      return res.status(204).send();
    }
    //console.log(row[0]);
    return res.status(200).send(arr);

});



  };

exports.upvote=function(req,res){
//app.post('/api/v1/acts/upvote', (req, res) => {
  var ct=0;
  db.each("SELECT COUNT(*) AS numCount FROM acts WHERE act_id= ? ", req.body.act_id,(err, row)=>{
     if (err) {
    throw err;
  }
  //console.log(`${row.firstName} ${row.lastName} - ${row.email}`);
  //console.log("found another row");
  console.log(row);
  //console.log(typeof row);
 if(row.numCount == 0)
 {
     console.log("No row found");
     return res.status(400).send();
  }
  //console.log( "ct", ct);
  
 else{
  var data;
  //db.serialize(function() {
  db.each("SELECT * FROM acts WHERE act_id =?",req.body.act_id,function(err,row){
     if (err) {
      return console.log(err.message);

    }
 // console.log(typeof upvote);
  data=row.no_upvotes+1;
  console.log(typeof data);
  db.run('UPDATE acts SET no_upvotes=? WHERE act_id =?',data,req.body.act_id,function(err) {
    if (err) {
      return console.log(err.message);
    }
    console.log(`A row has been updated with rowid ${this.changes}`);
    return res.status(201).send({});
  });
  //return data;
  });
  
  }
});
};
//get()
//add_user();
//remove_user();
//add_category();
//remove_category();
//export default { add_user,upvote,list_actincat_range,list_category,list_acts,remove_user,add_categories,remove_category,remove_user,error,list_actincat};