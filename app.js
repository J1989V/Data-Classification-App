const bodyParser = require('body-parser');
const path = require('path');
const express = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const favicon = require('serve-favicon')
const port = 8080;
const app = express();
const classifyAPI = require(__dirname + '/routers/classifyapi.js');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('view engine', 'pug')
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')))
app.use(classifyAPI);

// Redirect from '/' to '/login'
app.get('/', (req, res) => {
  res.redirect('/login');
});

// Serve index.pug to client
app.get('/login', (req, res) => {
  res.render('index');
});

// Receive login details from client over SSL/TSL {username: uname, password: psw}
app.post('/login', function (req, res) {
  let formUsername = req.body.uname;
  let formPassword = req.body.psw;
  let correctPassword = true;
  let databaseError = false;
  let connection = null;

  try {
    connection = mysql.createConnection({
      host: 'popi-db-do-user-8330663-0.b.db.ondigitalocean.com',
      port: 25060,
      database: 'defaultdb',
      user: 'doadmin',
      password: 'zadszp92tgcfnkmd'
    });
    connection.connect(function (e) {
      if (e) {
        console.error('Couldn\'t connect to the MySQL database: ' + e.name + ': ' + e.message + '\n\n\n' + e.stack);
      }
    });
    try {
      let sql = 'SELECT hash FROM user WHERE username = ?';
      connection.query(sql, [formUsername], function (e, result) {
        if (Object.keys(result).length != 0) {
          bcrypt.compare(formPassword, result[0].hash, function (e, bcryptResult) {
            if (bcryptResult == true) {
              return res.redirect('/classify');
            } else if (bcryptResult == false) {
              correctPassword = false;
              return res.render('index', {
                correctPassword: correctPassword
              });
            } else {
              return res.render('index', {
                correctPassword: correctPassword
              });
            }
          });
        } else {
          correctPassword = false;
          return res.render('index', {
            correctPassword: correctPassword
          });
        }
      });
    } finally {
      connection.end();
    }
  } catch (e) {
    console.log(e.name + ': ' + e.message + '\n' + e.stack);
    databaseError = true;
    return res.render('index', {
      databaseError: databaseError
    });
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
})
