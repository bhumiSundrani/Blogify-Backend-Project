const { validateToken } = require("../services/auth.service")

const checkForAuthenticationCookie = (cookieName) => {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName]
        if(!tokenCookieValue) return next()

        try {
            const userPayLoad = validateToken(tokenCookieValue)
            req.user = userPayLoad
        } catch (error) {
            console.log(error)
        }
        return next()
    }
}

module.exports ={ 
    checkForAuthenticationCookie
}