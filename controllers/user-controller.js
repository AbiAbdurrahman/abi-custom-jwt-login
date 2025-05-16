const jwt = require('jsonwebtoken');
const { sendResponse } = require('../helpers/base-response')
const { user: User } = require('../models');
const util = require('util');
const Redis = require('ioredis');

const verifyTokenAsync = util.promisify(jwt.verify);

const profile = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1]
  try {

    if (!token) {
      return res.status(401).json({ message: "unauthenticated" })
    }

    let userId = null

    const decoded = await verifyTokenAsync(token, process.env.CLIENT_SECRET);

    if (decoded) {
      userId = decoded.user_id
    }

    const user = await User.findOne({
      where: {
        id: userId
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

    return sendResponse({
      res: res,
      message: "user profile",
      data: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        username: user.username
      },
      access_token: token
    })

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      const redis = new Redis();
      const decoded = jwt.decode(token);
      const userId = decoded.user_id
      const refreshToken = await redis.get(userId);
      try {
        const refreshTokenDecoded = await verifyTokenAsync(refreshToken, process.env.CLIENT_SECRET);
        if (refreshTokenDecoded) {
          const newAccessToken = jwt.sign(
            { user_id: userId },
            process.env.CLIENT_SECRET,
            { expiresIn: '1m' }
          );
          return sendResponse({
            res: res,
            message: "user profile",
            data: {
              id: user.id,
              first_name: user.first_name,
              last_name: user.last_name,
              email: user.email,
              username: user.username,
              access_token: newAccessToken
            },
          })
        }
      } catch (refreshErr) {
        return sendResponse({
          res: res,
          code: 401,
          message: "unauthenticated",
          error: "refresh token expired",
        });
      }
    } else {

      return sendResponse({
        res: res,
        code: 401,
        message: "unauthenticated",
        error: "invalid token",
      })
    }
  }
}

module.exports = { profile }