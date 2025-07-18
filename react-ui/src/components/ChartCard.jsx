import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import { ArrowDownTrayIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

const ChartCard = ({ title, data, type = 'line', currency, height = 300 }) => {
  if (!data) {
    return (
      <div className="card p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
        </div>
        <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          No data available
        </div>
      </div>
    )
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#374151',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || ''
            if (label) {
              label += ': '
            }
            if (currency && type !== 'doughnut') {
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currency
              }).format(context.parsed.y || context.parsed)
            } else {
              label += context.parsed.y || context.parsed
            }
            return label
          }
        }
      }
    },
    scales: type !== 'doughnut' ? {
      x: {
        grid: {
          color: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb'
        },
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#6b7280'
        }
      },
      y: {
        grid: {
          color: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb'
        },
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#6b7280',
          callback: function(value) {
            if (currency) {
              return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currency,
                minimumFractionDigits: 0
              }).format(value)
            }
            return value
          }
        }
      }
    } : undefined
  }

  const exportAsCSV = () => {
    if (!data || !data.labels) return
    
    let csvContent = "data:text/csv;charset=utf-8,"
    csvContent += "Label,Value\n"
    
    data.labels.forEach((label, index) => {
      const value = data.datasets[0]?.data[index] || 0
      csvContent += `"${label}",${value}\n`
    })
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `${title.replace(/\s+/g, '_').toLowerCase()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportAsPNG = () => {
    const canvas = document.querySelector(`#chart-${title.replace(/\s+/g, '-').toLowerCase()} canvas`)
    if (canvas) {
      const link = document.createElement('a')
      link.download = `${title.replace(/\s+/g, '_').toLowerCase()}.png`
      link.href = canvas.toDataURL()
      link.click()
    }
  }

  const renderChart = () => {
    switch (type) {
      case 'line':
        return <Line data={data} options={options} />
      case 'bar':
        return <Bar data={data} options={options} />
      case 'doughnut':
        return <Doughnut data={data} options={options} />
      default:
        return <Line data={data} options={options} />
    }
  }

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
        <div className="flex space-x-2">
          <button
            onClick={exportAsCSV}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            title="Export as CSV"
          >
            <DocumentArrowDownIcon className="h-5 w-5" />
          </button>
          <button
            onClick={exportAsPNG}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            title="Export as PNG"
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div id={`chart-${title.replace(/\s+/g, '-').toLowerCase()}`} style={{ height: `${height}px` }}>
        {renderChart()}
      </div>
    </div>
  )
}

export default ChartCard