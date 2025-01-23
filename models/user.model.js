const { Schema, model }= require('mongoose')
const { createHmac, randomBytes } = require('crypto');
const { createTokenForUser } = require('../services/auth.service');

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    profileImageUrl: {
        type: String,
        default: '/images/default.jpg'
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    }
}, {timestamps: true})

userSchema.static('matchPasswordAndGenerateToken', async function(email, password){
    const user = await this.findOne({email})
    if(!user) throw new Error("User not found")

    const salt = user.salt
    const hashedPassword = user.password;

    const userProvidedHash = createHmac('sha256', salt)
                            .update(password)
                            .digest("hex")

    if(hashedPassword != userProvidedHash) throw new Error("Incorrect password")

    try {
        const token = createTokenForUser(user)
        return token
    } catch (error) {
        console.log("Error creating token: ", error)
    }
})

userSchema.pre('save', function (next) {
    const user = this

    if(!user.isModified('password')) return 

    const salt = "SomeRandomString"

    const hashedPassword = createHmac('sha256', salt)
                .update(user.password)
                .digest("hex")

    this.salt = salt
    this.password = hashedPassword

    next()
})

const User = model('user', userSchema)

module.exports = User