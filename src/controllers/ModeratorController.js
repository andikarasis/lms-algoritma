const { response } = require('../helpers/Common')
const AdminService = require('../services/AdminService')
const ModeratorService = require('../services/ModeratorService')

async function getModerator() {
  try {
    console.log('=================')
    console.log('Get Moderator')
    console.log('=================')
  } catch (err) {
    console.log('Error', err)
  }
}

async function createModerator() {}

async function createAdmin(req, resp) {
  try {
    console.log('entering create admin')
    const params = req.query
    const body = req.body
    const service = new AdminService(null, params, body)
    const [status, data] = await service.create()
    if (status === 409) {
      return response(resp, 409, 'Admin Already Exists')
    }

    console.log('success create admin')
    return response(resp, 200, 'success', data)
  } catch (err) {
    console.log('Error while create admin', err)
    return response(resp, 500, 'Error while create admin', {}, err.message)
  }
}

async function loginModerator() {}

module.exports = {
  getModerator,
  createAdmin,
  createModerator,
  loginModerator,
}
