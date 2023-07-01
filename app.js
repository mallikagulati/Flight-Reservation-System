const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("my-sql");
const session = require('express-session')
require('dotenv').config()
const app = express();

app.use(
    session({
      secret: 'your-secret-key',
      resave: false,
      saveUninitialized: true,
    })
  );

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

app.use(bodyParser.json());



const connection = mysql.createPool({
    host: process.env.DB_HOST, 
    user: process.env.DB_USERNAME, 
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DBNAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

connection.getConnection((err, conn) => {
    if(err) console.log(err)
    console.log("Connected successfully")
})

module.exports = connection.promise()



app.get("/",function(req,res){
    res.sendFile(__dirname + "/index.html");
})

app.get("/admin_login.html",function(req,res){
    console.log("admin");
    res.sendFile(__dirname + "/admin/admin_login.html");
})

app.post("/admin_login.html",function(req,res){
    let usn = req.body.username;
    let password = req.body.password;

    console.log(usn);
    console.log(password);

    const sql = 'SELECT * FROM administrator WHERE username = ? AND password = ?';
  connection.query(sql, [usn, password], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
    } else if (results.length === 1) {
      // Valid login
      console.log("Login Succesfull");
      res.redirect("/admin-portal.html");
    } else {
      // Invalid login
      res.send('Invalid username or password');
}
    });


})

app.get("/admin-portal.html",function(req,res){
   
    res.sendFile(__dirname + "/admin/admin-portal.html");
})

app.get("/add-flights",function(req,res){
    res.sendFile(__dirname + "/admin/add-flights.html");
})

app.post("/add-flight",function(req,res){
    var flightNumber = req.body.flightNumber;
    var flightDate = req.body.flightDate;
    var flightTime = req.body.flightTime;
    var startDestination= req.body.startDestination;
    var endDestination = req.body.endDestination;

    console.log(flightNumber,flightDate,flightTime,startDestination,endDestination);

    const sql =
        "INSERT INTO flight(flight_no,flight_date,flight_time,start_dest,end_dest) VALUES (?, ?,?,?,?)";
    const values = [
        flightNumber,
        flightDate,
        flightTime,
        startDestination,
        endDestination
    ];

    connection.query(sql, values, (error, result) => {
        if (error) {
            console.error("Failed to save details:", error);
            //res.status(500).send("Failed to save booking.");
        } else {
            console.log("Flight added:", result);
            //res.status(200).send("Booking added Succesfully!");
        }
    });
})

app.get("/remove-flights",function(req,res){
    res.sendFile(__dirname + "/admin/remove-flights.html");
})

app.post("/remove-flight",function(req,res){
    var num = req.body.flightNumber;
    console.log(num);

    const sql = "delete from flight where flight_no = ?";
    connection.query(sql, num, function (err, result) {
        if (err) throw err;
        //res.status(200).send("Booking deleted successfully!"); // Send success response
        else
        console.log("successfull");
    });
})

app.get('/view-bookings', function(req, res) {
    res.sendFile(__dirname + "/admin/view-bookings.html");
 })

 app.post("/view-booking",function(req,res){

    
    const sql = 'select b.booking_id,b.username,f.flight_no,f.flight_date,f.start_dest,f.end_dest,f.flight_time from booking as b join flight as f where b.flight_no = f.flight_no';

    let queryValue = "";

    connection.query(sql,queryValue,(err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error fetching flights" });
        }

        console.log(results);
        res.json(results); // Send the results as JSON
    });
 })

app.get("/user_login.html",function(req,res){
   
    res.sendFile(__dirname + "/user/user_login.html");
})

app.post("/user_login.html",function(request,res){
    const un = request.body.username;
    const password = request.body.password;

    console.log(un);
    console.log(password);

    const sql = 'SELECT * FROM user WHERE username = ? AND pass = ?';
  connection.query(sql, [un, password], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
    } else if (results.length === 1) {
      // Valid login
      console.log("Login Succesfull");
      request.session.userId = un;
      console.log(request.session.userId);
      res.redirect("/user-portal.html");
    } else {
      // Invalid login
      res.send('Invalid username or password');
}
    });

})

app.get("/user-portal.html",function(req,res){
    res.sendFile(__dirname + "/user/user-portal.html");
})

app.get("/book-tickets",function(req,res){
    res.sendFile(__dirname + "/user/book-tickets.html");
})

app.post("/book-ticket",function(req,res){
    const sd = req.body.std;
    const ed = req.body.etd ;
    const date = req.body.dat;
    
    //console.log(req.body);
    let sql;
   // let params;

    sql = 'SELECT * FROM flight WHERE start_dest = ? AND end_dest = ? AND flight_date = ?';


    connection.query(sql, [sd , ed , date], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error fetching flights" });
        }

        //console.log(results);
        res.json(results); // Send the results as JSON
    });
})

app.post("/add-booking",function(req,res){
    const sd = req.body.std;
    const ed = req.body.end;
    const fn = req.body.fno;
    //const date = req.body.date;
    const time = req.body.time;
    const avail = req.body.avail;
    const userId = req.session.userId;


    let a = avail - 1;

   console.log(userId);

    const sql =
        "INSERT INTO booking(username,flight_no) VALUES (?,?)";
    const values = [
       userId,
       fn
    ];

    connection.query(sql, values, (error, result) => {
        if (error) {
            console.error("Failed to save booking:", error);
            //res.status(500).send("Failed to save booking.");
        } else {
            console.log("Booking saved:", result);
            const sql1 =
        "UPDATE flight SET availability = ? WHERE flight_no = ?";
    connection.query(sql1, [a,fn], function (err, result) {
        if (err) throw err;
        res.status(200).send("Booking updated Succesfully!"); // Send success response
    });
        }
    });

    
})

app.get('/user-view-bookings', function(req, res) {
    res.sendFile(__dirname + "/user/user-view-bookings.html");
 })

 app.post('/user-view-bookings', function(req, res) {
    const usn = req.session.userId;
    const sql = 'select b.booking_id, b.username,f.flight_no,f.flight_date,f.start_dest,f.end_dest,f.flight_time from booking as b join flight as f where b.flight_no = f.flight_no and b.username = ?';

    let queryValue = usn;

    connection.query(sql,queryValue,(err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error fetching flights" });
        }

        console.log(results);
        res.json(results); // Send the results as JSON
    });
 })

 app.get("/logout",function(req,res){
    res.redirect("/user_login.html");
 })

app.get("/signup.html",function(req,res){
    res.sendFile(__dirname + "/signup.html");
})

app.post("/signup.html",function(req,res){
    var un = req.body.username;
    var pass = req.body.password;
    var email = req.body.email;
    var name = req.body.name;

    console.log(name,email,un,pass);
    

    //Save the booking information in the database
    const sql =
        "INSERT INTO user(Uname,email,username,pass) VALUES (?,?,?,?)";
    const values = [
       name,
       email,
       un,
       pass
    ];

    connection.query(sql, values, (error, result) => {
        if (error) {
            console.error("Failed to save user:", error);
            //res.status(500).send("Failed to save booking.");
        } else {
            console.log("User saved:", result);
            //res.status(200).send("Booking added Succesfully!");
        }
    });
})

app.listen(3000,function(){
    console.log("Server started on port 3000");
})
