'use strict';
const express     = require('express');
const mysql       = require('mysql');
const db          = require('./app/db');
const fs          = require('fs');
const jade        = require('jade');
const bodyParser  = require('body-parser');

const pdf         = require('html-pdf');

const app         = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', './app/view');
app.set('view engine', 'jade');

db.connect();



app.get('/', function (req, res) {
  	db.query('SELECT * FROM user;', function(err, rows, fields) {
		if (err) throw err;
		res.render('index', { name: rows[0].firstName, img: rows[0].image, rows:rows});
	});
});

/*
app.get('/add-user', function(req, res){
	res.render('add-user');
})

app.post('/add-user', function(req, res){
	db.query('SELECT COUNT(*) FROM user WHERE firstName="'+req.body.name+'" AND lastName="'+req.body.lastname+'";',
		function(err, rows, fields) {
			if (err){ throw err;}
			else{
				if(rows.length){
					let query = 'INSERT INTO user(firstName, lastName, image) VALUES("'+req.body.name+'", "'+req.body.lastname+'", \'' + base64_encode('app/4.png') + '\')';
					console.log(query);
					db.query(query,
						function(err, rows, fields) {
							if (err){ throw err;}
							res.redirect('/');
					});
				}else{
					res.format({
						'text/html': function(){
						    res.send('<h2>This user already exist!</h2>');
						}
					});
				}
			}
	});
})
*/

app.post('/find-user', function(req, res){
	db.query('SELECT * FROM user WHERE firstName LIKE \'%' + req.body.name + '%\' LIMIT 1;', function(err, rows, fields) {
		if (err) throw err;
		if(rows.length){
			res.render('user', { name: rows[0].firstName, img: rows[0].image});
			
		}else{
			res.render('empty');
		}
	});
})

function base64_encode(file) {
    var bitmap = fs.readFileSync(file);
    return new Buffer(bitmap).toString('base64');
}


function genPdf(user){
	jade.renderFile('./app/view/pdf.jade', {
		name: user.firstName,
		surname: user.lastName,
		img: user.image
	}, function (err, html) {
		pdf.create(html).toBuffer(function(err, buffer){
			var query = 'UPDATE user SET pdf="'+buffer.toString('base64')+'" WHERE id='+user.id+';';
			db.query(query, function(err, rows, fields) {
				if(err){
					({status:false})
				}
				({status:true})
			});
		pdf.create(html).toStream(function(err, stream){
			stream.pipe(fs.createWriteStream('./foo.pdf'));
			
		});
	  });
	});
}



app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});