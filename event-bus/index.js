const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const events = [];

app.post("/events", (req, res) => {
	const event = req.body;

	events.push(event);
	// post
	axios.post("http://localhost:4000/events", event).catch((err) => {
    console.log(err.message);});
    // comment
	axios.post("http://localhost:4001/events", event).catch((err) => {
    console.log(err.message);});
    // query
	axios.post("http://localhost:4002/events", event).catch((err) => {
    console.log(err.message);});
    // moderation
    axios.post("http://localhost:4003/events", event).catch((err) => {
    console.log(err.message);});

	res.send({ status: "Ok"});
});

app.get("/events", (req, res) => {
	res.send(events);
})

app.listen(4005, () => {
	console.log("listening on 4005")
});