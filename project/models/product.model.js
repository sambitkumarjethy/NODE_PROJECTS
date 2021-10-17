const mongoose = require("mongoose");

var productSchema = new mongoose.Schema({
  product_name: {
    type: String,
    required: "This field is required.",
  },
  category_id: {
    type: String,
    required: "This field is required.",
  },
  product_img: {
    type: String,
    required: "This field is required.",
  },
});
mongoose.model("Product", productSchema);
