const mongoose = require("mongoose");

var categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: "This field is required.",
  },
  categoryFor: {
    type: String,
    required: "This field is required.",
  },
});
mongoose.model("Category", categorySchema);
