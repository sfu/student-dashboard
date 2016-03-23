import CAS from 'cas'
import fs from 'fs'

const casConfig = {
  base_url: process.env.CAS_BASE_URL,
  service: process.env.CAS_SERVICE,
  version: 2.0
}

if (process.env.CAS_SSO_SERVERS) {
  casConfig.sso_servers = process.env.CAS_SSO_SERVERS.split(',')
}

if (process.env.CAS_RUN_PGT_SERVER) {
  casConfig.pgt_server = true
  casConfig.pgt_host = process.env.CAS_PGT_SERVER_HOST
  casConfig.pgt_port = process.env.CAS_PGT_SERVER_PORT
  casConfig.ssl_cert = fs.readFileSync(process.env.HTTPS_CERT_FILE),
  casConfig.ssl_key = fs.readFileSync(process.env.HTTPS_KEY_FILE),
  casConfig.ssl_ca = [
    fs.readFileSync(process.env.HTTPS_INTERMEDIATE_CERT_FILE),
    fs.readFileSync(process.env.HTTPS_ROOT_CERT_FILE),
    fs.readFileSync(process.env.HTTPS_THWATE_ROOT_CERT_FILE)
  ]
}

export default new CAS(casConfig)
