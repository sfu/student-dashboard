import CAS from 'cas'
import fs from 'fs'

CAS.prototype.getProxyTicketAsync = function(pgtiou, service) {
  return new Promise((resolve, reject) => {
    this.getProxyTicket(pgtiou, service, (err, proxyticket) => {
      if (err) {
        reject(err)
      } else {
        resolve(proxyticket)
      }
    })
  })
}

const casConfig = {
  base_url: process.env.CAS_BASE_URL,
  service: process.env.CAS_SERVICE,
  version: 2.0
}

if (process.env.CAS_SSO_SERVERS) {
  casConfig.sso_servers = process.env.CAS_SSO_SERVERS.split(',')
}

if (process.env.CAS_RUN_PGT_SERVER && process.env.CAS_PGT_URL) {
  throw new Error('CAS_RUN_PGT_SERVER and CAS_PGT_URL are both set. Pick one.')
}

if (process.env.CAS_RUN_PGT_SERVER) {
  casConfig.pgt_server = true
  casConfig.pgt_host = process.env.CAS_PGT_SERVER_HOST
  casConfig.pgt_port = process.env.CAS_PGT_SERVER_PORT
  casConfig.ssl_cert = fs.readFileSync(process.env.HTTPS_CERT_FILE)
  casConfig.ssl_key = fs.readFileSync(process.env.HTTPS_KEY_FILE)
  if (process.env.HTTPS_CA_BUNDLE) {
    casConfig.ssl_ca = process.env.HTTPS_CA_BUNDLE.split(',').map(cert => fs.readFileSync(cert))
  }
} else if (process.env.CAS_PGT_URL) {
  casConfig.external_pgt_url = process.env.CAS_PGT_URL
}

export default new CAS(casConfig)
