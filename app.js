const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

app.use(express.json());
app.use(cors({
  origin: '*'
}));
const connectString = 'mongodb+srv://user:Ki11yourself@cluster0.vjq7std.mongodb.net/?retryWrites=true&w=majority'
const TasksSchema = new mongoose.Schema({
  text: { type: String },
  completed: {type: Boolean}
});
app.get('/', (req, res, next) => {
    try{
      const connection = mongoose.createConnection(connectString);
      const Tasks = connection.model('tasks', TasksSchema);
      Tasks.find().limit(20).sort({ $natural: -1 }).then(response => {
        connection.close()
        res.status(200).json(response);
      })
    } catch (e){
      res.status(404).json(e.message);
    }
});

app.post('/', (req, res) => {
  const {body} = req;
  if(!body.text){
    res.status(404).send('Error');
  }
  try{
    const connection = mongoose.createConnection(connectString);
    const Tasks = connection.model('tasks', TasksSchema);
    Tasks.create({
      text: body.text,
      completed: !!body.completed
    }).then(() => {
      Tasks.find().limit(20).sort({ $natural: -1 }).then(response => {
        connection.close()
        res.json(response);
      }).catch(e => {
        connection.close()
        res.status(404).send('Error');
      })
    }).catch(e => {
      connection.close()
      res.status(404).send('Error');
    })
  } catch (e){
    console.log(e)
    res.status(404).send('Error');
  }
});
app.put('/', (req, res) => {
  const {body} = req;
  if(!body.id){
    res.status(404).send('Error');
  }
  try{
    const connection = mongoose.createConnection(connectString);
    const Tasks = connection.model('tasks', TasksSchema);

    Tasks.findByIdAndUpdate(body.id, {completed: body.completed}, {
      new: true
    }).then(() => {
      Tasks.find().limit(20).sort({ $natural: -1 }).then(response => {
        connection.close()
        res.json(response);
      }).catch(e => {
        connection.close()
        res.status(404).send('Error');
      })
    }).catch(e => {
      connection.close()
      res.status(404).send('Error');
    })
  } catch (e){
    console.log(e)
    res.status(404).send('Error');
  }
});
app.delete("/", (req, res) => {
  const {id} = req.query;
  
  if(!id){
    res.status(404).send('Error');
  }
  
  try{
    const connection = mongoose.createConnection(connectString);
    const Tasks = connection.model('tasks', TasksSchema);
    Tasks.deleteOne({ _id: id }).then(() => {
      Tasks.find().limit(20).sort({ $natural: -1 }).then(response => {
        connection.close()
        res.json(response);
      }).catch(e => {
        connection.close()
        res.status(404).send('Error');
      })
    }).catch(e => {
      connection.close()
      res.status(404).send('Error');
    })
  } catch (e){
    res.status(404).send('Error');
  }
  
});
module.exports = app;