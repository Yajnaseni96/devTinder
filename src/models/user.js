const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            minLength: 4,
            maxLength: 50
        },
        lastName: {
            type: String
        },
        emailId: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            validate(value) {
                if(!validator.isEmail(value)){
                    throw new Error("Invalid email address: " + value);
                }
            }
        }, 
        password: {
            type: String,
            required: true,
            validate(value){
                if(!validator.isStrongPassword(value)){
                    throw new Error("Enter a strong password: " + value)
                }
            }
        },
        age: {
            type: Number,
            min: 18 //if string then use minLength
        }, 
        gender: {
            type: String,
            validate(value) {
                if(!["male", "female", "others"].includes(value)){
                    throw new Error("Gender data is not defined!!");
                } 
            }
        },
        photoUrl: {
            type: String,
            default: "https://www.magnific.com/free-vector/woman-with-long-brown-hair-pink-shirt_233878810.htm#fromView=keyword&page=1&position=9&uuid=5f2cb9a6-1cd8-4ef6-80d5-43eb000a3431&track=ais_hybrid&query=Default+user",
            validate(value) {
                if(!validator.isURL(value)) {
                    throw new Error("Invalid photo url: " + value);
                }
            }
        },
        about: {
            type: String
        }, 
        skills: {
            type: [String],
            validate: [{
                validator: function(skills) {
                    return new Set(skills).size === skills.length;
                }, 
                message: "Skills cannot contain duplicates."
            }, {
                validator: function(skills) {
                    return skills.length <= 10;
                }, 
                message: "Maximum 10 skills are allowed."
            }]
        }
    },
    {
        timestamps: true
    }
);

userSchema.methods.getJWT = async function() {
    const user = this;  //should be a normal function always
    const token = await jwt.sign({_id: user._id}, "DEVTinder@880", { expiresIn: "7d"});

    return token;
}

userSchema.methods.validatePassword = async function(passwordEnteredByUser) {
    const user = this;
    const isPasswordValid = await bcrypt.compare(passwordEnteredByUser, user.password);

    return isPasswordValid;
}

module.exports = mongoose.model("User", userSchema);