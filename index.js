const express = require('express');
const mongodb = require('mongodb');
const port = 3000;
const app = express();

app.use (express.json());
app.use (express.urlencoded({extended: true}));

async function connectMongoDB ()
{
    try
	{
        app.locals.dbConnection = await mongodb.MongoClient.connect("mongodb://localhost:27017", {useNewUrlParser: true});
        app.locals.db = await app.locals.dbConnection.db("itemdb");
        app.locals.db.createCollection("customer", function(err, res) {
          console.log("Collection customer created!");
        });
        app.locals.db.createCollection("tour", function(err, res) {
          console.log("Collection tour created!");
        });
        // app.locals.db.createCollection("doc", function(err, res) {
        //   console.log("Collection doc created!");
        // });

        console.log("Using db: " + app.locals.db.databaseName);
    }
    catch (error)
	{
        console.dir(error);
        setTimeout(connectMongoDB, 3000);
    }
}
connectMongoDB();

app.use('/public', express.static(__dirname + '/public'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'));
app.get('/', (req, res) => {res.sendFile(__dirname + '/logIn.html');});
app.get('/', (req, res) => {res.sendFile(__dirname + '/public/addTour.html');});
app.get('/', (req, res) => {res.sendFile(__dirname + '/public/lastTours.html');});



app.get("/customer", (req,res) =>
{
  if(req.query.password==""){
    var object = {username : req.query.username};
  }else{
    var object = {username : req.query.username ,password: req.query.password};
  }
  if(req.query.username=="admin"&&req.query.password=="admin"){
    app.locals.db.collection('customer').find({}).toArray((error, result) =>
    {
      if (error)
      {
        console.dir(error);
      }
      console.log(result);
      res.json(result);
    });
    }
  else{
    app.locals.db.collection('customer').find(object).toArray((error, result) =>
	   {
		     if (error)
		       {
			          console.dir(error);
		       }
		       res.json(result);
	     });
      }
     });



app.post("/customer", (req, res) =>
{

    app.locals.db.collection('customer').insertOne(req.body, (error, result) =>
	{
        if (error)
		{
            console.dir(error);
        }
          console.log("insert customer " + JSON.stringify(req.body));
        res.json(result);
    });
});




app.delete("/customer", (req, res) =>
{

    var object = {username : req.body.username};//delete by deleteUser("Username"+"Password")
    // var object = {_id : new mongodb.ObjectID(req.body.username)};//delete by deleteUser("Id")
    app.locals.db.collection('customer').deleteOne(object, (error, result) =>
	{
		if (error)
		{
			console.dir(error);
		}else{
    console.log("delete customer" + JSON.stringify(req.body.username));
    res.json(result)
  }
    });
});




app.get("/tour", (req,res) =>
{
  var object={};
    if(decodeURIComponent(req.query.tourId==undefined))
    {
      if(decodeURIComponent(req.query.username)=="admin"){
      }else{
        object = {"username" : decodeURIComponent(req.query.username)};//username
        console.log(decodeURIComponent(req.query.username));
      }
    }else{
        object = {"tourId" : decodeURIComponent(req.query.tourId)};//tourId
        console.log(decodeURIComponent(req.query.tourId));
    }

	app.locals.db.collection('tour').find(object).toArray((error, result) => //find all with the id
	// app.locals.db.collection('tour').find().toArray((error, result) =>//find all
  {
		if (error)
		{
			console.dir(error);
		}
		res.json(result);
	});
});



app.post("/tour", (req, res) =>
{

    app.locals.db.collection('tour').insertOne(req.body, (error, result) =>
	{
        if (error)
		{
            console.dir(error);
        }
          console.log("insert tour " + JSON.stringify(req.body.tourId));
        res.json(result);
    });
});




app.delete("/tour", (req, res) =>{
  var object={};
  var temp;
  var id=decodeURIComponent(req.body.tourId);
  console.log(id);
  console.log(JSON.stringify(id));
  console.log(id==undefined);
  // if(decodeURIComponent(req.body.tourId)==undefined){
    if(id==undefined){////Fehler
      console.log("_id");
    object = {_id : (new mongodb.ObjectID(req.body._id))};
    temp = (req.body._id);
  }else{
    console.log("tourId");
    object = {tourId : decodeURIComponent(req.body.tourId)};
    temp = decodeURIComponent(req.body.tourId);
  }
    console.log(JSON.stringify(object));
    app.locals.db.collection('tour').deleteOne(object, (error, result) =>
	{
		if(error)
		{
			console.dir(error);
		}else{
    console.log("deleted tour" + JSON.stringify(temp));
    res.json(result)
  }
    });
});

app.listen(port,() => console.log(`Example app listening at http://localhost:${port}`))
