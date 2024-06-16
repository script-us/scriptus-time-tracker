// import Versions from './components/Versions'
// const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

import { faGear, faList, faStopwatch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import { Suspense, lazy } from 'react'
import { useIntl } from 'react-intl'
import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/general/Navbar'
import Toast from './components/general/Toast'
import { getWindowLocationType } from './utils/popout'
// import useSettings from './hooks/useSettings'

const IssuesPage = lazy(() => import('./pages/IssuesPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const TimePage = lazy(() => import('./pages/TimePage'))
const ModulesPage = lazy(() => import('./pages/modulesPage'))
const DashboardPage = lazy(() => import('./pages/dashboardPage'))

function App(): JSX.Element {
  const { formatMessage } = useIntl()
  const locationType = getWindowLocationType()
  // const { settings } = useSettings()
  return (
    <div
      className={clsx('mx-auto', {
        'w-full min-w-[320px]': locationType === 'popout' || locationType === 'options'
      })}
      // disable context menu
      onContextMenu={(e) => {
        e.preventDefault()
      }}
    >
      <header className="relative z-30 h-12">
        <Navbar
          navigation={[
            {
              href: `/issues`,
              icon: <FontAwesomeIcon icon={faList} />,
              name: formatMessage({ id: 'nav.tabs.issues' })
            },
            {
              href: '/time',
              icon: <FontAwesomeIcon icon={faStopwatch} />,
              name: formatMessage({ id: 'nav.tabs.time' })
            },
            {
              href: '/settings',
              icon: <FontAwesomeIcon icon={faGear} />,
              name: formatMessage({ id: 'nav.tabs.settings' })
            }
          ]}
        />
      </header>
      <main
        className={clsx('overflow-y-scroll', {
          'h-[100%]': locationType !== 'popout',
          'h-[calc(100vh-3rem)]': locationType === 'popout'
        })}
      >
        <div className="p-2">
          <Routes>
            <Route index element={<Navigate to="/issues" replace />} />

            <Route
              path="/issues"
              element={
                <Suspense>
                  <IssuesPage />
                </Suspense>
              }
            />
            <Route
              path="/time"
              element={
                <Suspense>
                  <TimePage />
                </Suspense>
              }
            />
            <Route
              path="/settings"
              element={
                <Suspense>
                  <SettingsPage />
                </Suspense>
              }
            />
            <Route
              path="/modules"
              element={
                <Suspense>
                  <ModulesPage />
                </Suspense>
              }
            />
            <Route
              path="/dashboard"
              element={
                <Suspense>
                  <DashboardPage />
                </Suspense>
              }
            />

            <Route
              path="*"
              element={
                <Toast
                  type="error"
                  message={formatMessage({ id: 'nav.error.page-not-found' })}
                  allowClose={false}
                />
              }
            />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default App
