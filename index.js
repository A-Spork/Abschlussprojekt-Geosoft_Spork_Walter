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


        console.log("Using db: " + app.locals.db.databaseName);
        //clear collections
        // app.locals.db.collection("tour").drop( (err,delOK) => {if(delOK) console.log("collection tour cleared");});
        // app.locals.db.collection("customer").drop( (err,delOK) => {if(delOK) console.log("collection customer cleared");});
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
app.get('/', (req, res) => {res.sendFile(__dirname + '/public/doc.html');});




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
      console.log("admin logged in");
      if (error)
      {
        console.dir(error);
      }
      res.json(result);
      console.log(result);//admin log
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
    if(decodeURIComponent(req.query.tourId)=="undefined")
    {
      if(decodeURIComponent(req.query.username)=="undefined")
      {
              object = {
                "line" : decodeURIComponent(req.query.line),
                "destination" : decodeURIComponent(req.query.destination),
                "date" : decodeURIComponent(req.query.date),
                "category" : decodeURIComponent(req.query.category)

                // ,"place" : decodeURIComponent(req.query.place)
              }
      }
      else
      {
          if(decodeURIComponent(req.query.username)=="admin")
          {
                ///////object stays empty
          }
          else
          {
            object = {"username" : decodeURIComponent(req.query.username)};//username
          }
      }
    }
    else
    {
      object = {"tourId" : (req.query.tourId)};//tourId
    }

	app.locals.db.collection('tour').find(object).toArray((error, result) => //find all with the id
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

  var object = {tourId : decodeURIComponent(req.body.tourId)};

    app.locals.db.collection('tour').deleteOne(object, (error, result) => {
		if(error){
			console.dir(error);
		}else{
    console.log("deleted tour" + JSON.stringify(decodeURIComponent(req.body.tourId)));
    res.json(result)
    }
  });
});

app.listen(port,() => console.log(`Example app listening at http://localhost:${port}`))
