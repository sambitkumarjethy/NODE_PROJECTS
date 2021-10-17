require("./models/db");

const express = require("express");
const path = require("path");
var multer = require("multer");
const exphbs = require("express-handlebars");
const bodyparser = require("body-parser");

const categoryController = require("./controllers/categoryController");
const employeeController = require("./controllers/employeeController");
const productController = require("./controllers/productController");

var app = express();
app.use(
  bodyparser.urlencoded({
    extended: true,
  })
);
app.use(bodyparser.json());
app.set("views", path.join(__dirname, "/views/"));
app.engine(
  "hbs",
  exphbs({
    extname: "hbs",
    defaultLayout: "mainLayout",
    layoutsDir: __dirname + "/views/layouts/",
  })
);
app.set("view engine", "hbs");

app.listen(3000, () => {
  console.log("Express server started at port : 3000");
});

app.use("/category", categoryController);
app.use("/employee", employeeController);
app.use("/product", productController);
//app.use("/product/profile-upload-single", productController);

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
var upload = multer({ storage: storage });
app.post(
  "/product/profile-upload-multiple",
  upload.array("profile-files", 12),
  function (req, res, next) {
    // req.files is array of `profile-files` files
    // req.body will contain the text fields, if there were any
    console.log(JSON.stringify(req.file));
    var response = '<a href="/">Home</a><br>';
    response += "Files uploaded successfully.<br>";
    for (var i = 0; i < req.files.length; i++) {
      response += `<img src="${req.files[i].path}" /><br>`;
    }

    return res.send(response);
  }
);
