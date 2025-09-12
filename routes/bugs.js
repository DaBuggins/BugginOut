const express = require("express");
const router = express.Router();
const bugs = require("../controllers/bugs");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateBug } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

// groups routes for /bugs
router
  .route("/")
  .get(catchAsync(bugs.index))
  .post(isLoggedIn, upload.array('image'), validateBug, catchAsync(bugs.createBug));


router.get("/new", isLoggedIn, bugs.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(bugs.showBug))
  .put(isLoggedIn, isAuthor, upload.array('image'), validateBug, catchAsync(bugs.updateBug))
  .delete(isLoggedIn, isAuthor, catchAsync(bugs.deleteBug));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(bugs.renderEditForm));

module.exports = router;
