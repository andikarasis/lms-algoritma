const { response } = require('../helpers/Common')
const internalDB = require('../../db.json')
const Database = require('../db')
const jwt = require('jsonwebtoken')

async function checkModerator(req, resp, next) {
  try {
    const db = new Database(internalDB, 'internal')
    await db.connect()

    const auth = req.headers.authorization
    if (!auth) return response(resp, 403, 'error', {}, 'unauthorized token')

    let token = auth.split(' ')
    if (token.length == 1) {
      console.log('Please using Bearer')
      return response(resp, 403, 'Please using Bearer', {}, null)
    }

    token = token[1]
    const verify = jwt.verify(token, process.env.SECRET || 'SECRET')
    const unique_id = verify.id
    const sql = `SELECT * FROM admin WHERE unique_id = '${unique_id}'`
    const { rows } = await db.query(sql)
    if (rows.length <= 0) {
      console.log('moderator not found with id ', unique_id)
      return response(resp, 403, 'unauthorized token')
    }

    resp.locals.user = rows[0]
    return next()
  } catch (err) {
    console.log('Error on checkModerator', err)
    return response(resp, 403, 'error', {}, 'unauthorized token')
  }
}

async function checkAdmin(req, resp, next) {
  try {
    const db = new Database(internalDB, 'internal')
    await db.connect()

    const auth = req.headers.authorization
    if (!auth) return response(resp, 403, 'error', {}, 'unauthorized token')

    let token = auth.split(' ')
    if (token.length == 1) {
      console.log('Please using Bearer')
      return response(resp, 403, 'Please using Bearer', {}, null)
    }

    token = token[1]
    const verify = jwt.verify(token, process.env.SECRET || 'SECRET')
    const unique_id = verify.id
    const sql = `SELECT * FROM admin WHERE unique_id = '${unique_id}'`
    const { rows } = await db.query(sql)
    if (rows.length <= 0) {
      console.log('admin not found with id ', unique_id)
      return response(resp, 403, 'unauthorized token')
    }

    const user = rows[0]
    // user['database_configuration'] = JSON.parse(user['database_configuration'])
    resp.locals.user = user
    return next()
  } catch (err) {
    console.log('Error on checkAdmin', err)
    return response(resp, 403, 'error', {}, 'unauthorized token')
  }
}

async function checkUser(req, resp, next) {
  try {
    const db = new Database(internalDB, 'internal')
    await db.connect()

    const auth = req.headers.authorization
    if (!auth) return response(resp, 403, 'error', {}, 'unauthorized token')

    let token = auth.split(' ')
    if (token.length == 1) {
      console.log('Please using Bearer')
      return response(resp, 403, 'Please using Bearer', {}, null)
    }

    token = token[1]
    const verify = jwt.verify(token, process.env.SECRET || 'SECRET')
    const unique_id = verify.id
    const sql = `SELECT u.*, a.username admin_username FROM users u JOIN admin a ON a.unique_id = u.admin_id WHERE u.unique_id = '${unique_id}'`
    const { rows } = await db.query(sql)
    if (rows.length <= 0) {
      console.log('users not found with id ', unique_id)
      return response(resp, 403, 'unauthorized token')
    }

    const user = rows[0]
    // user['database_configuration'] = JSON.parse(user['database_configuration'])
    resp.locals.user = user
    return next()
  } catch (err) {
    console.log('Error on checkUser', err)
    return response(resp, 403, 'error', {}, 'unauthorized token')
  }
}

module.exports = {
  checkAdmin,
  checkUser,
  checkModerator,
}
