import FormValidator from "../utils/formValidator.js";

const requestsValidator = {
    validateRegister: (req , res , next) => {

        const {username , usermail , password, repeatPassword} = req.body;

        const rules = {
            username: ["required", "min:3"],
            usermail: ["required", "email"],
            password: ["required", "password"],
            repeatPassword: ["required", "match:password"]
        };
        
        const validator = new FormValidator(rules);
        const formData = {
            username: username,
            usermail: usermail,
            password: password,
            repeatPassword: repeatPassword,
        };
        
        if (!validator.validate(formData)) 
           res.status(400).send(validator.errors);
        else
        next();
    },

    validateResendMail: (req, res , next) =>{
    
    }
}



export default requestsValidator;