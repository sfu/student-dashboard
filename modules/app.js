import React from 'react'
import ReactDOM from 'react-dom'

const __STATE__ = {
  "uid": 11659,
  "isSponsored": "false",
  "username": "grahamb",
  "status": "active",
  "roles": [
    "staff",
    "f_undergrad",
    "alumnus"
  ],
  "lastname": "Ballantyne",
  "barcode": "29345003208887",
  "commonname": "Graham",
  "dept": "IT Services",
  "firstnames": "Graham Neil",
  "sfuid": "973004918"
}

const Person = (props) => {
const {username, roles, sfuid, commonname, firstnames, lastname, dept} = props.person
const name = `${commonname ? commonname : firstnames} ${lastname}`
const department = dept ? ` • ${dept}` : ''
return (
  <div>
    <h1>{name} {department}</h1>
    <ul>
      <li>Username: {username}</li>
      <li>Roles: {roles.join(', ')}</li>
      <li>SFU ID: {sfuid}</li>
    </ul>
  </div>
)
}

ReactDOM.render(<Person person={__STATE__} />, document.getElementById('app'))
