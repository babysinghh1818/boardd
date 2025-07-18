import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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
    <motion.div 
      className="card p-6 hover:shadow-lg transition-all duration-300 hover:scale-105"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <motion.div 
            className={`p-3 rounded-lg ${colorClasses[color]}`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <Icon className="h-6 w-6 text-white" />
          </motion.div>
        </div>
        
        <div className="ml-5 w-0 flex-1">
          <div className="flex items-center justify-between">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
              {title}
            </dt>
            {tooltip && (
              <div className="group relative">
                <InformationCircleIcon className="h-4 w-4 text-gray-400 cursor-help" />
                <motion.div 
                  className="absolute bottom-full right-0 mb-2 hidden group-hover:block w-48 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-10"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {tooltip}
                </motion.div>
              </div>
            )}
          </div>
          
          <motion.dd 
            className="text-lg font-medium text-gray-900 dark:text-white"
            key={animatedValue}
            initial={{ scale: 1.2, color: "#3b82f6" }}
            animate={{ scale: 1, color: "inherit" }}
            transition={{ duration: 0.3 }}
          >
            {formatValue(animatedValue)}
          </motion.dd>
          
          {change !== undefined && (
            <motion.div 
              className={`flex items-center text-sm ${changeColor}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <ChangeIcon className="h-4 w-4 mr-1" />
              <span>{Math.abs(change).toFixed(1)}%</span>
              <span className="ml-1 text-gray-500 dark:text-gray-400">vs last period</span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default KPICard