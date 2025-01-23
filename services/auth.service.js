const jwt = require('jsonwebtoken')
require('dotenv').config()
const secret = process.env.SECRET_KEY

const createTokenForUser = (user) => {
    if(!user) throw new Error("User not provided")
    const payload = {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        role: user.role
    }

    const token = jwt.sign(payload, secret)
    return token
}
const validateToken = (token) => {
    if(!token) throw new Error("Token not provided")
    const payload = jwt.verify(token, secret)
    return payload
}

module.exports = {
    createTokenForUser,
    validateToken
}