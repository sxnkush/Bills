const express = require("express");
const { handleFetchBill, handleCreateBill } = require("../controllers/bill");
const router = express.Router()


router.get("/", handleFetchBill)
router.post("/", handleCreateBill)

module.exports = router;