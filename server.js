'use strict';
const express     = require('express');
const mysql       = require('mysql');
const db          = require('./app/db');
const PDFDocument = require ('pdfkit');
const fs          = require('fs');
const jade        = require('jade');
const bodyParser  = require('body-parser');


var pdf = require('html-pdf');

const app         = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', './app/view');
app.set('view engine', 'jade');

db.connect();



app.get('/', function (req, res) {
  	db.query('SELECT * FROM user WHERE firstName=\'vlad\' LIMIT 1;', function(err, rows, fields) {
		if (err) throw err;
		res.render('index', { name: rows[0].firstName, img: rows[0].image});
	});
});
/*
app.get('/add-image', function(req, res){
	let query = 'INSERT INTO user(firstName, lastName, image) VALUES("vlad", "korbut", \'' + base64_encode('./app/1.png') + '\')';
	console.log(query);
	db.query(query,
		function(err, rows, fields) {
			if (err) throw err;
			res.render('index', { name: 'success', img: base64_encode('./app/1.png') });
	});
})*/

app.post('/find-user', function(req, res){
	db.query('SELECT * FROM user WHERE firstName=\'' + req.body.name + '\' LIMIT 1;', function(err, rows, fields) {
		if (err) throw err;
		if(rows.length){
			genPdf(rows[0]);
			res.render('user', { name: rows[0].firstName, img: rows[0].image});

			var phantom = require('phantom');
			  phantom.create(function(ph){
			    ph.createPage(function(page){
			      page.open(url_to_process, function(status){
			        if (status == "success") {
			          // put images in public directory
			          var image_file_name = url_to_process.replace(/\W/g, '_') + ".png"
			          var image_path = public_dir + "/" + image_file_name
			          page.render(image_path, function(){
			            // redirect to static image
			            res.redirect('/'+image_file_name);
			          });
			        }
			        else {
			          res.writeHead(404, {'Content-Type': 'text/plain'});
			          res.end("404 Not Found");
			        }
			        page.close();
			        ph.exit();
			      });
			    });
			  });
		}else{
			res.redirect('/');
		}
	});
})

function base64_encode(file) {
    var bitmap = fs.readFileSync(file);
    return new Buffer(bitmap);
}

function base64_decode(base64str, file) {
    fs.writeFileSync(file, base64str);
    console.log('********** File created from base64 encoded string **********');
}


function genPdf(user){
	/*var doc = new PDFDocument();
	doc.text(user.firstName+" "+user.lastName+" ");
	doc.image('./app/2.png');
	console.log(new Buffer(user.image, 'base64'));
	console.log(base64_encode('./app/2.png'));
	fs.writeFileSync('./1.png', user.image);

	return doc;

	/*
	phantom.create(function(ph){
		ph.createPage(function(page) {
			page.open("localhost:3000", function(status) {
				page.render('google.pdf', function(){
					console.log('Page Rendered');
					ph.exit();        
				});
			});
		});
	}); */
}

function getImg(image){
	new Buffer(image);
}
function putPdf(doc, id){
	var query = 'UPDATE user SET pdf=\''+doc+'\' WHERE id='+id;
	db.query(query, function(err, rows, fields){
		console.log(rows);
	})
}

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});