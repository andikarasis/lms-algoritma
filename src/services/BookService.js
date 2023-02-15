const Database = require('../db')
const uuid4 = require('uuid4')
const bcrypt = require('bcrypt')
const internalDB = require('../../db.json')
const jwt = require('jsonwebtoken')
const {
  generateInsertQuery,
  generateUpdateQuery,
  makeid
} = require('../helpers/Common')

class BookService {
  constructor(user, params, body) {
    this.user = user || {}
    this.params = params
    this.body = body
    this.database_config = this.user.database_configuration
    this.table_name = 'books'
    this.table_name_issue = 'books_issue'
  }

  async addBook(data) {
    const db = new Database(internalDB, 'internal')
    await db.connect()

    let sql = generateInsertQuery(data, this.table_name)
    const {
      rows
    } = await db.query(sql)
    db.release()
    return rows
  }

  async update(data, field, key) {
    const db = new Database(internalDB, 'internal')
    await db.connect()

    let sql = generateUpdateQuery(data, this.table_name, field, key)
    await db.query(sql)
    db.release()
    return [
      200,
      {},
    ]
  }

  async list() {
    const db = new Database(internalDB, 'internal')
    await db.connect()

    const filters = [`stock > 0`]
    const sql = `SELECT * FROM ${this.table_name} ${filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : ''} ORDER BY id`
    const {
      rows
    } = await db.query(sql)
    db.release()
    console.log("ROWS BOOK", rows);
    return rows
  }

  async listIssue(returned, unique_id) {
    const db = new Database(internalDB, 'internal')
    await db.connect()

    const filters = [`returned = ${returned ? returned : false}`, `user_id = '${unique_id}'`]
    console.log("FILTER LENGTH", filters.join(' AND '));
    const sql = `SELECT *, (return_date::DATE - now()::DATE) as return_deadline FROM ${this.table_name_issue} ${filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : ''}`
    const {
      rows
    } = await db.query(sql)
    db.release()
    return rows
  }

  async createIssue(returned, unique_id, value) {
    const db = new Database(internalDB, 'internal')
    await db.connect()

    // check user penalty
    const sql_check = `SELECT * FROM user_penalty WHERE user_id = '${unique_id}' AND status = true`
    const {
      rows,
      rowCount
    } = await db.query(sql_check)
    if (rowCount > 0) {
      console.log('User on penalty')
      return [403, 'User on penalty']
    }

    if (value) {

      // issued book
      const sqlIssue = `SELECT * FROM books_issue WHERE book_id = '${value.book_id}'`
      const {
        rows: rowIssue,
        rowCount: rowCountIssue
      } = await db.query(sqlIssue)
      if (rowCountIssue > 0) {
        console.log('Book on issue')
        return [403, 'Book on issue']
      }
      const sql = `INSERT INTO books_issue (book_id, user_id, book_code, title) VALUES (${value.book_id}, '${unique_id}', '${value.book_code}', '${value.title}')`
      const sqlUpdate = `UPDATE books SET stock = 0, updated_at = NOW() WHERE id = ${value.book_id}`
      await db.query(sql)
      await db.query(sqlUpdate)
    }
    db.release()
    return [
      200,
      {
        value
      },
    ]
  }

  async bookReturn(book_id, unique_id) {
    const db = new Database(internalDB, 'internal')
    await db.connect()

    const filters = [`returned = false`, `user_id = '${unique_id}'`, `book_id = ${book_id}`]
    console.log("FILTER LENGTH", filters.join(' AND '));
    const sql = `SELECT *, (return_date::DATE - now()::DATE) as return_deadline FROM ${this.table_name_issue} ${filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : ''}`
    const {
      rows
    } = await db.query(sql)
    if (rows[0].return_deadline < 0) {
      const sqlPenalty = `INSERT INTO user_penalty (user_id) VALUES
      ('${unique_id}')`
      await db.query(sqlPenalty)
    }
    const sqlUpdate = `UPDATE books SET stock = 1, updated_at = NOW() WHERE id = ${book_id}`
    const sqlIssueUpdate = `UPDATE books_issue SET returned = true, updated_at = NOW() WHERE book_id = ${book_id} AND user_id = '${unique_id}'`
    await db.query(sqlUpdate)
    await db.query(sqlIssueUpdate)
    db.release()
    return [
      200,
      rows,
    ]
  }
}

module.exports = BookService