const { response } = require('../helpers/Common')
const UserService = require('../services/UserService')
const BookService = require('../services/BookService')
const { query } = require('express')

async function addingBook(req, resp) {
  const { user } = resp.locals
  try {
    const params = req.query
    const body = req.body
    const service = new BookService(user, params, body)
    const data = await service.addBook(body.books)
    return response(resp, 200, 'success', data)
  } catch (err) {
    console.log('Error', err)
    return response(resp, 500, 'Error', {}, err.message)
  }
}

async function updateBook(req, resp) {
  const { user } = resp.locals
  try {
    const params = req.query
    const body = req.body
    const service = new BookService(user, params, body)
    await service.update(body, 'code', params.book_code)
    return response(resp, 200, 'success book update', {})
  } catch (err) {
    console.log('Error', err)
    return response(resp, 500, 'Error', {}, err.message)
  }
}

async function getListBook(req, resp) {
  const { user } = resp.locals
  try {
    const params = req.query
    const body = req.body
    const service = new BookService(user, params, body)
    const data = await service.list()
    console.log("DATA Book", data);
    if (data.length <= 0) {
      console.log('No Book')
      return response(resp, 200, 'No Book')
    }

    console.log('success')
    return response(resp, 200, 'success', data)
  } catch (err) {
    console.log('Error', err)
    return response(resp, 500, 'Error', {}, err.message)
  }
}

async function getListIssue(req, resp) {
  const { user } = resp.locals
  try {
    console.log("USER", user);
    const params = req.query
    const body = req.body
    const service = new BookService(user, params, body)
    const data = await service.listIssue(params.returned, user.unique_id)
    console.log("DATA Book", data);
    if (data.length <= 0) {
      console.log('No Issued Book')
      return response(resp, 200, 'No Issued Book')
    }

    console.log('success')
    return response(resp, 200, 'success', data)
  } catch (err) {
    console.log('Error', err)
    return response(resp, 500, 'Error', {}, err.message)
  }
}

async function createIssue(req, resp) {
  const { user } = resp.locals
  try {
    const params = req.query
    const max_issued = params.max_issued
    const body = req.body
    const service = new BookService(user, params, body)

    // penalty check
    const [penalty_code, penaltyRows] = await service.createIssue(params.returned, user.unique_id, undefined)
    if (penalty_code == 403) {
      console.log('User on penalty')
      return response(resp, 403, 'User on penalty')
    }

    // book issue check
    const dataIssue = await service.listIssue(params.returned, user.unique_id)
    if (dataIssue.length >= Number(max_issued)) {
      console.log('User has maximum book issue')
      return response(resp, 403, 'User has maximum book issue')
    }
    const [issueCode, issueRows] = await service.createIssue(params.returned, user.unique_id, body)
    if (issueCode == 403) {
      console.log('Book on issued')
      return response(resp, 403, 'Book on issued')
    }

    console.log('success issued')
    return response(resp, 200, 'success', issueRows)
  } catch (err) {
    console.log('Error', err)
    return response(resp, 500, 'Error', {}, err.message)
  }
}

async function bookReturned(req, resp) {
  const { user } = resp.locals
  try {
    const params = req.query
    const body = req.body
    const service = new BookService(user, params, body)

    // penalty check
    const rows = await service.bookReturn(params.book_id, user.unique_id)
    console.log("ROWS", rows);

    console.log('success issued')
    return response(resp, 200, 'success', 'success return book')
  } catch (err) {
    console.log('Error', err)
    return response(resp, 500, 'Error', {}, err.message)
  }
}

module.exports = {
  getListBook,
  getListIssue,
  createIssue,
  bookReturned,
  addingBook,
  updateBook,
}
