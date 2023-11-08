import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Token from '../models/token.js';
dotenv.config();
export const signupUser = async (request, response) => {
  try {
    // const salt = await bcrypt.getSalt();
    const hashedPassword = await bcrypt.hash(request.body.password, 12);

    const user = {
      username: request.body.username,
      name: request.body.name,
      password: hashedPassword,
    };

    const newUser = new User(user);

    await newUser.save();

    return response.status(200).json({ message: 'signup successfull.' });
  } catch (error) {
    return response
      .status(500)
      .json({ message: 'Error while signing up the user.' });
  }
};

export const loginUser = async (request, response) => {
  let user = await User.findOne({ username: request.body.username });
  if (!user) {
    return response.status(400).json({ message: 'Invalid credentials.' });
  }
  try {
    let match = await bcrypt.compare(request.body.password, user.password);

    if (match) {
      //For genrating random keys
      // require('crypto').randomBytes(64).toString('hex')
      const accessToken = jwt.sign(
        user.toJSON(),
        process.env.ACCESS_SECRET_KEY,
        { expiresIn: '15m' }
      );

      const refreshToken = jwt.sign(
        user.toJSON(),
        process.env.REFRESH_SECRET_KEY
      );

      const newToken = new Token({ token: refreshToken });

      await newToken.save();

      return response.status(200).json({
        accessToken: accessToken,
        refreshToken: refreshToken,
        name: user.name,
        username: user.username,
      });
    } else {
      return response.status(400).json({ message: 'Invalid credentials.' });
    }
  } catch (error) {
    return response
      .status(500)
      .json({ message: 'Error while logging in the user.' });
  }
};

export const logoutUser = async (request, response) => {
  const token = request.body.token;
  await Token.deleteOne({ token: token });

  response.status(204).json({ msg: 'logout successfull' });
};
