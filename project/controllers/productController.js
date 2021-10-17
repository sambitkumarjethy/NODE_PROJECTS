const express = require("express");
var multer  = require('multer')
var port = 3000;

var app = express()
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
var upload = multer({ storage: storage })


var router = express.Router();
const mongoose = require("mongoose");
const Product = mongoose.model("Product");


router.get("/", (req, res) => {
  res.render("product/addOrEdit", {
    viewTitle: "Insert Product",
  });
});



app.post('/prouct/profile-upload-single', upload.single('profile-file'), function (req, res, next) {
  // req.file is the `profile-file` file
  // req.body will hold the text fields, if there were any
  console.log(JSON.stringify(req.file))
  var response = '<a href="/">Home</a><br>'
  response += "Files uploaded successfully.<br>"
  response += `<img src="${req.file.path}" /><br>`
  return res.send(response)
})

function insertRecord(req, res) {
  console.log('x');
}
function updateRecord(req, res) {
   console.log('y');
   
}
function insertRecordx(req, res) {
  var Product = new Product();
  Product.fullName = req.body.fullName;
  Product.email = req.body.email;
  Product.mobile = req.body.mobile;
  Product.city = req.body.city;
  Product.save((err, doc) => {
    if (!err) res.redirect("Product/list");
    else {
      if (err.name == "ValidationError") {
        handleValidationError(err, req.body);
        res.render("Product/addOrEdit", {
          viewTitle: "Insert Product",
          Product: req.body,
        });
      } else console.log("Error during record insertion : " + err);
    }
  });
}

function updateRecordx(req, res) {
  Product.findOneAndUpdate(
    { _id: req.body._id },
    req.body,
    { new: true },
    (err, doc) => {
      if (!err) {
        res.redirect("Product/list");
      } else {
        if (err.name == "ValidationError") {
          handleValidationError(err, req.body);
          res.render("Product/addOrEdit", {
            viewTitle: "Update Product",
            Product: req.body,
          });
        } else console.log("Error during record update : " + err);
      }
    }
  );
}

router.get("/list", (req, res) => {
  Product.find((err, docs) => {
    if (!err) {
      res.render("Product/list", {
        list: docs,
      });
    } else {
      console.log("Error in retrieving Product list :" + err);
    }
  });
});

function handleValidationError(err, body) {
  for (field in err.errors) {
    switch (err.errors[field].path) {
      case "fullName":
        body["fullNameError"] = err.errors[field].message;
        break;
      case "email":
        body["emailError"] = err.errors[field].message;
        break;
      default:
        break;
    }
  }
}

router.get("/:id", (req, res) => {
  Product.findById(req.params.id, (err, doc) => {
    if (!err) {
      res.render("Product/addOrEdit", {
        viewTitle: "Update Product",
        Product: doc,
      });
    }
  });
});

router.get("/delete/:id", (req, res) => {
  Product.findByIdAndRemove(req.params.id, (err, doc) => {
    if (!err) {
      res.redirect("/Product/list");
    } else {
      console.log("Error in Product delete :" + err);
    }
  });
});

module.exports = router;
