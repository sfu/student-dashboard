import React from 'react'
import { Widget } from 'components/Widget'
import SettingsSelect from 'components/SettingsSelect'

const Settings = () => {
  return (
    <div>
      <Widget title="General Settings">
        <div style={{ margin: '1em' }}>
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
    </div>
  )
}

Settings.propTypes = {}

export default Settings
