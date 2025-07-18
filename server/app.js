const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const Todo = require("./mongo/todo");
const app = express();

app.use(cors());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

app.use('/frontend', express.static(path.join(__dirname, '../frontend')));

app.use(
  "/node_modules",
  express.static(path.join(__dirname, "../node_modules"))
);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

mongoose
  .connect(
    "mongodb+srv://anasteisha18unforgiven:O0uR3GedDU9MiCY4@cluster0.bact8qh.mongodb.net/todos?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(8080, () => {
  console.log("Server is running at http://localhost:8080");
});

app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch todos" });
  }
});

app.post("/todos", async (req, res) => {
  try {
    const newTodo = new Todo(req.body);
    const saved = await newTodo.save();
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.json(saved);
  } catch (error) {
    res.status(500).json({ message: "Failed to create todo" });
  }
});

app.put("/todos/:id", async (req, res) => {
  try {
    const updated = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update todo" });
  }
});

app.delete("/todos/:id", async (req, res) => {
  try {
    const result = await Todo.findByIdAndDelete(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to delete todo" });
  }
});
