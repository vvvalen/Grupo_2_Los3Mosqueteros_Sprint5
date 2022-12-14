const { body } = require("express-validator");
const path = require('path');

const userRegisterValidation = [
    body("firstname")
        .notEmpty().withMessage("El campo no puede estar vacío").bail()
        .isLength({ min: 2 }).withMessage("El nombre debe contener al menos 2 caracteres"),

    body("lastname")
        .notEmpty().withMessage("El campo no puede estar vacío").bail()
        .isLength({ min: 2 }).withMessage("El nombre debe contener al menos 2 caracteres"),

    body("email")
        .notEmpty().withMessage("El campo no puede estar vacío").bail()
        .isEmail().withMessage("El formato de correo no es válido"),

    body("password")
        .notEmpty().withMessage("El campo no puede estar vacío").bail()
        .isLength({ min: 8 }).withMessage("La contraseña debe contener al menos 8 caracteres").bail()
        .custom((value, { req }) => {

            if(value != req.body.checkpassword){
                throw new Error('Las contraseñas no coinciden');
            }
            
            return true;
        }),
    
    body("checkpassword")
        .notEmpty().withMessage("El campo no puede estar vacío").bail()
        .isLength({ min: 8 }).withMessage("La contraseña debe contener al menos 8 caracteres"),

    
    body("avatar")
        .custom((value, { req }) => {

            const { file } = req;

            if(file){
                const extensionesValidas = [".png", ".jpg", ".jpeg", ".svg"];
    
                const fileExtension = path.extname(file.originalname);
    
                if(!extensionesValidas.includes(fileExtension)){
                    throw new Error(`Los formatos de imagen validos son ${extensionesValidas.join(', ')}`);
                }
            }   
            
            return true; 
        })
    

]

module.exports = userRegisterValidation;