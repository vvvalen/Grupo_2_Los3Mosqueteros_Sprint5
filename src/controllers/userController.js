const { validationResult } = require("express-validator");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");

const universalModel = require("../model/universalModel");
const userModel = universalModel("users");

const userController = {

    // 1. Mostrar form register
    register: (req,res) =>{
        res.render("users/register",{

            title: "Register"
        })

        
    },

    // 2. Procesar registros
    processRegister: (req, res) => {
        const { file } = req;

        const errores = validationResult(req);

        if(!errores.isEmpty()){
            if(file){
                const filePath = path.join(__dirname, `../../public/images/users/${file.filename}`);
                fs.unlinkSync(filePath);
            }

            console.log(req.body);

            delete req.body.password;
            delete req.body.rePassword;

            console.log(req.body);

            return res.render("users/register", {
                errors: errores.mapped(),
                oldData: req.body,
                title: "Register"
            
            })
        }
        
        const existeEmail = userModel.findFirstByField("email", req.body.email);

        if(existeEmail){
            if(file){
                const filePath = path.join(__dirname, `../../public/images/users/${file.filename}`);
                fs.unlinkSync(filePath);
            }

            const error = {
                email: {
                    msg: "Este email ya está registrado"
                }
            }

            return res.render("users/register", {
                errors: error,
                oldData: req.body,
                title: "Register"
            })
        }

        delete req.body.rePassword;

        const newUsuario = {
            ...req.body,
            password: bcrypt.hashSync(req.body.password, 10),
            checkpassword: bcrypt.hashSync(req.body.checkpassword, 10),
            image: file ? file.filename : "default-user.svg"
        };

        userModel.create(newUsuario);

        return res.redirect("login");
    },

    // 3. Mostrar form login
    login: (req,res) =>{
        res.render("users/login",
        {
            title: "Login"
        }
        )
    },

    // 4. Procesar login
    processLogin: (req, res) => {
        const errores = validationResult(req)

      if(!errores.isEmpty()){
          return res.render("users/login", {
              errors: errores.mapped(),
              oldData: req.body,
              title: "Login"
          })
      }
      const usuarioRegistrado = userModel.findFirstByField("email",req.body.email);

      if(!usuarioRegistrado){
          const error = {
              email: {
                  msg: "Este email no se encuentra en nuestra base de datos"
              }
          }
          return res.render("users/login", {
              errors: error,
              oldData: req.body,
              title: "Login"
          })
      }

      const passwordCoincide = bcrypt.compareSync(req.body.password, usuarioRegistrado.password );

      if(!passwordCoincide){
          const error = {
              password: {
                  msg: "Las credenciales son inválidas"
              }
          }
          return res.render("users/login", {
              errors: error,
              oldData: req.body,
              title: "Login"
          })
      }

      delete usuarioRegistrado.password;

      req.session.usuarioLogueado = usuarioRegistrado;
      
      if(req.body.rememberUser){
          res.cookie("userEmail", req.body.email, { maxAge: 60 * 1000 * 60 * 24 * 30 })
      }
      return res.redirect("/users/profile");
  },

  // 5. Vista de usuario logueado, falta pagina y url
  profile: (req, res) => {
      return res.render('users/profile',
      {
          title: "Profile"
      });
  },
    // 6. Logout user
    logout: (req, res) => {
        res.clearCookie('userEmail');
        req.session.destroy();
        return res.redirect('/');
    }
    

}

module.exports = userController