const express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const Category = mongoose.model("Category");

router.get("/", (req, res) => {
  res.render("category/addOrEdit", {
    viewTitle: "Insert Category",
  });
});

router.post("/", (req, res) => {
  if (req.body._id == "") {
    insertRecord(req, res);
  } else {
    updateRecord(req, res);
  }
});

function insertRecord(req, res) {
  var category = new Category();
  category.categoryName = req.body.categoryName;
  category.categoryFor = req.body.categoryFor;

  category.save((err, doc) => {
    if (!err) {
      console.log("Hix");
      res.redirect("category/list");
    } else {
      console.log(err);
      if (err.name == "ValidationError") {
        handleValidationError(err, req.body);
        res.render("category/addOrEdit", {
          viewTitle: "Insert Category",
          category: req.body,
        });
      } else console.log("Error during record insertion : " + err);
    }
  });
}

function updateRecord(req, res) {
  Category.findOneAndUpdate(
    { _id: req.body._id },
    req.body,
    { new: true },
    (err, doc) => {
      if (!err) {
        res.redirect("category/list");
      } else {
        if (err.name == "ValidationError") {
          handleValidationError(err, req.body);
          res.render("category/addOrEdit", {
            viewTitle: "Update Category",
            employee: req.body,
          });
        } else console.log("Error during record update : " + err);
      }
    }
  );
}


router.get("/list", (req, res) => {
 //  const docs =  Category.find();
// if(docs)
// {
//    res.render("category/list", {
//        list: docs,
//    });
// }else {
//       console.log("Error in retrieving category list :");
// }
 
  Category.find((err, docs) => {
    if (!err) {
      res.render("category/list", {
        list: docs,
      });
    } else {
      console.log("Error in retrieving category list :" + err);
    }
  });
});

function handleValidationError(err, body) {
  for (field in err.errors) {
    switch (err.errors[field].path) {
      case "categoryName":
        body["categoryNameError"] = err.errors[field].message;
        break;
      case "categoryFor":
        body["categoryForError"] = err.errors[field].message;
        break;
      default:
        break;
    }
  }
}

router.get("/:id", (req, res) => {
  Category.findById(req.params.id, (err, doc) => {
    if (!err) {
      res.render("category/addOrEdit", {
        viewTitle: "Update Category",
        category: doc,
      });
    }
  });
});

router.get("/delete/:id", (req, res) => {
  Category.findByIdAndRemove(req.params.id, (err, doc) => {
    if (!err) {
      res.redirect("/category/list");
    } else {
      console.log("Error in category delete :" + err);
    }
  });
});

module.exports = router;
