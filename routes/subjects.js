const express = require("express");
const router = new express.Router();
const Subject = require("../module/Subject");
const auth = require("../middleware/authm");
const { body, validationResult, check } = require("express-validator");
// @route Get  api/subjects
// @desc  Get  all subjects
// @access private
router.get("/", auth, async (req, res) => {
  try {
    let subjects = await Subject.find({ user: req.user.id }).sort({ date: -1 });
    res.json(subjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ errorMsg: error.message });
  }
});

// @route post  api/contacts
// @desc   create subjects
// @access public
router.post(
  "/",
  [body("subject", "Please Enter subject name").notEmpty()],
  auth,
  async (req, res) => {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { subject } = req.body;

    try {
      const newSubject = new Subject({
        subject,
        user: req.user.id,
      });
      const sublist = await newSubject.save();
      res.json(sublist);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "internal server error" });
    }
  }
);

// @route PUT  api/subjects
// @desc   update subjects
// @access private
router.put("/:id", auth, async (req, res) => {
  const { subject } = req.body;
  const subjectinfo = {};
  if (subject) subjectinfo.subject = subject;

  try {
    let sub = await Subject.findById(req.params.id);
    if (!sub) {
      return res.status(404).json({
        msg: "Subject not found",
      });
    }

    if (sub.user.toString() != req.user.id) {
      return res.status(401).json({
        msg: "Not authorized",
      });
    }

    sub = await Subject.findByIdAndUpdate(
      req.params.id,
      { $set: subjectinfo },
      { new: true }
    );

    res.json(sub);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "internal server error" });
  }
});

// @route DELETE  api/subjects
// @desc   update subjects
// @access private
router.delete("/:id", auth, async (req, res) => {
  try {
    let sub = await Subject.findById(req.params.id);
    if (!sub) {
      return res.status(404).json({
        msg: "Subject not found",
      });
    }

    if (sub.user.toString() != req.user.id) {
      return res.status(401).json({
        msg: "Not authorized",
      });
    }

    await Subject.findByIdAndRemove(req.params.id);

    res.json({
      msg: "Record deleted successfully",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "internal server error" });
  }
});

module.exports = router;
