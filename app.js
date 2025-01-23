require('dotenv').config()
const express = require('express')
const path = require('path')
const userRoute = require('./routers/user.route')
const connectToMongoDb = require('./mongodb.connect')
const cookieParser = require('cookie-parser')
const { checkForAuthenticationCookie } = require('./middlewares/auth.middleware')
const blogRouter = require('./routers/blog.route')
const Blog = require('./models/blog.model')

const app = express();
const PORT = process.env.PORT || 5000

//connect to mongo db
connectToMongoDb(process.env.MONGO_URL)
.then(() => console.log("Server connected to mongoDb"))
.catch((error) =>{ 
    console.error("Error connecting to MongoDb: ", error)
    process.exit(1); 
})

//middleware
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(checkForAuthenticationCookie("token"))
app.use(express.static('public'))

//configure ejs
app.set('view engine', 'ejs')
app.set('views', path.resolve("./views"))

//router
app.get('/', async (req, res) => {
    try {
        const allBlogs = await Blog.find({});
        return res.render('home', { user: req.user, blogs: allBlogs });
    } catch (error) {
        console.error("Error fetching blogs:", error);
        return res.status(500).send("Internal Server Error");
    }
})
app.use('/user', userRoute)
app.use('/blog', blogRouter)

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`))

module.exports = app;
