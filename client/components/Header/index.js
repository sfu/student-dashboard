import { default as React, PropTypes } from 'react'
import HeaderNavGrid from 'components/HeaderNavGrid'
import Collapse from 'react-collapse'
import { presets } from 'react-motion'
import snapLogo from './sfusnap_white.png'
import Menu from './menu.svg'
import styles from './Header.css'

export const Header = React.createClass({
  propTypes: {
    title: PropTypes.string.isRequired
  },

  getInitialState() {
    return {
      showNavGrid: false
    }
  },

  toggleNavGrid(ev) {
    ev.preventDefault()
    this.setState({
      showNavGrid: !this.state.showNavGrid
    })
  },

  render() {
    const { title } = this.props
    return (
      <div className={styles.headerContainer}>
        <header className={styles.header}>
          <img className={styles.snapLogo} alt="SFU Snap Logo" src={snapLogo} height={50} width={50} />
          <button className={styles.navToggle} onClick={this.toggleNavGrid}><h1 className={styles.title}>{title}</h1></button>
          <button type="button" name="Toggle Menu" className={styles.navToggle} onClick={this.toggleNavGrid}>
            <Menu />
          </button>
        </header>

        <Collapse
          isOpened={this.state.showNavGrid}
          springConfig={presets.stiff}>
          <HeaderNavGrid />
        </Collapse>
      </div>
    )
  }
})
