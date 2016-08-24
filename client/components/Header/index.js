import React from 'react'
import snapLogo from './sfusnap.png'
import menu from './menu.svg'

const styles = {
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '2px solid #A6192E',
    marginBottom: '1em'
  },
  h1: {
    color: '#A6192E',
    fontWeight: '300',
    fontSize: '1.5em'
  }
}

export const Header = () => {
  return (
    <header style={styles.header}>
      <img alt="SFU Snap Logo" src={snapLogo} height={50} width={50} />
      <h1 style={styles.h1}>Dashboard</h1>
      <img alt="menu" src={menu} />
    </header>
  )
}
