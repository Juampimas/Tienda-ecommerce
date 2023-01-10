// modulos
import express from "express"
import mongoose from "mongoose"
import session from "express-session"
import passport from "passport"
import PassportLocal from "passport-local"
import sfs from "session-file-store"

// archivos
import database from "./config/database.js"
import indexRoutes from "./routes/index.js"
import getProductos from "./controllers/getProductos.js"

const app = express();

// db connection
mongoose.connect(database);
let db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log(`Conectado a MongoDB: ${database}`);
});


// settings
app.set("views", "./views");
app.set("view engine", "ejs");

// middlewares
app.use(express.static("./public"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(indexRoutes);


// Session
let LocalStrategy = PassportLocal.Strategy;
const FileStore = sfs(session);
const store = new FileStore({ path: "./sesiones", ttl: 300, retries:0 })

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

// Passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(function(username,password,done){
  if (username === "Juan Pablo" && password === "123456"){
    return done(null, {id:1, nombre:username})
  } else{
    done(null, false)
  }
}))

passport.serializeUser(function(user,done){
  done(null,user.id)
});

passport.deserializeUser(function(id,done){
  done(null,{id:1, nombre:"juan"})
});

// routes
app.use("/", getProductos)

app.get("/",(req,res,next)=>{
  if (req.isAuthenticated()){
    return next()
  } else {
    res.redirect("/register")
  }
}, (req,res) => {
    res.render("index")
})

app.get("/register", (req,res) => {
  res.render("register")
})

app.post("/register", (req,res) => {
  res.redirect("/login")
})

app.get("/login", (req,res) => {
  res.render("login")
})

app.post("/login", (req,res) => {
  const nombre = req.body.nombre;
  req.session.user = nombre;
  req.session.admin = true;
  console.log(req.session);
  res.render("index")
})

app.post("/login", passport.authenticate("local",{
  successRedirect:"/",
  failureRedirect:"/login"
}));

app.get("/logout", (req,res) => {
  req.session.destroy(err => {
    if (err) {
        res.json({ status: 'Logout ERROR', body: err })
    } else {
          res.redirect("/")
      }
  })
});




// port
const port = 3000;

app.listen(port, () => {
    console.log(`El servidor se está escuchando por el puerto ${port}`);
})