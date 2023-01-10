import express from "express";


import getProductos from "../controllers/getProductos.js";


let router = express.Router();

// routes
// HOME
router.get("/", getProductos)

// REGISTER
router.get("/register", (req,res) => {
  res.render("register")
});

router.post("/register", (req,res) => {
  res.render("register")
})

// LOGIN
router.get("/login", (req,res) => {
  res.render("login")
})

// CARRITO
router.get("/carrito", (req,res) => {
  res.render("carrito")
})



export default router;

