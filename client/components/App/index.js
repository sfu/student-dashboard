import {default as React, PropTypes} from 'react'

const App = React.createClass({

  propTypes: {
    currentUser: PropTypes.object.isRequired
  },

  render() {
    const {firstnames, commonname, lastname} = this.props.currentUser
    const name = `${commonname ? commonname : firstnames} ${lastname}`

    return (
      <div>
        <h1>Hello, {name}</h1>
      </div>
    )
  }
})

export default App
