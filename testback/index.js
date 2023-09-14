const express = require("express");
const app = express();
const port = 8000;
app.get('/', (req,res) => res.send("Home Page"));
app.get('/login', (req,res) => res.send("Login route"));
app.get('/signout', (req,res) => res.send("Signout route"));
app.listen(port, () => console.log("server is up and running..."));

