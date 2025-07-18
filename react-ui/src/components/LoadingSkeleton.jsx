import React from 'react'
import { motion } from 'framer-motion'

const LoadingSkeleton = ({ className = '', width, height }) => {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded'
  const style = {}
  
  if (width) style.width = width
  if (height) style.height = height

  return (
    <motion.div 
      className={`${baseClasses} ${className}`}
      style={style}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    />
  )
}

export default LoadingSkeleton