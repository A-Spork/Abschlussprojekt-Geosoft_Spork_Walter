const express = require('express');
const mongodb = require('mongodb');
const port = 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

/**
* Connects to the mongodb itemdb and creates the collections tour and customer
*/
async function connectMongoDB()
{
    try
	{
		// mongodb://localhost:27017
        app.locals.dbConnection = await mongodb.MongoClient.connect("mongodb://mongodbservice:27017", {useNewUrlParser: true});
        app.locals.db = await app.locals.dbConnection.db("itemdb");
        app.locals.db.createCollection("customer", function(err, res)
		{
			console.log("Collection customer created!");
        });
        app.locals.db.createCollection("tour", function(err, res)
		{
			console.log("Collection tour created!");
        });
        console.log("Using db: " + app.locals.db.databaseName);

		// Clear collections
        // app.locals.db.collection("tour").drop((err,delOK) => {if(delOK) console.log("collection tour cleared");});
        // app.locals.db.collection("customer").drop((err,delOK) => {if(delOK) console.log("collection customer cleared");});
    }
    catch(error)
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
app.get('/', (req, res) => {res.sendFile(__dirname + '/public/test.html');});

app.post("/customer", (req, res) =>
{
  res.set('access-control-allow-origin',['*']);
	app.locals.db.collection('customer').insertOne(req.body, (error, result) =>
	{
		if(error)
		{
			console.dir(error);
		}
		console.log("insert customer " + JSON.stringify(req.body));
		res.json(result);
	});
});


/**
* Adresspoint for GET - requests directed to customer collection
*/

app.get("/customer", (req,res) =>
{
  res.set('access-control-allow-origin',['*']);
	if(req.query.password == "")
	{
		var object = {username : req.query.username};
	}
	else
	{
		var object = {username : req.query.username, password: req.query.password};
	}
	// If the admin logs in there will be shown all users in the db at the server
	if(req.query.username == "admin" && req.query.password == "admin")
	{
		app.locals.db.collection('customer').find({}).toArray((error, result) =>
		{
			if(error)
			{
				console.dir(error);
			}
			res.json(result);
		});
    }
	else
	{
		app.locals.db.collection('customer').find(object).toArray((error, result) =>
		{
		    if(error)
		    {
			    console.dir(error);
		    }
		    res.json(result);
	    });
    }
});


/**
* Adresspoint for DELETE - requests directed to customer collection
*/

app.delete("/customer", (req, res) =>
{
  res.set('access-control-allow-origin',['*']);
	// Here can an user be deleted by his username
    var object = {username : req.body.username};
    app.locals.db.collection('customer').deleteOne(object, (error, result) =>
	{
		if(error)
		{
			console.dir(error);
		}
		else
		{
			console.log("delete customer" + JSON.stringify(req.body.username));
			res.json(result)
		}
    });
});


/**
* Adresspoint for GET - requests directed to tour collection
*/

app.get("/tour", (req,res) =>
{
  res.set('access-control-allow-origin',['*']);
	var object = {};
	// If the tourId is defined, the object is the tourId
    if(decodeURIComponent(req.query.tourId) == "undefined")
    {
		// If the username is defined, the object is the username
		if(decodeURIComponent(req.query.username) == "undefined")
		{
			// Else the object is defined with the line, the destination, the date and the category
            object =
			{
				"line" : decodeURIComponent(req.query.line),
                "destination" : decodeURIComponent(req.query.destination),
                "date" : decodeURIComponent(req.query.date),
                "category" : decodeURIComponent(req.query.category)
            }
		}
		else
		{
			// If the username is "admin" all objects in the db will be shown
			if(decodeURIComponent(req.query.username) == "admin")
			{}
			else
			{
				object = {"username" : decodeURIComponent(req.query.username)};
			}
  		}
      }
      else
      {
		  object = {"tourId" : (req.query.tourId)};
      }
  	app.locals.db.collection('tour').find(object).toArray((error, result) =>
  	{
  		//All objects from the tour collection which fit at the chosen object will be returned
  		if(error)
  		{
  			console.dir(error);
  		}
  		res.json(result);
  	});
  });


/**
* Adresspoint for POST - requests directed to tour collection
*/

app.post("/tour", (req, res) =>
{
  res.set('access-control-allow-origin',['*']);
    app.locals.db.collection('tour').insertOne(req.body, (error, result) =>
	{
        if(error)
		{
            console.dir(error);
        }
        console.log("insert tour " + JSON.stringify(req.body.tourId));
        res.json(result);
    });
});


/**
* Adresspoint for DELETE - requests directed to tour collection
*/

app.delete("/tour", (req, res) =>
{
  res.set('access-control-allow-origin',['*']);
	var object = {tourId : decodeURIComponent(req.body.tourId)};
    app.locals.db.collection('tour').deleteOne(object, (error, result) =>
	{
		if(error)
		{
			console.dir(error);
		}
		else
		{
			console.log("deleted tour" + JSON.stringify(decodeURIComponent(req.body.tourId)));
			res.json(result)
		}
	});
});

app.listen(port,() => console.log(`Example app listening at http://localhost:${port}`));