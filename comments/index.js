const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commenByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
	res.send(commenByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
	const commentId = randomBytes(4).toString("hex");
	const { content } = req.body;
	const comments = commenByPostId[req.params.id] || [];

	comments.push({ id: commentId, content, status: "pending" });
	commenByPostId[req.params.id] = comments;

    await axios.post("http://localhost:4005/events", {
        type: "CommentCreated",
        data: {
            id: commentId, 
            content,
            postId: req.params.id,
            status: "pending" 
        }
    });

	res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
    console.log('received events', req.body.type);

    const { type, data } = req.body;
    if (type === "CommentModerated") {
    	const { postId, id, status, content } = data;

    	const comments = commenByPostId[postId];

    	const comment = comments.find(comment => {
    		return comment.id === id;
    	});
    	comment.status = status;

    	await axios.post("http://localhost:4005/events", {
    		type: "CommentUpdated",
    		data: {
    			id,
    			postId,
    			status,
    			content
    		}
    	});
    }

    res.send({});
});

app.listen(4001, () => {
	console.log("listening on 4001")
});
