const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const playerController = require('./playerController');

const PORT = 3000;

mongoose.connect('mongodb://jeffreyma:jeffreyma@ec2-52-89-83-246.us-west-2.compute.amazonaws.com:27017/scratchDB', function() {
  mongoose.connection.db.dropDatabase();
});
mongoose.connection.once('open', () => {
  console.log('Connected to Database');
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../client')));

// Create a student in the database
// localhost://3000/student
app.get('/', (req, res) => {
  mongoose.connection.db.dropDatabase();
  res.sendFile(path.join(__dirname, '../index.html'));
});

app.get('/player2', (req, res) => {
  res.sendFile(path.join(__dirname, '../index2.html'));
});

app.get('/player3', (req, res) => {
  res.sendFile(path.join(__dirname, '../index3.html'));
});

app.get('/player4', (req, res) => {
  res.sendFile(path.join(__dirname, '../index4.html'));
});

app.get('/check', playerController.getAllUsers);

app.post('/start', playerController.createPlayer);

app.get('/player/:player', playerController.getPlayer);

app.put('/player/:player', playerController.updatePlayer);

// // Delete a student from the database
// // localhost://3000/student/"name"
// app.delete('/:name', playerController.deletePlayer);

// app.use('/player', playerRouter);



app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
