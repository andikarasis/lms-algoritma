require('dotenv').config()

const PORT = process.env.PORT || 4344
const {
  response,
  makeid
} = require('./helpers/Common')
const router = require('./router')

const express = require('express')
const app = express()
app.use(express.json({
  limit: '100mb'
}))
app.use(express.urlencoded({
  extended: false,
  limit: '100mb'
}))
app.use('/api', router)
const Database = require('./db')
app.listen(PORT, () => console.log(`Listen on port ${PORT}`))

app.get('/', async (req, resp) => {
  return response(resp, 200, 'API is Active', {}, null)
})
