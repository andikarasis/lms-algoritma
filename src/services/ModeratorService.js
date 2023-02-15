const Database = require('../db')
const uuid4 = require('uuid4')
const internalDB = require('../../db.json')
const fs = require('fs')
const { generateInsertQuery, generateUpdateQuery, response, makeid } = require('../helpers/Common')

class ModeratorService {
  constructor() {}

  async get() {}

  async create() {
    const { name, username, email, phone, password, use_generated_password, database_configuration } = this.body
    const db = new Database(internalDB, 'internal')
    await db.connect()

    const unique_id = uuid4()
    let database_name = `user_${makeid(5)}`
    let encoded_password

    // check moderator
    const sql_check = `SELECT * FROM moderator WHERE email = '${email}' OR username = '${username}'`
    const { rowCount } = await db.query(sql_check)
    if (rowCount > 0) {
      console.log('User Already Exists')
      return 409
    }

    // setting password
    encoded_password = password
    if (!password || use_generated_password) {
      encoded_password = makeid(10)
    }
    const salt = bcrypt.genSaltSync(10)
    const hashed = bcrypt.hashSync(encoded_password, salt)

    // creating user
    const sql = `INSERT INTO moderator(name, username, email, phone, password, database_name, unique_id) VALUES
    ('${name}', '${username}', '${email}', '${phone}', '${hashed}', '${database_name}', '${unique_id}')`
    await db.query(sql)
  }

  async login() {}
}

module.exports = ModeratorService
