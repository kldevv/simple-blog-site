const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();

const handleEvent = async (type, data) => {
	if (type === "CommentCreated") {
		const status = data.content.toLowerCase().includes("nuclear") ? "rejected" : "approved";

		await axios.post("http://event-bus-clusterip-srv:4005/events", {
			type: "CommentModerated",
			data: {
				id: data.id,
				postId: data.postId,
				status,
				content: data.content
			}
		});
	}
};

app.use(bodyParser.json());

app.post("/events", async (req, res) => {
	const { type , data } = req.body;
	console.log('Received Events', req.body);
	handleEvent(type, data);

	res.send({});
});

app.listen(4003, async () => {
	console.log("listening on 4003");

	const res = await axios.get("http://event-bus-clusterip-srv:4005/events");

	for (let event of res.data) {
		console.log("processing event:", event.type);
		handleEvent(event.type, event.data);
	}
});

