
const sqlite3 = require('sqlite3').verbose();
 
// open the database
let db = new sqlite3.Database('./db/selfie', (err) => {
  if (err) {
    console.error(err.message);
  }
});



//get()
//add_user();
//remove_user();
//add_category();
//remove_category();
//export default { add_user,upvote,list_actincat_range,list_category,list_acts,remove_user,add_categories,remove_category,remove_user,error,list_actincat};


 module.exports = function(app) {
  //var webapp = require('./Controller');

  // Routes
  app.route('/api/v1/users/')
  	.get(function(req,res){
  return res.status(405).send();
})
    .post(function(req,res){
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

})
    .put(function(req,res){
  return res.status(405).send();
})
  	.patch(function(req,res){
  return res.status(405).send();
})
  	.head(function(req,res){
  return res.status(405).send();
})
  app.route('/api/v1/users/:username')
  	.delete(function(req,res){
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
  })

  app.route('/api/v1/categories')
  	.get(function(req,res){
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
  })
  	.post(function(req,res){
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

})
  	.put(function(req,res){
  return res.status(405).send();
})
  	.patch(function(req,res){
  return res.status(405).send();
})
  	.head(function(req,res){
  return res.status(405).send();
})
  app.route('/api/v1/categories/:categoryName')
  	.delete(function(req,res){
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
})

  app.route('/api/v1/acts')
  	.get(function(req,res){
  return res.status(405).send();
})
  	.post(function(req,res){
  //app.post('/api/v1/acts',function(req,res){
  console.log("upload act");
  if(req.method == 'OPTIONS'){
    res.status(200).send();
  }
  console.log(req.body.act_id);
  db.get("select * from acts where act_id='"+req.body.act_id+"'",function(err,row)
  {
    //console.log(typeof req.body.imgB64);
    console.log(row);
    if(!row)
    {
      db.get("select * from user where username='"+req.body.username+"'",function(err,row)
      {
        if(row)
        {
          db.get("select * from category where cat_name='"+req.body.cat_name+"'",function(err,row)
          {
            if(row)
            {
              //if(isBase64(req.body.imgB64))
              {
  
                if(!req.body.upvote)
                {
                  //moment().format("DD-MM-YYYY:SS-MM-HH")
                  console.log(req.body.timestamp);
                  //var reg=/((0[1-9])|([12]\d)|(3[01]))-((0[1-9])|(1[0-2]))-([12]\d{3}):(([0-5][0-9]):([0-5][0-9])-(([0-1][0-9])|(2[0-3])))/;
                  //var reg=/((0[1-9])|([12]\d)|(3[01]))-((0[1-9])|(1[0-2]))-([12]\d{3}) (([0-5][0-9]):([0-5][0-9]):(([0-1][0-9])|(2[0-3])))/;
                  var reg= /(0[1-9]|[1-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-[0-9]{4}:(2[0-3]|[01][0-9])-[0-5][0-9]-[0-5][0-9]/;
                  //var reg1=/(0[1-9])|([12]\d)|(3[01])/
                  
                  //reg.lastIndex=0
                  //console.log(reg.test(req.body.timestamp));
                  //var match=reg.exec(req.body.timestamp)
                  //console.log(match)
                  if (reg.test(req.body.timestamp))
                  //if(match)
                  {
                    //if(match[0]==req.body.timestamp)
                    {
                      console.log(true)
                      //console.log("hah")
                      //console.log("insert into acts values("+req.body.act_id+",'"+req.body.username+"','"+req.query.timestamp+"','"+req.query.caption+"','"+req.query.categoryName+"',"+"0)");
                      //db.run("insert into acts values("+req.body.act_id+",'"+req.query.username+"','"+req.query.timestamp+"','"+req.query.caption+"','"+req.query.categoryName+"',"+"0)");
                      db.run("INSERT INTO acts(act_id,cat_name, act_caption, no_upvotes, imgB64, timestamp,username) values(?,?,?,?,?,?,?)",[req.body.act_id,req.body.cat_name, req.body.act_caption,0, "rtyrytrytr", req.body.timestamp, req.body.username],function(err){
                      console.log("khnckhsnkh");
                      res.status(201).send('act inserted');
                      });
                    }
                    //else res.status(400).send("incorrect timestamp")
                  }
                  else res.status(400).send("incorrect timestamp")
                }
                else res.status(400).send("no upvotes allowed")
              }
              //else res.status(400).send("image isn't in base64")
            }
            else
              res.status(400).send("Category doesn't exist")
          })
        }
        else res.status(400).send("Username doesn't exist")
      })
    }
    else res.status(400).send("incorrect act number")
  })
  
})
  	.put(function(req,res){
  return res.status(405).send();
})
  	.patch(function(req,res){
  return res.status(405).send();
})
  	.head(function(req,res){
  return res.status(405).send();
})

  app.route('/api/v1/acts/upvote')
  	.post(function(req,res){
      if(req.method == 'OPTIONS'){
    res.status(200).send();
  }
//app.post('/api/v1/acts/upvote', (req, res) => {
  var ct=0;
  console.log(req.body.act_id);
  db.each("SELECT COUNT(*) AS numCount FROM acts WHERE act_id= ? ", req.body.act_id,(err, row)=>{
     if (err) {
      console.log(row);
    throw err
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
})

  app.route('/api/v1/acts/:act_id')
  	.delete(function(req,res){
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
})

  app.route('/api/v1/categories/:categoryName/acts/size')
  	.get(function(req,res){
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
  

})

  
  app.route('/api/v1/categories/:categoryName/acts')
  	.get(function(req,res){
  //app.get("/api/v1/categories/:categoryName/acts", (req, res) => {
    if(Object.keys(req.query).length == 0){
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

  }

   else{
  var ob={};
  var arr=[];
  //console.log("hbhjgfbjsfhb");
  //db.get("select count(*) c from acts where cat_name= ?", [req.params.categoryName], (err,row)=>{
  const start= req.query.start;
  const end= req.query.end;
  var ct=start;
  db.all("SELECT * FROM acts where cat_name= ? ORDER BY timestamp DESC",req.params.categoryName, (err,row)=>{
    console.log(row.length);
    if(row.length==0)
    {
      //console.log("bleh")
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
      ob={
        actId: row[ct-1].act_id,
        username: row[ct-1].username,
        timestamp: row[ct-1].timestamp,
        caption: row[ct-1].act_caption,
        upvotes: row[ct-1].no_upvotes,
        imgB64:row[ct-1].imgB64
      };
      arr.push(ob);
      console.log(arr);
    }
    return res.status(200).send(arr);

     }
    else if(end>row.count)
    {
      return res.status(204).send();
    }
    //console.log(row[0]);
    
});
}
});

app.route('/api/v1/categories/:categoryName/acts/size')
  .get(function(req,res){
  var ct=[];
  db.get("select count(*) c from acts where cat_name= ?", [req.params.categoryName], (err,row)=>{
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
  

});
});

 }
