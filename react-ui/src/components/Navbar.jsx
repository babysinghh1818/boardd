import React, { useState, useRef, useEffect } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  BellIcon,
  SunIcon,
  MoonIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'
import { useSettings } from '../contexts/SettingsContext'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'

const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY']
const timezones = [
  'UTC',
  'America/New_York',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Australia/Sydney'
]

const Navbar = ({ setSidebarOpen }) => {
  const { theme, currency, timezone, updateTheme, updateCurrency, updateTimezone } = useSettings()
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [notifications, setNotifications] = useState([])
  const searchRef = useRef(null)

  useEffect(() => {
    // Load notifications
    const loadNotifications = async () => {
      try {
        const response = await axios.get('/api/system/notifications')
        setNotifications(response.data)
      } catch (error) {
        console.error('Error loading notifications:', error)
      }
    }
    loadNotifications()
  }, [])

  const handleSearch = async (query) => {
    setSearchQuery(query)
    if (query.length > 2) {
      try {
        const response = await axios.get(`/api/users/search?query=${encodeURIComponent(query)}`)
        setSearchResults(response.data)
        setShowSearchResults(true)
      } catch (error) {
        console.error('Search error:', error)
        setSearchResults([])
      }
    } else {
      setSearchResults([])
      setShowSearchResults(false)
    }
  }

  const toggleTheme = () => {
    updateTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Mobile menu button */}
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-300 lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <Bars3Icon className="h-6 w-6" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 lg:hidden" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        {/* Search */}
        <div className="relative flex flex-1" ref={searchRef}>
          <label htmlFor="search-field" className="sr-only">
            Search users
          </label>
          <MagnifyingGlassIcon className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400" />
          <input
            id="search-field"
            className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-0 sm:text-sm bg-transparent"
            placeholder="Search users..."
            type="search"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
          />
          
          {/* Search Results Dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                  onClick={() => {
                    // Handle user selection
                    setShowSearchResults(false)
                    setSearchQuery('')
                  }}
                >
                  <div className="font-medium text-gray-900 dark:text-white">
                    {user.first_name} {user.last_name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {user.email}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Currency Selector */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900 dark:text-white">
              {currency}
              <ChevronDownIcon className="h-5 w-5" />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white dark:bg-gray-800 py-2 shadow-lg ring-1 ring-gray-900/5 dark:ring-gray-700 focus:outline-none">
                {currencies.map((curr) => (
                  <Menu.Item key={curr}>
                    {({ active }) => (
                      <button
                        onClick={() => updateCurrency(curr)}
                        className={`block w-full px-3 py-1 text-left text-sm leading-6 ${
                          active ? 'bg-gray-50 dark:bg-gray-700' : ''
                        } ${curr === currency ? 'text-primary-600 font-semibold' : 'text-gray-900 dark:text-white'}`}
                      >
                        {curr}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>

          {/* Timezone Selector */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900 dark:text-white">
              {timezone.split('/').pop()}
              <ChevronDownIcon className="h-5 w-5" />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2.5 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 py-2 shadow-lg ring-1 ring-gray-900/5 dark:ring-gray-700 focus:outline-none max-h-60 overflow-y-auto">
                {timezones.map((tz) => (
                  <Menu.Item key={tz}>
                    {({ active }) => (
                      <button
                        onClick={() => updateTimezone(tz)}
                        className={`block w-full px-3 py-1 text-left text-sm leading-6 ${
                          active ? 'bg-gray-50 dark:bg-gray-700' : ''
                        } ${tz === timezone ? 'text-primary-600 font-semibold' : 'text-gray-900 dark:text-white'}`}
                      >
                        {tz}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            {theme === 'light' ? (
              <MoonIcon className="h-6 w-6" />
            ) : (
              <SunIcon className="h-6 w-6" />
            )}
          </button>

          {/* Notifications */}
          <Menu as="div" className="relative">
            <Menu.Button className="relative p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <BellIcon className="h-6 w-6" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2.5 w-80 origin-top-right rounded-md bg-white dark:bg-gray-800 py-2 shadow-lg ring-1 ring-gray-900/5 dark:ring-gray-700 focus:outline-none">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
                </div>
                {notifications.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    No new notifications
                  </div>
                ) : (
                  notifications.map((notification, index) => (
                    <Menu.Item key={index}>
                      <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <p className="text-sm text-gray-900 dark:text-white">{notification.message}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                      </div>
                    </Menu.Item>
                  ))
                )}
              </Menu.Items>
            </Transition>
          </Menu>

          {/* User menu */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900 dark:text-white">
              <span className="sr-only">Open user menu</span>
              <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <span className="hidden lg:flex lg:items-center">
                <span className="ml-2">{user?.name}</span>
                <ChevronDownIcon className="ml-2 h-5 w-5" />
              </span>
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white dark:bg-gray-800 py-2 shadow-lg ring-1 ring-gray-900/5 dark:ring-gray-700 focus:outline-none">
                <Menu.Item>
                  <div className="px-3 py-1 text-sm text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </div>
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </div>
  )
}

export default Navbar