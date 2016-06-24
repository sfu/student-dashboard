import React from 'react'
import styles from './style.scss'

const Home = React.createClass({
  getInitialState() {
    return {
      counter: 0
    }
  },

  updateCounter() {
    this.setState({
      counter: this.state.counter + 1
    })
  },

  componentDidMount() {
    window.setInterval(this.updateCounter, 1000)
  },

  render() {
    return (
      <div>
        <div className={styles.hello}>Hello <span className={styles.hmr}>HMR</span> it worked!@!</div>
        <div>COUNTER: {this.state.counter}</div>
        <p>{process.env.NODE_ENV}</p>
      </div>
    )
  }
})

export default Home
