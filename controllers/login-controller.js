const { user: User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Redis = require('ioredis');

const login = async (req, res) => {
  try {
    const email = req.body.email
    const password = req.body.password

    const user           = await User.findOne({
      where: {
        email:    email
      }
    })

    if (user == null) {
      return sendResponse({
        res: res,
        code: 401,
        message: "unauthenticated",
        error: "user not found",
      })
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return sendResponse({
        res: res,
        code: 401,
        message: "unauthenticated",
        error: "incorrect password",
      })
    }

    const userToken = jwt.sign(
      { user_id: user.id },
      process.env.CLIENT_SECRET,
      { expiresIn: 1200 }
    )
    const redis = new Redis();

    redis.set(user.id, userToken);

    return res.json({ userToken });

  } catch (error) {
    res.status(401)
      .json({
        message: "login error",
        error: error.message || error
      })
  }
}

const sendResponse = ({
  res,
  code = 200,
  message = 'SUCCESS',
  data = {},
  error
}) => {
  if (error !== undefined) {
    res.status(code)
        .json({
        message: message,
        error: error
        })
  } else {
    res.status(code)
        .json({
          message: message
        })
  }
}

module.exports = { login }