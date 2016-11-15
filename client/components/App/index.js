import {default as React, PropTypes} from 'react'
import { connect } from 'react-redux'
import {Header} from 'components/Header'

import 'normalize.css/normalize.css'
import 'styles/global.css'
import styles from './App.css'

const mapStateToProps = (state) => {
  return {
    showNav: state.header.showNav
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleHeaderNav: () => {
      dispatch({
        type: 'TOGGLE_HEADER_NAV'
      })
    }
  }
}

const App = ({ children, showNav, toggleHeaderNav }) => {
  const childProps = children.props.routerProps || children.props
  const { fullScreen } = childProps.route
  return (
    <div>
      <div className={styles.app}>
        { fullScreen ? null : <Header showNav={showNav} toggleHeaderNav={toggleHeaderNav} title={childProps.route.title} /> }
        <div className={fullScreen ? '' : styles.widgets}>
          {children}
        </div>
      </div>
    </div>
  )
}

App.propTypes = {
  children: PropTypes.object.isRequired,
  showNav: PropTypes.bool.isRequired,
  toggleHeaderNav: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
