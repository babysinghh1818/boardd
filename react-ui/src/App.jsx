import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import { useSettings } from './contexts/SettingsContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Search from './pages/Search'
import Settings from './pages/Settings'
import Layout from './components/Layout'

function App() {
  const { user, loading } = useAuth()
  const { theme } = useSettings()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className={theme}>
      <Switch>
        <Route path="/login" component={Login} />
        {user ? (
          <Layout>
            <Switch>
              <Route exact path="/dashboard" component={Dashboard} />
              <Route exact path="/search" component={Search} />
              <Route exact path="/settings" component={Settings} />
              <Redirect from="/" to="/dashboard" />
            </Switch>
          </Layout>
        ) : (
          <Redirect to="/login" />
        )}
      </Switch>
    </div>
  )
}

export default App