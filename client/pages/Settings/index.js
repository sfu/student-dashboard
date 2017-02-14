/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react'
import { Widget } from 'components/Widget'
import SettingsSelect from 'components/SettingsSelect'
import LogoutButton from 'components/LogoutButton'
import styles from './Settings.css'

const Settings = () => {
  return (
    <div className={styles.settings}>
      <Widget title="General Settings">
        <div className={styles.container}>
          <SettingsSelect
            label="Time Format"
            preferenceKey="timeFormat"
            options={[
              { value: '12h', text: '12-hour (1:00 PM)'},
              { value: '24h', text: '24-hour (13:00)'}
            ]}
          />
        </div>
      </Widget>

      <Widget title="About SFU Snap">
        <div className={styles.container}>
          <p className={styles.aboutText}>
            SFU Snap was created by students, for students. It provides you
            with the information you need to easliy plan your campus experience
            in a snap. Access your personalized course schedule, find room
            locations,consult transit schedules, and manage your library.
          </p>
          <p className={styles.copyright}>
            © Copyright Simon Fraser University
          </p>
          { process.env.BUILD && <p className={styles.build}>Build: {process.env.BUILD}</p>}
        </div>
      </Widget>
      <LogoutButton />
    </div>
  )
}

Settings.propTypes = {}

export default Settings
