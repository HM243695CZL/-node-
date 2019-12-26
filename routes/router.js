const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
   res.json({
       name: "hm243695czl"
   })
});

module.exports = router;