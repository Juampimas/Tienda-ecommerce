// modulos
import express from "express"
import cookieParser from "cookie-parser";
import session from "express-session"
import passport from "passport"
import flash from "connect-flash"
import MongoStore from "connect-mongo";
import http from "http"
import { createTransport } from "nodemailer";
import {Server} from 'socket.io';

// Nodemailer
export const transporter = createTransport({
  service: 'gmail',
  port: 587,
  auth: {
      user: "juampim98@gmail.com",
      pass: 'kmjpamxvfmqjnojz'
  }
});

// archivos
import indexRoutes from "./routes/index.js"

// Inicializaciones
import "./passport/local-auth.js"
import "./config/database.js"

const app = express();
const server = http.createServer(app);
const io = new Server(server)

// settings
app.set("views", "./views");
app.set("view engine", "ejs");

// middlewares
app.use(express.static("./public"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser())
app.use(session({
  secret: "misesionsecreta",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({mongoUrl:'mongodb://localhost:27017/ecommerce'}),
  cookie: {maxAge: 180 * 60 * 1000}
}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session()); 
app.use((req, res, next) => {
  app.locals.registroMensaje = req.flash("registroMensaje");
  app.locals.loginMensaje1 = req.flash("loginMensaje1");
  app.locals.loginMensaje2 = req.flash("loginMensaje2");
  app.locals.exito = req.flash("exito");
  res.locals.session = req.session;
  next();
})


// routes
app.use(indexRoutes);

// port
const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`El servidor se está escuchando por el puerto ${port}`);
})

// const io = new IOServer(servidor);


// websockets
// const socket = io()

io.on("connection", (socket) => {
  socket.on("chat", (msg) => {
    io.emit("chat", msg)
  })
})