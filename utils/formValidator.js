class FormValidator {
    constructor(rules) {
        this.rules = rules; // Validation rules
        this.errors = {}; // Store validation errors
    }

    validate(formData) {
        this.errors = {}; // Reset errors before each validation
        console.log(formData);
        for (const field in this.rules) {
            const rulesArray = this.rules[field];
            const value = formData[field]?.trim() || "";
            
            rulesArray.forEach(rule => {
                if (rule === "required" && !value) {
                    this.addError(field, `<span>${field}</span> is required.`);
                }
                if (rule === "email" && !this.isValidEmail(value)) {
                    this.addError(field, `<span>${field}</span> must be a valid email.`);
                }
                if (rule === "password" && !this.isValidPassword(value)) {
                    this.addError(field, `<span>${field}</span> must be at least 6 characters, contain a capital letter, a number, a special character, and have no spaces.`);
                }
                if (rule === "alphaNum" && !this.isAlphaNumeric(value)) {
                    this.addError(field, `<span>${field}</span> must contain only letters and numbers without spaces or special characters.`);
                }
                if (rule.startsWith("min:")) {
                    const minLength = parseInt(rule.split(":")[1], 10);
                    if (value.length < minLength) {
                        this.addError(field, `<span>${field}</span> must be at least ${minLength} characters.`);
                    }
                }
                if (rule === "match:password" && value !== formData["password"]) {
                    this.addError(field, `<span>${field}</span> must match the password.`);
                }
            });
        }

        return this.isValid();
    }

    addError(field, message) {
        if (!this.errors[field]) {
            this.errors[field] = [];
        }
        this.errors[field].push(message);
    }

    isValid() {
        return Object.keys(this.errors).length === 0;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPassword(password) {
        const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[A-Z])(?=\S+$).{6,}$/;
        return passwordRegex.test(password);
    }

    isAlphaNumeric(value) {
        const alphaNumRegex = /^[a-zA-Z0-9]+$/;
        return alphaNumRegex.test(value);
    }
}


export default FormValidator;

/* Example Usage
const rules = {
    username: ["required", "min:3"],
    usermail: ["required", "email"],
    password: ["required", "password"],
    repeatPassword: ["required", "match:password"]
};

const validator = new FormValidator(rules);
const formData = {
    username: "John",
    usermail: "john.doe@example.com",
    password: "Pass@123",
    repeatPassword: "Pass@123"
};

if (!validator.validate(formData)) {
    console.log("Validation Errors:", validator.errors);
} else {
    console.log("Form is valid! Proceed with submission.");
}*/
