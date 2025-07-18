import React from 'react'

const LoadingSkeleton = ({ className = '', width, height }) => {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded'
  const style = {}
  
  if (width) style.width = width
  if (height) style.height = height

  return (
    <div 
      className={`${baseClasses} ${className}`}
      style={style}
    />
  )
}

export default LoadingSkeleton