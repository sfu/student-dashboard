import {default as React, PropTypes} from 'react'
import logo from './sfusnap_white.png'


const divStyle={
  backgroundColor: '#A6192E',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  height: '100vh',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  WebkitFontSmoothing: 'antialiased',
  color: '#fff',
  fontSize: '1.5em',
  textAlign: 'center'
}

const imgStyle = {
  borderRadius: '5px',
  width: '150px',
  height: '150px'
}

export const Splash = ({children}) => {
  return (
    <div style={divStyle}>
      <img alt="SFU Snap" src={logo} style={imgStyle}/>
      {children}
    </div>
  )
}

Splash.propTypes = {
  children: PropTypes.element
}
