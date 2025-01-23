const {Router} = require('express')
const router = Router()
const Blog = require('../models/blog.model')
const multer  = require('multer')
const path = require('path')
const Comment = require('../models/comment.model')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads/`))
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`
      cb(null, fileName)
    }
  })

const upload = multer({ storage: storage })

router.route('/add-blog')
        .get((req, res) => {
            return res.render('addBlog', {user: req.user})
        })
        .post(upload.single('coverImage') ,async (req, res) => {
            const {title, body} = req.body
            try {
                const blog = await Blog.create({
                    title,
                    body,
                    coverImageUrl: `/uploads/${req.file.filename}`,
                    createdBy: req.user._id
                })
                if(!blog) throw new Error()
                return res.redirect(`/blog/${blog._id}`)
            } catch (error) {
                console.log("Error creating post: ", error)
            }
        })

router.route('/:id')
        .get(async (req, res) => {
            const blog = await Blog.findById(req.params.id).populate('createdBy')
            const comments = await Comment.find({blogId: req.params.id}).populate('createdBy')
            console.log(blog)
            return res.render('blog', {user: req.user, blog, comments})
        })

router.route('/comment/:blogId')
        .post(async (req, res) => {
            try {
                if(!req.body.content) return
                const comment = await Comment.create({
                    content: req.body.content,
                    blogId: req.params.blogId,
                    createdBy: req.user._id
                })
                return res.redirect(`/blog/${req.params.blogId}`)
            } catch (error) {
                console.log("Error creating comment: ", error)
            }            
        })

module.exports = router