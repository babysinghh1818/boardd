import React from 'react'
import { useSettings } from '../contexts/SettingsContext'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'

const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' }
]

const timezones = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'Eastern Time (New York)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (Los Angeles)' },
  { value: 'Europe/London', label: 'Greenwich Mean Time (London)' },
  { value: 'Europe/Paris', label: 'Central European Time (Paris)' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time (Tokyo)' },
  { value: 'Asia/Shanghai', label: 'China Standard Time (Shanghai)' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time (Sydney)' }
]

const Settings = () => {
  const { 
    theme, 
    currency, 
    timezone, 
    updateTheme, 
    updateCurrency, 
    updateTimezone 
  } = useSettings()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Customize your dashboard preferences
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Theme Settings */}
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Appearance
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Theme
              </label>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <button
                  onClick={() => updateTheme('light')}
                  className={`flex items-center justify-center px-4 py-2 border rounded-md transition-colors ${
                    theme === 'light'
                      ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <SunIcon className="h-5 w-5 mr-2" />
                  Light
                </button>
                <button
                  onClick={() => updateTheme('dark')}
                  className={`flex items-center justify-center px-4 py-2 border rounded-md transition-colors ${
                    theme === 'dark'
                      ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <MoonIcon className="h-5 w-5 mr-2" />
                  Dark
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Currency Settings */}
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Currency
          </h3>
          
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Default Currency
            </label>
            <select
              value={currency}
              onChange={(e) => updateCurrency(e.target.value)}
              className="mt-2 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {currencies.map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.symbol} {curr.name} ({curr.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Timezone Settings */}
        <div className="card p-6 lg:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Timezone
          </h3>
          
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Default Timezone
            </label>
            <select
              value={timezone}
              onChange={(e) => updateTimezone(e.target.value)}
              className="mt-2 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {timezones.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Export Settings */}
        <div className="card p-6 lg:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Data Export
          </h3>
          
          <div className="flex flex-wrap gap-4">
            <button className="btn-primary">
              Export Dashboard as PDF
            </button>
            <button className="btn-secondary">
              Export All Data as CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings