require('dotenv').config()
const { Pool } = require('pg')
const internalDB = require('../../db.json')

const internal_host = internalDB.host
const internal_user = internalDB.user
const internal_pass = internalDB.pass
const internal_port = internalDB.port
const internal_name = internalDB.name
const internal_ssl = 'false'

const internal_config = {
  host: internal_host,
  user: internal_user,
  password: internal_pass,
  port: internal_port,
  database: internal_name,
}

if (internal_ssl === 'true') internal_config.ssl = { rejectUnauthorized: false }
const internal_client = new Pool(internal_config)
internal_client.connect().catch((err) => console.log('Error while connecting DB', err))

class Database {
  constructor(configuration, type) {
    this.configuration = configuration || {}

    this.type = type
    this.db = null
    // this.client = new Pool(config)
  }

  async connect() {
    // const db = await this.client.connect()
    // this.db = db
  }

  async query(query) {
    let results = []
    try {
      console.log(query)
      if (this.type === 'internal') return await internal_client.query(query)
      if (this.type === 'external') return await external_client.query(query)
    } catch (err) {
      console.log('Error while querying', err)
      throw new Error(err)
    }
  }

  release() {
    // this.db.release()
    // this.client.removeAllListeners()
    // this.client.end()
  }
}

module.exports = Database
