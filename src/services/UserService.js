const Database = require('../db')
const uuid4 = require('uuid4')
const bcrypt = require('bcrypt')
const internalDB = require('../../db.json')
const jwt = require('jsonwebtoken')
const { generateInsertQuery, generateUpdateQuery, makeid } = require('../helpers/Common')

class UserService {
  constructor(user, params, body) {
    this.user = user || {}
    this.params = params
    this.body = body
    this.database_config = this.user.database_configuration
    this.table_name = 'user'
  }

  async list() {
    const db = new Database(this.database_config, 'external')
    await db.connect()

    const filters = [`status = true`]
    const sql = `SELECT * FROM ${this.table_name} ${filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : ''}`
    const { rows } = await db.query(sql)
    db.release()
    return rows
  }

  async create() {
    const db = new Database(internalDB, 'internal')
    await db.connect()

    const { name, username, password, type, use_generated_password } = this.body
    const unique_id = uuid4()
    let encoded_password

    // check user
    const sql_check = `SELECT * FROM users WHERE username = '${username}'`
    const { rowCount } = await db.query(sql_check)
    if (rowCount > 0) {
      console.log('User Already Exists')
      return [409, {}]
    }

    // setting password
    encoded_password = password
    if (!password || use_generated_password) {
      encoded_password = makeid(10)
    }
    const salt = bcrypt.genSaltSync(10)
    const hashed = bcrypt.hashSync(encoded_password, salt)

    // creating users
    const sql = `INSERT INTO users(name, username, password, type, unique_id, admin_id) VALUES
    ('${name}', '${username}', '${hashed}', '${type}', '${unique_id}', '${this.user.unique_id}')`
    await db.query(sql)
    console.log('success creating users')

    db.release()

    return [
      200,
      {
        user_id: unique_id,
        password: encoded_password,
      },
    ]
  }

  async login() {
    const db = new Database(internalDB, 'internal')
    await db.connect()

    const { username, password } = this.body
    const query = `SELECT * FROM users WHERE username = '${username}'`
    const { rows, rowCount } = await db.query(query)
    if (rowCount <= 0) {
      console.log('Users not found')
      return [404, {}]
    }

    const user = rows[0]
    const valid = bcrypt.compareSync(password, user.password)
    if (!valid) {
      console.log('Password incorrect')
      return [404, 'User not found']
    }

    const token = jwt.sign({ id: user.unique_id }, process.env.SECRET || 'SECRET')

    const data = {
      name: user.name,
      username: user.username,
      token: token,
      created_at: user.created_at,
      updated_at: user.updated_at,
    }

    return [200, data]
  }

  async profile() {
    const db = new Database(internalDB, 'internal')
    await db.connect()

    const sql = `SELECT * FROM users WHERE unique_id = '${this.user['unique_id']}' LIMIT 1`
    const { rows } = await db.query(sql)
    return [200, rows]
  }

  async updateProfile() {
    const db = new Database(this.database_config, 'external')
    await db.connect()

    const { name, username, photo } = this.body
    const sql = `SELECT * FROM users WHERE unique_id = '${this.user['unique_id']}' LIMIT 1`
    const { rowCount } = await db.query(sql)
    if (rowCount <= 0) {
      console.log('User not found on update profile')
      return [404, 'User not found']
    }

    // check username
    const check_username = `SELECT * FROM users WHERE username = '${username}' AND unique_id != '${this.user['unique_id']}'`
    const { rowCount: rowCount2 } = await db.query(check_username)
    if (rowCount2 > 0) {
      console.log('Username already exists')
      return [400, 'Username already exists']
    }

    const sql_update = `UPDATE users SET name = '${name}', username = '${username}', photo = '${photo}' WHERE unique_id = '${this.user['unique_id']}'`
    await db.query(sql_update)
    db.release()
    return [200, 'success']
  }
}

module.exports = UserService
