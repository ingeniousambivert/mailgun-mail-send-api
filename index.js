// jshint esversion:6
const express = require("express");
const mailgun = require("mailgun-js");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// GET Request on INDEX
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// POST Request on INDEX
app.post("/", (req, res) => {
  const {
    firstname,
    lastname,
    userAPIkey,
    emailFrom,
    emailTo,
    userDomain,
    userSubject,
    message
  } = req.body;
  const name = firstname + lastname;

  if (
    !firstname ||
    !lastname ||
    !userAPIkey ||
    !emailFrom ||
    !emailTo ||
    !userDomain ||
    !userSubject ||
    !message
  ) {
    res.sendFile(__dirname + "/failed.html");
    res.status(400);
  } else {
    if (res.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.status(400);
      res.sendFile(__dirname + "/failed.html");
    }
  }
  const mg = mailgun({
    apiKey: userAPIkey,
    domain: userDomain
  });
  const data = {
    from: name + emailFrom,
    to: emailTo,
    subject: userSubject,
    text: message
  };
  mg.messages().send(data, (error, body) => {
    console.log(body);
    if (error) {
      console.log(error);
    }
  });
});

app.listen(5000, console.log("Server ON - Port : 5000"));
