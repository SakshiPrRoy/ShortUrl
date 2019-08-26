const express = require('express')
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const port = 3000
const mongo = require('mongodb');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
const MongoClient = mongo.MongoClient;

// mongoDb connection
// # ================================================================
const localhost = true; // (make True if localDb is to be migrated)

// const dbUsername = 'acadsUser'
// const dbUserpassword = 'AkdjsAIYHjk87y23l1m2klRrtyhjnmrti92w33'
// const dbHost = '192.168.0.34'

// const collection = "tests";
const dbport = '27017'; // your_db_port
// const db = 'admin';
const dbName = 'shortto';
const collectionToinsert = 'srt';
// const academicYear = '2018-19';
// # ================================================================
let uri = 'mongodb://localhost:27017/';
if (localhost == true) {
  uri = 'mongodb://localhost:27017/';
}
// respond with index.html when a GET request is made to the localhost:3000
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname+'/routes/index.html'));
})

MongoClient.connect(uri,  { useNewUrlParser: true ,useUnifiedTopology: true },(err, db) => {
  if (err) throw err;
  const acadsDb = db.db(dbName);
app.get('/:link',(req,res)=>{
	// console.log("im here");
	
    var link=req.params.link;
	// console.log(typeof link)
	 var linkpass =link.toString();
  acadsDb.collection(collectionToinsert).find({shortlink:linkpass}).toArray(function (err, doc){
  //	console.log(typeof doc);
  	if (Array.isArray(doc) && doc.length) {
    
   
    console.log(doc[0].longlink);
    res.redirect(doc[0].longlink);

}else{
	res.send('not found record!');
}




  });


	
});



// POST method route
app.post('/form', function (req, res) {
		//	console.log(req.body);
   const link = req.body.link;
   console.log(link);
   const shortLink = req.body.shortlink;
  console.log(shortLink);
	const acadsDb = db.db(dbName);
	acadsDb.collection(collectionToinsert).find({shortlink:shortLink}).toArray(function (err, doc){
  //	console.log(typeof doc);
  	if (Array.isArray(doc) && doc.length) {
    
   
    console.log(doc[0].longlink);
    res.send("i am afraid if someone already using this ");

}else{
		  acadsDb.collection(collectionToinsert).insert(req.body, (err, resp) => {
    console.log("res", resp);
    res.send("you have done");
  });
// acadsDb.collection(collectionToinsert).insert({shortlink:req.body.shortLink,longlink:link}).toArray(function (err, doc){

// res.send('u are good too go');
// });


}
});


  
// mongo.connect(url, (err, client) => {
//   if (err) {
//     console.error(err)
//     return
//   }
//   else{
//   	console.log('connected');
//   }

//   const db = client.db('nikhil');
//   const collection = db.collection('mydata');
// //   collection.insertOne({name: 'Roger'}, (err, result) => {

// // });
//   collection.insertMany([{shortLink: link}, {long: shortLink}], (err, result) => {

// });
//   collection.find().toArray((err, items) => {
//   //console.log(items)
// });
//  //console.log(db)
// });

	

//   res.sendFile(path.join(__dirname+'/public/FormData.html'));
});
	});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))