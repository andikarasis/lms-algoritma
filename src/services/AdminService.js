require('dotenv').config()
const Database = require('../db')
const uuid4 = require('uuid4')
const bcrypt = require('bcrypt')
const internalDB = require('../../db.json')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const {
  generateInsertQuery,
  generateUpdateQuery,
  response,
  makeid
} = require('../helpers/Common')

class AdminService {
  constructor(user, params, body) {
    this.user = user || {}
    this.params = params
    this.body = body
    this.database_config = this.user.database_configuration
    this.table_name = 'admin'
  }

  async get() {}

  async create() {
    const {
      name,
      username,
      password,
      use_generated_password
    } = this.body
    const unique_id = uuid4()
    let encoded_password

    // check user
    const sql_check = `SELECT * FROM admin WHERE username = '${username}'`
    const db = new Database(internalDB, 'internal')
    await db.connect()
    const {
      rowCount
    } = await db.query(sql_check)
    console.log(sql_check, rowCount)
    if (rowCount > 0) {
      console.log('Admin Already Exists')
      return [409, {}]
    }

    // setting password
    encoded_password = password
    if (!password || use_generated_password) {
      encoded_password = makeid(10)
    }
    const salt = bcrypt.genSaltSync(10)
    const hashed = bcrypt.hashSync(encoded_password, salt)

    // creating admin
    const sql = `INSERT INTO admin(name, username, password, unique_id) VALUES
    ('${name}', '${username}', '${hashed}', '${unique_id}')`
    await db.query(sql)
    console.log('success creating admin')

    db.release()

    return [
      200,
      {
        password: encoded_password,
      },
    ]
  }

  async login() {
    const {
      username,
      password
    } = this.body
    const db = new Database(internalDB, 'internal')
    await db.connect()

    const query = `SELECT * FROM admin WHERE username = '${username}'`
    const {
      rows,
      rowCount
    } = await db.query(query)
    if (rowCount <= 0) {
      console.log('Admin not found')
      return [404, {}]
    }

    const user = rows[0]
    const valid = bcrypt.compareSync(password, user.password)
    if (!valid) {
      console.log('Password incorrect')
      return response(resp, 400, 'Login Failed', {}, null)
    }

    const token = jwt.sign({
      id: user.unique_id
    }, process.env.SECRET || 'SECRET')

    const data = {
      name: user.name,
      username: user.username,
      token: token,
      created_at: user.created_at,
      updated_at: user.updated_at,
    }

    db.release()

    return [200, data]
  }

  async listUser() {
    const db = new Database(internalDB, 'internal')
    await db.connect()
    const sql = `SELECT id, unique_id, name, username, admin_id, type, created_at, updated_at FROM users`
    const sql2 = `SELECT * FROM books_issue WHERE returned = false`
    const sql3 = `SELECT *, (release_date::DATE - now()::DATE) as remaining_penalty FROM user_penalty WHERE status = true`
    const {
      rows: rowsU,
      rowCount: rowCountU
    } = await db.query(sql)
    const {
      rows: rowsB,
      rowCount: rowCountB
    } = await db.query(sql2)
    const {
      rows: rowsP,
      rowCount: rowCountP
    } = await db.query(sql3)
    rowsU.forEach(el => {
      let penalty = rowsP.find(u => u.user_id === el.unique_id);
      let bookIssued = rowsB.filter(val => val.user_id == el.unique_id)
      el.book_issued = bookIssued.length
      if (penalty) {
        el.penalty = penalty.status
        el.remaining_penalty = penalty.remaining_penalty
      } else {
        el.penalty = false
        el.remaining_penalty = null
      }
    });

    db.release()
    return [200, rowsU]
  }

  async getProfile() {
    const db = new Database(internalDB, 'internal')
    await db.connect()

    const sql = `SELECT * FROM admin WHERE unique_id = '${this.user['unique_id']}'`
    const {
      rows,
      rowCount
    } = await db.query(sql)
    if (rowCount <= 0) {
      console.log('Admin not found')
      return [404, 'Admin not found']
    }

    db.release()
    return [200, rows[0]]
  }

  async penaltyUser(data) {
    const db = new Database(internalDB, 'internal')
    await db.connect()
    data.status = true
    const sql = generateInsertQuery([data], 'user_penalty')
    await db.query(sql)

    db.release()
    return [200, {}]
  }

  async releasePenaltyUser(data) {
    const db = new Database(internalDB, 'internal')
    await db.connect()
    data.status = true
    const sql = `DELETE FROM user_penalty WHERE user_id = '${data.user_id}'`
    await db.query(sql)

    db.release()
    return [200, {}]
  }

  async updateProfile() {
    const {
      name,
      email,
      username,
      phone
    } = this.body
  }
}

module.exports = AdminService