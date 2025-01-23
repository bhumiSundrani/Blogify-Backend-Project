const express = require('express')
const User = require('../models/user.model')
const router = express.Router()
const {createHmac} = require('crypto')

router.route('/signup')
      .get((req, res) => {
        return res.render('signup')
      })
      .post(async (req, res) => {
        const {fullName, email, password} = req.body
        try {
            await User.create({
                fullName,
                email,
                password
            })
            return res.redirect('/')
        } catch (error) {
            console.log("Error creating profile: ", error)
        }

      })

router.route('/signin')
      .get((req, res) => {
            return res.render('signin')
      })
      .post(async (req, res) => {
        const {email, password} = req.body
        try {
            const token = await User.matchPasswordAndGenerateToken(email, password)
            return res.cookie("token", token).redirect('/')
        } catch (error) {
            return res.render('signin', {error: error.message})
        }
      })

router.route('/logout')
      .get((req, res) => {
        try {
          res.clearCookie('token')
          return res.render('signin')
        } catch (error) {
          console.log("Error logging out: ", error)
        }
      })

module.exports = router