const { user } = require('../models')
const bcrypt = require('bcryptjs');
const {
  v1: uuidv1,
} = require('uuid');

const register = async (req, res) => {
  try {
    const email = req.body.email
    const existingUser = await user.findOne({ where: { email: email }})

    if (existingUser != null) {
      return sendResponse({
        res: res,
        message: 'Something went wrong!',
        error: 'user exists'
      })
    }

    const firstName = req.body.first_name
    const lastName  = req.body.last_name
    const username  = req.body.username

    const newUser = await user.build({
      first_name: firstName,
      last_name:  lastName,
      email:      email,
      username:   username,
    })


    const password = req.body.password

    const salt           = await bcrypt.genSalt(10);
    const passwordDigest = await bcrypt.hash(password, salt);

    newUser.password = passwordDigest
    newUser.id = uuidv1()

    await newUser.save()

    return sendResponse({
      res: res,
      message: 'User registered successfully'
    })
  } catch (error) {
    return sendResponse({
      res: res,
      message: 'Registration failed',
      error: error.message || error
    })
  }
}

const sendResponse = ({ res, message = 'SUCCESS', data = {}, error }) => {
  if (error !== undefined) {
    res.status(400)
        .json({
        message: message,
        error: error
        })
  } else {
    res.status(200)
        .json({
        message: message
        })
  }
}

module.exports = { register }