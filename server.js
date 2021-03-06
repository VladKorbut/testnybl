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

app.get('/success', function(req, res){
	res.render('success')
})

app.get('/error', function(req, res){
	res.render('error')
})

app.post('/find-user', function(req, res){
	db.query('SELECT * FROM user WHERE firstName LIKE \'%' + req.body.name + '%\' LIMIT 1;', function(err, rows, fields) {
		if (err) throw err;
		if(rows.length){
			genPdf(rows[0]).then(
				res.render('user', { name: rows[0].firstName, surname: rows[0].lastName, img: rows[0].image, status: true}),
				res.render('user', { name: rows[0].firstName, surname: rows[0].lastName, img: rows[0].image, status: false})
			);
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
	return new Promise((resolve, reject) => {
		jade.renderFile('./app/view/pdf.jade', {
			name: user.firstName,
			surname: user.lastName,
			img: user.image
		}, function (err, html) {
			pdf.create(html).toBuffer(function(err, buffer){
				var query = 'UPDATE user SET pdf="'+buffer.toString('base64')+'" WHERE id='+user.id+';';
				db.query(query, function(err, rows, fields) {
					if(err){
						reject({status:true});
					}
					resolve({status:false});
				});
		  });
		});
	});
}



app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});