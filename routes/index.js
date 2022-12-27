import express from "express";

let router = express.Router();

// routes
router.get("/", (req,res) => {
  res.render("index", {
    title:"Ecommerce"
  })
})

export default router;

