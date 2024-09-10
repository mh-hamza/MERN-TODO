require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const PORT = process.env.PORT || 3000 
const app = express();
// Middleware
app.use(express.json())
app.use(cors());
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mern_todo_app').then(() => console.log('Connected to MongoDB')).catch(error => console.error('Error connecting to MongoDB:', error));
  



 const todoSchema = new mongoose.Schema({
  title: String,
  completed: Boolean
 }) 
  
const Todo = mongoose.model('Todo', todoSchema)

app.get('/', (req, res) => {
  res.send("Welcome to Mongo DB!") 
})

app.get('/todos', async(req, res) => {
  const todos = await Todo.find();
  // console.log(todos); 
  res.status(200).json(todos)
})
app.post('/todos', async(req, res)=>{
  const newTodo = await Todo.create(req.body);
  res.status(201).json(newTodo)
})

app.delete('/todos/:id', async(req, res) => {
  await Todo.findByIdAndDelete(req.params.id)
  res.status(200).json({message: "Todo deleted"})
})

app.put('/todos/:id', async (req, res) => {
  try {
    const updateTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title, completed: req.body.completed },
      { new: true } // Return the updated document
    );
    if (!updateTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.status(200).json(updateTodo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, ()=>console.log("Server listening on port 5000"))