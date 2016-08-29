import {default as React, PropTypes} from 'react'
import Relay from 'react-relay'

const divStyle = {
  backgroundColor: '#007096',
  color: '#FFFFFF',
  padding: '25px',
}

const pStyle = {
  margin: '0px',
  marginBottom: '1em',
  fontSize: '1.25em',
  fontWeight: '300'
}

const buttonStyle = {
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row-reverse'
  },
  button: {
    backgroundColor: '#A6192E',
    borderRadius: '5px',
    color: '#FFFFFF',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    fontSize: '1.25em',
    fontWeight: '500',
    border: 'none',
    padding: '.25em 1em'
  }
}

export const _HelloTile = React.createClass({
  propTypes: {
    names: PropTypes.object
  },

  getInitialState() {
    return {
      hide: false
    }
  },

  toggleHide() {
    const nextHide = !this.state.hide
    this.setState({
      hide: nextHide
    }, () => {
    })
  },

  render() {
    const {names} = this.props
    const name = names.commonname ? names.commonname : names.firstnames
    return this.state.hide ? null : (
      <div style={divStyle}>
        <p style={pStyle}>Hello, <b>{name}</b>.</p>
        <p style={pStyle}>You have <b>?? class</b> and <b>?? assignments</b> due today.</p>
        <div style={buttonStyle.container}>
        <button
          onClick={this.toggleHide}
          style={buttonStyle.button}
        >Got it!</button>
        </div>
      </div>
    )
  }
})

export const HelloTile = Relay.createContainer(_HelloTile, {
  fragments: {
    names: () => Relay.QL`
      fragment on UserBioType {
        firstnames
        commonname
      }
    `
  }
})
