import {default as React, PropTypes} from 'react'

import {Header} from 'components/Header'
import {NavBar} from 'components/NavBar'

import 'normalize.css/normalize.css'
import 'styles/global.css'
import styles from './App.css'


export const App = ({children}) => {
  const childProps = children.props.routerProps || children.props
  return (
    <div>
      <div className={styles.app}>
        <Header title={childProps.route.title} />
        <div className={styles.widgets}>
          {children}
        </div>
      </div>
      <NavBar />
    </div>
  )
}

App.propTypes = {
  children: PropTypes.object.isRequired
}
