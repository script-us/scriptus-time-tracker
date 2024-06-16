import deepmerge from 'deepmerge'
import { ReactNode, createContext } from 'react'
import useStorage from '../hooks/useStorage'

export type Settings = {
  language: string
  redmineURL: string
  redmineApiKey: string
  options?: {
    // TODO: Remove me after a while
    autoPauseOnSwitch: boolean
    extendedSearch: boolean
    roundTimeNearestQuarterHour: boolean
    addSpentTimeForOtherUsers: boolean
    cacheComments: boolean
    addNotes: boolean
  }
  features: {
    autoPauseOnSwitch: boolean
    extendedSearch: boolean
    roundTimeNearestQuarterHour: boolean
    addSpentTimeForOtherUsers: boolean
    cacheComments: boolean
    addNotes: boolean
  }
  style: {
    stickyScroll: boolean
    groupIssuesByVersion: boolean
    showIssuesPriority: boolean
    sortIssuesByPriority: boolean
    pinTrackedIssues: boolean
    showTooltips: boolean
    timeFormat: 'decimal' | 'minutes'
  }
}

const { RENDERER_VITE_REDMINE_APP_URL, RENDERER_VITE_REDMINE_API_KEY } = import.meta.env
const defaultSettings: Settings = {
  language: 'browser',
  redmineURL: RENDERER_VITE_REDMINE_APP_URL ? RENDERER_VITE_REDMINE_APP_URL : '',
  redmineApiKey: RENDERER_VITE_REDMINE_API_KEY ? RENDERER_VITE_REDMINE_API_KEY : '',
  features: {
    autoPauseOnSwitch: true,
    extendedSearch: true,
    roundTimeNearestQuarterHour: false,
    addSpentTimeForOtherUsers: false,
    cacheComments: true,
    addNotes: true
  },
  style: {
    stickyScroll: true,
    groupIssuesByVersion: true,
    showIssuesPriority: true,
    sortIssuesByPriority: true,
    pinTrackedIssues: true,
    showTooltips: true,
    timeFormat: 'minutes'
  }
}

const SettingsContext = createContext({
  settings: defaultSettings,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setSettings: (_data: Settings) => undefined
})

const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const { data, setData } = useStorage<Settings>('settings', defaultSettings)

  // Convert old settings format // TODO: Remove me after a while
  if (data.options && data.redmineURL) {
    data.features = data.options
    delete data.options
    setData(data)
  }

  return (
    <SettingsContext.Provider
      value={{
        settings: deepmerge<Settings>(defaultSettings, data),
        setSettings: (data: Settings) => {
          setData(data)
        }
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export { SettingsContext }
export default SettingsProvider
