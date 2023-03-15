import passport from "passport";
import PassportLocal from "passport-local"
import bcrypt from "bcrypt"

import Usuario from "../models/Usuario.js";

let LocalStrategy = PassportLocal.Strategy;

passport.serializeUser((usuario, done) => {
    done(null, usuario.id)
});

passport.deserializeUser(async (id, done) => {
    const usuario = await Usuario.findById(id);
    done(null, usuario)
});

passport.use("local-register", new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
}, async (req, email, password, done) => {
    const usuario = await Usuario.findOne({email: email});
    if (usuario) {
        return done(null, false, req.flash("registroMensaje", "El email ingresado ya existe"))        
    } else {
        const nuevoUsuario = new Usuario();
        nuevoUsuario.email = email;
        nuevoUsuario.password = nuevoUsuario.encryptPassword(password);
        await nuevoUsuario.save();
        done(null, nuevoUsuario);
    }
}));

passport.use("local-login", new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
}, async(req, email, password, done) => {
    const usuario = await Usuario.findOne({email:email});
    if(!usuario){
        return done(null, false, req.flash("loginMensaje1", "El usuario no existe"));
    }
    let result = bcrypt.compareSync(password, usuario.password);
    if (!result) {
        return done(null, false, req.flash("loginMensaje2", "La contraseña es incorrecta"));
    }
    done(null, usuario)
})) 