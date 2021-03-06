import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { info, error } from 'fancy-log';
import DB from '../database/dbconnection';
import 'regenerator-runtime';

class Users {
  static async createUser(req, res) {
    const { email, password } = req.body;
    let { firstname, lastname, address } = req.body;
    let isAdmin;

    info('=====CreateUSerObject>>>>', req.body);

    // Remove unnecessary spaces
    firstname = firstname.trim().replace(/\s+/g, '');
    lastname = lastname.trim().replace(/\s+/g, '');
    address = address.trim().replace(/\s+/g, ' ');

    // Encrypt password
    const encryptedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    if (req.originalUrl === '/api/v1/auth/admin/signup') {
      isAdmin = true;
    } else {
      isAdmin = false;
    }

    const query = `
          INSERT INTO users(firstname, lastname, email, password, address, is_admin)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING id, firstname, lastname, email, address, is_admin ;`;
    const userData = [
      firstname,
      lastname,
      email,
      encryptedPassword,
      address,
      isAdmin,
    ];

    try {
      const checkResult = await DB.query('SELECT * FROM users WHERE email = $1', [`${email}`]);
      if (checkResult.rowCount >= 1) {
        return res.status(400).json({
          status: 400,
          error: 'User with email already exist',
        });
      }

      const result = await DB.query(query, userData);
      const user = result.rows[0];

      const token = jwt.sign({ user }, process.env.SECRETKEY, { expiresIn: '68h' });

      return res.status(201).json({
        status: 201,
        data: {
          token,
          id: user.id,
          first_name: user.firstname,
          last_name: user.lastname,
          email: user.email,
          address: user.address,
          is_admin: user.is_admin,
        },
      });
    } catch (err) {
      error(err.stack);
    }

    return res.status(500).json({
      status: 500,
      error: 'Internal Server Error',
    });
  }

  static async login(req, res) {
    const { email, password } = req.body;
    info('=====CreateUSerObject>>>>', req.body);
    try {
      // Check if email is present in Users Table
      const result = await DB.query('SELECT * FROM users WHERE email = $1', [`${email}`]);

      if (result.rowCount === 0) {
        return res.status(400).json({
          status: 400,
          error: 'Email not found/wrong email address',
        });
      }

      const user = result.rows[0];

      // Compare password
      const comparePassword = bcrypt.compareSync(password, user.password);
      if (!comparePassword) {
        res.status(400).json({
          status: 400,
          error: 'Password is incorrect',
        });
      }

      const token = jwt.sign({ user }, process.env.SECRETKEY, { expiresIn: '68h' });

      return res.status(200).json({
        status: 200,
        data: {
          token,
          id: user.id,
          first_name: user.firstname,
          last_name: user.lastname,
          email: user.email,
          address: user.address,
          is_admin: user.is_admin,
        },
      });
    } catch (err) {
      error(err.stack);
    }

    return res.status(500).json({
      status: 500,
      error: 'Internal Server Error',
    });
  }
}

export default Users;
