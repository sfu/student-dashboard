import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { updatePreference } from 'actions/preferences'
import styles from './SettingsSelect.css'

const renderOptions = opts => {
  return opts.map((o, i) => {
    return <option key={i} value={o.value}>{o.text}</option>
  })
}

const SettingsSelect = ({ label, preferenceKey, options, preferences, dispatch }) => {
  const handleChange = (ev) => {
    dispatch(updatePreference(preferenceKey, ev.target.value))
  }

  return (
    <div>
      <div className={styles.container}>
        <label className={styles.label} htmlFor={preferenceKey}>{label}</label>
        <select // eslint-disable-line
          id={preferenceKey}
          value={preferences[preferenceKey]}
          onChange={handleChange}
        >
          {renderOptions(options)}
        </select>
      </div>
    </div>
  )
}

SettingsSelect.propTypes = {
  label: PropTypes.string.isRequired,
  preferenceKey: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  preferences: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
}

const mapStateToProps = state => {
  return {
    preferences: state.preferences.preferenceData
  }
}

export default connect(mapStateToProps)(SettingsSelect)
