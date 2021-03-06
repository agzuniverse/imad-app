var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool= require('pg').Pool;
var crypto=require('crypto');
var bodyParser=require('body-parser');

var config={
    user:'aswinganesh666',
    database:'aswinganesh666',
    host:'db.imad.hasura-app.io',
    port:'5432',
    password:""
}

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());

var counter=0;
app.get('/count', function (req, res) {
  counter++;
  res.send(counter.toString());
});

var pool=new Pool(config);
app.get('/test-db',function(req,res){
    //GET STUFF FROM DATABASE
    pool.query('SELECT * FROM test',function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }
        else{
            res.send(JSON.stringify(result));
        }
    });
});

function hash(input,salt){
    var hashed=crypto.pbkdf2Sync(input, salt, 1000, 512, 'sha512')
    return hashed.toString('hex');
}

app.post('/create-user',function(req,res){
    var username=req.body.username;
    var password=req.body.password;
   var salt=crypto.randomBytes(128).toString('hex');
   var instring=hash(password,salt);
   pool.query('INSERT INTO "user" (username,password) VALUES ($1,$2)',[username,instring],function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }
        else{
            res.send(JSON.stringify(result));
        }
   });
});

app.post('/login',function(req,res){
    var username=req.body.username;
    var password=req.body.password;
   pool.query('SELECT * FROM "user" WHERE (username) VALUES ($1)',[username],function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }
        else{
            if(result.rows.length===0){
                res.status(403).send("Invalid credentials");
            }
            else{
                var dbs=result.rows[0].password;
                var salt=dbs.split('$')[2];
                var hashed=hash(password,salt);
                if(hashed==dbs){
                    res.send("PASSWORD IS CORRECT");
                }
                else{
                    res.send('403').send("INVALID CREDS");
                }
                res.send('User successfully created');
            }
        }
   });
});

app.get('/hash/:input',function(req,res){
    var hsh=hash(req.params.input,"saltystring");
    res.send(hsh);
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

app.get('/sample.html',function(req,res){
    res.sendFile(path.join(__dirname,'sample.html'));
})

// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
