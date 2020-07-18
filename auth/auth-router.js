const router = require("express").Router()
const bcrypt = require("bcryptjs")
const Users = require("./auth-model")
const restrict = require("./authenticate-middleware")
const jwt = require("jsonwebtoken")

// POST to register new user
router.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body
    const user = await Users.findBy({
      username
    }).first()

    if (user) {
      return res.status(409).json({
        message: "Username is already taken"
      })
    }

    const newUser = await Users.add({
      username,
      // hash the password with a time complexity of "12"
      password: await bcrypt.hash(password, 12)
    })

    res.status(201).json(newUser)
  } catch (err) {
    next(err)
  }
})

// LOGIN
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body
    const user = await Users.findBy({
      username
    }).first()

    if (!user) {
      return res.status(401).json({
        message: "You shall not pass"
      })
    }

    // hash the password again and see if it matches what we have in the database
    const passwordValid = await bcrypt.compare(password, user.password)

    if (!passwordValid) {
      return res.status(401).json({
        message: "You shall not pass"
      })
    }

    const payload = {
      userId: user.id,
      username: user.username
    }


    res.cookie("token", jwt.sign(payload, "secret secret"))

    res.json({
      message: `Welcome ${user.username}!`
    })
  } catch (err) {
    next(err)
  }
})

// LOGOUT
router.get("/logout", async (req, res, next) => {
    res.clearCookie("token");
    res.json({message: "you have successfully logged out"})
})

module.exports = router

