// modulos
import express from "express";
import passport from "passport";
import { transporter } from "../app.js"

// archivos
import getProductos from "../controllers/getProductos.js";
import Cart from "../models/Carrito.js"
import Producto from "../models/Producto.js";
import Orden from "../models/Orden.js";


let router = express.Router();

// routes
// HOME
router.get("/",(req,res,next)=>{
  if (req.isAuthenticated()){
    return next()
  } else {
    res.redirect("/register")
  }
}, getProductos);

router.get("/productos", getProductos)

// REGISTER
router.get("/register", (req,res) => {
  res.render("register")
});

router.post("/register", passport.authenticate("local-register", {
  successRedirect: "/",
  failureRedirect: "/register",
  passReqToCallback: true
}));

// LOGIN
router.get("/login", (req,res) => {
  res.render("login")
});

router.post("/login", passport.authenticate("local-login", {
  successRedirect: "/",
  failureRedirect: "/login",
  passReqToCallback: true
}));

// LOGOUT
router.get("/logout", (req,res) => {
  req.session.destroy();
  res.redirect("/login")
});

// CARRITO
router.get("/carrito", (req,res) => {
  if (!req.session.cart) {
    return res.render("carrito", {productos: null})    
  }
  let cart = new Cart(req.session.cart);
  res.render("carrito", {productos: cart.crearArray(), precioTotal: cart.precioTotal})
  
});

router.get('/agregar-al-carrito/:id', function (req, res) {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});

  Producto.findById(productId, function (err, product) {
      if(err) {
          return res.redirect('/');
      }
      cart.agregarProducto(product, product.id);
      req.session.cart = cart;
      res.redirect('/');
  })
});

router.get('/carrito/eliminar-item/:id', function (req, res) {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.eliminarProducto(productId);
  req.session.cart = cart;
  res.redirect('/carrito');
});

router.get('/carrito/reducir-item/:id', function (req, res) {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.reducirUno(productId);
  req.session.cart = cart;
  res.redirect('/carrito');
});

router.post("/carrito/comprar", (req,res) => {
  if (!req.session.cart) {
    res.redirect("/carrito")
  }
  let cart = new Cart(req.session.cart);
  let hoy = new Date()
  let orden = new Orden({
    usuario: req.user,
    carrito: cart.productos,
    fechaYHora: hoy.toLocaleString(),
    estado: "Generada",
    email: req.user.email,
  });
  orden.save(function (err, resultado){
    req.flash("exito", "La compra fue realizada con exito!");
    req.session.cart = null;
    transporter.sendMail({
      from: "Ecommerce Juan Pablo Mas",
      to: req.user.email,
      subject: "Compra exitosa",
      html: `<h2 style="color: green;">Su compra ha sido un exito</h2>
      <br>
      <h2>Su pedido:</h2><br>
      <p>${JSON.stringify(cart.productos)}</p><br>
      <h3>Precio Total: $${cart.precioTotal}</h3><br>
      `
    })
    res.redirect("/")
  })
})

// CHAT
router.get("/chat", (req,res) => {
  let userEmail = req.user.email;
  res.render("chat", {email: userEmail})
});

// CATEGORIAS
router.get("/categoria/:categoria", async (req,res) => {
  let categoria = req.params.categoria;
  let productos = await Producto.find({ category: categoria }); 
  res.render("index", {productos})
})


export default router;

