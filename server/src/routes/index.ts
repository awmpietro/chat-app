const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Request, Response } = require('express');

const { sequelize } = require('../models/index');
const { users: UserModel } = require(`../models`);

/*
 * @function: login
 * function that handles /login request.
 * @params: req: Request object, res: Response object.
 */
const login = async (req: typeof Request, res: typeof Response) => {
  try {
    const { email, password } = req.body.credentials;

    const user = await UserModel.findOne({
      where: { email },
      attributes: ['id', 'name', 'password'],
    });
    if (user) {
      const isMatch = await bcrypt.compare(
        password,
        user.dataValues.password,
      );
      if (isMatch) {
        const token = jwt.sign({ email }, process.env.SECRET_KEY, {
          expiresIn: '24h',
        });
        delete user.dataValues.password;
        res.json({ user, token });
      } else {
        res.status(401);
        res.json('Email or password invalid');
        return 'Password invalid';
      }
    } else {
      res.status(401);
      res.json('Email or password invalid');
      return 'Email or password invalid';
    }
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json(error.message);
    return error;
  }
};

/*
 * @function: register
 * function that handles /register request.
 * @params: req: Request object, res: Response object.
 */
const register = async (
  req: typeof Request,
  res: typeof Response,
) => {
  try {
    const { name, email, password } = req.body.credentials;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await UserModel.create(
      {
        name,
        email,
        password: hashedPassword,
        createdAt: sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: sequelize.literal('CURRENT_TIMESTAMP'),
      },
      { returning: true },
    );
    delete user.dataValues.password;
    delete user.dataValues.createdAt;
    delete user.dataValues.updatedAt;
    const token = jwt.sign({ email }, process.env.SECRET_KEY, {
      expiresIn: '24h',
    });
    return res.json({ user, token });
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json(error.message);
    return error;
  }
};

export { login, register };
