const { response } = require('../helpers/Common')
const AdminService = require('../services/AdminService')
const UserService = require('../services/UserService')

async function createUser(req, resp) {
  const { user } = resp.locals
  try {
    const params = req.query
    const body = req.body
    const service = new UserService(user, params, body)
    const [status, data] = await service.create()
    if (status === 409) {
      return response(resp, 409, 'User Already Exists')
    }

    console.log('success create user')
    return response(resp, 200, 'success', data)
  } catch (err) {
    console.log('Error while create user', err)
    return response(resp, 500, 'Error while create user', {}, err.message)
  }
}

async function login(req, resp) {
  try {
    const params = req.query
    const body = req.body
    const service = new AdminService(null, params, body)
    const [status, data] = await service.login()
    if (status === 404) {
      return response(resp, 409, 'Login Failed')
    }

    console.log('success login admin')
    return response(resp, 200, 'success', data)
  } catch (err) {
    console.log('Error while login admin', err)
    return response(resp, 500, 'Error while login admin', {}, err.message)
  }
}

async function listUser(req, resp) {
  const { user } = resp.locals
  try {
    const params = req.query
    const body = req.body
    const service = new AdminService(user, params, body)
    const [status, data] = await service.listUser()
    if (status === 404) {
      return response(resp, 409, 'Login Failed')
    }

    console.log('success list user')
    return response(resp, 200, 'success', data)
  } catch (err) {
    console.log('Error while list user', err)
    return response(resp, 500, 'Error while list user', {}, err.message)
  }
}

async function getProfile(req, resp) {
  const { user } = resp.locals
  try {
    const params = req.query
    const body = req.body
    const service = new AdminService(user, params, body)
    const [status, data] = await service.getProfile()
    if (status !== 200) {
      console.log('Admin not found')
      return response(resp, status, 'Admin not found')
    }

    console.log('success list user')
    return response(resp, 200, 'success', data)
  } catch (err) {
    console.log('Error while list user', err)
    return response(resp, 500, 'Error while list user', {}, err.message)
  }
}

async function updateProfile(req, resp) {
  const { user } = resp.locals
  try {
    const params = req.query
    const body = req.body
    const service = new AdminService(user, params, body)
    const [status, data] = await service.updateProfile()
    if (status !== 200) {
      console.log('Admin not found')
      return response(resp, status, 'Admin not found')
    }

    console.log('success list user')
    return response(resp, 200, 'success', data)
  } catch (err) {
    console.log('Error while list user', err)
    return response(resp, 500, 'Error while list user', {}, err.message)
  }
}

async function changePassword(req, resp) {
  const { user } = resp.locals
  try {
    const params = req.query
    const body = req.body
    const service = new AdminService(user, params, body)
    const [status, data] = await service.changePassword()
    if (status !== 200) {
      console.log('Admin not found')
      return response(resp, status, 'Admin not found')
    }

    console.log('success list user')
    return response(resp, 200, 'success', data)
  } catch (err) {
    console.log('Error while list user', err)
    return response(resp, 500, 'Error while list user', {}, err.message)
  }
}

async function userPenalty(req, resp) {
  const { user } = resp.locals
  try {
    const params = req.query
    const body = req.body
    const service = new AdminService(user, params, body)
    await service.penaltyUser(body)

    console.log('success list user')
    return response(resp, 200, 'success penalty user', {
      user_id: body.user_id
    })
  } catch (err) {
    console.log('Error while list user', err)
    return response(resp, 500, 'Error while list user', {}, err.message)
  }
}

async function releaseUserPenalty(req, resp) {
  const { user } = resp.locals
  try {
    const params = req.query
    const body = req.body
    const service = new AdminService(user, params, body)
    await service.releasePenaltyUser(body)
   
    console.log('success list user')
    return response(resp, 200, 'success release penalty user', {
      user_id: body.user_id
    })
  } catch (err) {
    console.log('Error while list user', err)
    return response(resp, 500, 'Error while list user', {}, err.message)
  }
}

module.exports = {
  login,
  createUser,
  listUser,
  getProfile,
  updateProfile,
  changePassword,
  userPenalty,
  releaseUserPenalty,
}
