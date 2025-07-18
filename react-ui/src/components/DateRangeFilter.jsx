import React from 'react'
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { ChevronDownIcon, CalendarIcon } from '@heroicons/react/24/outline'
import { useSettings } from '../contexts/SettingsContext'

const dateRanges = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'custom', label: 'Custom Range' }
]

const DateRangeFilter = () => {
  const { dateRange, updateDateRange } = useSettings()

  const currentRange = dateRanges.find(range => range.value === dateRange)

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white dark:bg-gray-800 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
          <CalendarIcon className="h-5 w-5" />
          {currentRange?.label || 'Select Range'}
          <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {dateRanges.map((range) => (
              <Menu.Item key={range.value}>
                {({ active }) => (
                  <button
                    onClick={() => updateDateRange(range.value)}
                    className={`block w-full px-4 py-2 text-left text-sm ${
                      active
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        : 'text-gray-700 dark:text-gray-300'
                    } ${
                      dateRange === range.value
                        ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                        : ''
                    }`}
                  >
                    {range.label}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default DateRangeFilter