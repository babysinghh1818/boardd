import React, { useState, useEffect } from 'react'
import { ArrowUpIcon, ArrowDownIcon, InformationCircleIcon } from '@heroicons/react/24/outline'

const KPICard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color = 'blue', 
  currency, 
  suffix = '',
  tooltip 
}) => {
  const [animatedValue, setAnimatedValue] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value)
    }, 100)
    return () => clearTimeout(timer)
  }, [value])

  const formatValue = (val) => {
    if (currency && !suffix) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }).format(val)
    }
    
    if (val >= 1000000) {
      return (val / 1000000).toFixed(1) + 'M' + suffix
    } else if (val >= 1000) {
      return (val / 1000).toFixed(1) + 'K' + suffix
    }
    
    return val.toLocaleString() + suffix
  }

  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    indigo: 'bg-indigo-500',
    emerald: 'bg-emerald-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500'
  }

  const changeColor = change >= 0 ? 'text-green-600' : 'text-red-600'
  const ChangeIcon = change >= 0 ? ArrowUpIcon : ArrowDownIcon

  return (
    <div className="card p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
        
        <div className="ml-5 w-0 flex-1">
          <div className="flex items-center justify-between">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
              {title}
            </dt>
            {tooltip && (
              <div className="group relative">
                <InformationCircleIcon className="h-4 w-4 text-gray-400 cursor-help" />
                <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block w-48 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-10">
                  {tooltip}
                </div>
              </div>
            )}
          </div>
          
          <dd className="text-lg font-medium text-gray-900 dark:text-white">
            {formatValue(animatedValue)}
          </dd>
          
          {change !== undefined && (
            <div className={`flex items-center text-sm ${changeColor}`}>
              <ChangeIcon className="h-4 w-4 mr-1" />
              <span>{Math.abs(change).toFixed(1)}%</span>
              <span className="ml-1 text-gray-500 dark:text-gray-400">vs last period</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default KPICard