const { response } = require('../helpers/Common')
const UserService = require('../services/UserService')
const { query } = require('express')

async function login(req, resp) {
  try {
    console.log('User Hit Login')
    const params = req.query
    const body = req.body
    const service = new UserService(null, params, body)
    const [status, data] = await service.login()
    if (status === 404) {
      return response(resp, 404, 'Login Failed')
    }

    console.log('success login user')
    return response(resp, 200, 'success', data)
  } catch (err) {
    console.log('Error while login user', err)
    return response(resp, 500, 'Error while login user', {}, err.message)
  }
}

async function getProfile(req, resp) {
  const { user } = resp.locals
  console.log(`${user.username} trying to access get profile user`);
  try {
    const params = req.query
    const body = req.body
    const service = new UserService(user, params, body)
    const [status, data] = await service.profile()
    if (data.length <= 0) {
      console.log('No user found')
      return response(resp, 404, 'No user found')
    }

    console.log('success get profile user')
    return response(resp, 200, 'success', data[0])
  } catch (err) {
    console.log('Error while get profile user', err)
    return response(resp, 500, 'Error while get profile user', {}, err.message)
  }
}

async function updateProfile(req, resp) {
  const { user } = resp.locals
  try {
    const params = req.query
    const body = req.body
    const { name, username } = body
    if (!name || !username) {
      console.log('Invalid Request')
      return response(resp, 400, 'Invalid Request')
    }

    const service = new UserService(user, params, body)
    const [status, data] = await service.updateProfile()
    if (status !== 200) {
      return response(resp, status, data, {}, null)
    }

    console.log('success update profile user')
    return response(resp, 200, 'success', {})
  } catch (err) {
    console.log('Error while update profile user', err)
    return response(resp, 500, 'Error while update profile user', {}, err.message)
  }
}


module.exports = {
  login,
  getProfile,
  updateProfile,
}
