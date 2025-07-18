const { Schema, model } = require("mongoose");

const TodoSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  checked: {
    type: Boolean,
    default: false,
  },
});

module.exports = model("Todos", TodoSchema);
