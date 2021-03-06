var mysql = require('mysql');
const WebSocket = require('ws');

// create mysql connection
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "mypassword"
});

// create database and table
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query("CREATE DATABASE IF NOT EXISTS mypostdb", function (err, result) {
    if (err) throw err;
    con.query("USE mypostdb", function (err, result) {
      if (err) throw err;
      console.log("Database created");
      var sql = "CREATE TABLE IF NOT EXISTS posts (post VARCHAR(255))";
    	con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Table created");
      });
    });
  });
});

// create WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);

    // save received post into database
    var sql = "INSERT INTO posts (post) VALUES ('" + message +"')";
  	con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
  	});

    // push received post to all other connected clients
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });

  });
});