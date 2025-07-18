import React, { createContext, useContext, useState, useEffect } from 'react'

const SettingsContext = createContext()

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}

export const SettingsProvider = ({ children }) => {
  const [theme, setTheme] = useState('light')
  const [currency, setCurrency] = useState('USD')
  const [timezone, setTimezone] = useState('UTC')
  const [dateRange, setDateRange] = useState('weekly')

  useEffect(() => {
    // Load settings from localStorage
    const savedTheme = localStorage.getItem('theme') || 'light'
    const savedCurrency = localStorage.getItem('currency') || 'USD'
    const savedTimezone = localStorage.getItem('timezone') || 'UTC'
    const savedDateRange = localStorage.getItem('dateRange') || 'weekly'

    setTheme(savedTheme)
    setCurrency(savedCurrency)
    setTimezone(savedTimezone)
    setDateRange(savedDateRange)

    // Apply theme to document
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const updateTheme = (newTheme) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const updateCurrency = (newCurrency) => {
    setCurrency(newCurrency)
    localStorage.setItem('currency', newCurrency)
  }

  const updateTimezone = (newTimezone) => {
    setTimezone(newTimezone)
    localStorage.setItem('timezone', newTimezone)
  }

  const updateDateRange = (newDateRange) => {
    setDateRange(newDateRange)
    localStorage.setItem('dateRange', newDateRange)
  }

  const value = {
    theme,
    currency,
    timezone,
    dateRange,
    updateTheme,
    updateCurrency,
    updateTimezone,
    updateDateRange
  }

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}