import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSettings } from '../contexts/SettingsContext'
import DateRangeFilter from '../components/DateRangeFilter'
import KPICard from '../components/KPICard'
import ChartCard from '../components/ChartCard'
import LoadingSkeleton from '../components/LoadingSkeleton'
import axios from 'axios'
import {
  CurrencyDollarIcon,
  UserGroupIcon,
  ShoppingCartIcon,
  ChartBarIcon,
  UsersIcon,
  BanknotesIcon,
  TrophyIcon,
  GiftIcon
} from '@heroicons/react/24/outline'

const Dashboard = () => {
  const { dateRange, currency, timezone } = useSettings()
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState({})
  const [chartData, setChartData] = useState({})

  useEffect(() => {
    loadDashboardData()
  }, [dateRange, currency, timezone])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      // Load all metrics in parallel
      const promises = [
        axios.get(`/api/metrics/deposits?period=${dateRange}&currency=${currency}&timezone=${timezone}`),
        axios.get(`/api/metrics/sales?period=${dateRange}&currency=${currency}&timezone=${timezone}`),
        axios.get(`/api/metrics/signups?period=${dateRange}&timezone=${timezone}`),
        axios.get(`/api/metrics/revenue?period=${dateRange}&currency=${currency}&timezone=${timezone}`),
        axios.get(`/api/metrics/profit?period=${dateRange}&currency=${currency}&timezone=${timezone}`),
        axios.get(`/api/metrics/orders/count?period=${dateRange}&timezone=${timezone}`),
        axios.get(`/api/metrics/users/zero-balance?timezone=${timezone}`),
        axios.get(`/api/metrics/signup-to-deposit?period=${dateRange}&timezone=${timezone}`),
        axios.get(`/api/metrics/signup-to-order?period=${dateRange}&timezone=${timezone}`),
        axios.get(`/api/metrics/rewards?period=${dateRange}&currency=${currency}&timezone=${timezone}`),
        axios.get(`/api/metrics/users/affiliate-positive?timezone=${timezone}`),
        axios.get(`/api/metrics/average-deposit?period=${dateRange}&currency=${currency}&timezone=${timezone}`),
        axios.get(`/api/metrics/orders/average-charge?period=${dateRange}&currency=${currency}&timezone=${timezone}`),
        axios.get(`/api/metrics/users/inactive?timezone=${timezone}`),
        axios.get(`/api/metrics/ltv?period=${dateRange}&currency=${currency}&timezone=${timezone}`),
        axios.get(`/api/metrics/top-customers?period=${dateRange}&currency=${currency}&timezone=${timezone}`),
        axios.get(`/api/metrics/best-selling?period=${dateRange}&timezone=${timezone}`),
        axios.get(`/api/metrics/deposit-methods?period=${dateRange}&currency=${currency}&timezone=${timezone}`),
        axios.get(`/api/metrics/orders/status-distribution?period=${dateRange}&timezone=${timezone}`)
      ]
      
      const results = await Promise.allSettled(promises)

      // Handle results with error checking
      const [
        depositsRes,
        salesRes,
        signupsRes,
        revenueRes,
        profitRes,
        ordersRes,
        usersRes,
        signupToDepositRes,
        signupToOrderRes,
        rewardsRes,
        affiliateRes,
        avgDepositRes,
        avgChargeRes,
        inactiveRes,
        ltvRes,
        topCustomersRes,
        bestSellingRes,
        depositMethodsRes,
        orderStatusRes
      ] = results.map(result => result.status === 'fulfilled' ? result.value : { data: {} })

      setMetrics({
        deposits: depositsRes.data || {},
        sales: salesRes.data || {},
        signups: signupsRes.data || {},
        revenue: revenueRes.data || {},
        profit: profitRes.data || {},
        orders: ordersRes.data || {},
        users: usersRes.data || {},
        signupToDeposit: signupToDepositRes.data || {},
        signupToOrder: signupToOrderRes.data || {},
        rewards: rewardsRes.data || {},
        affiliate: affiliateRes.data || {},
        avgDeposit: avgDepositRes.data || {},
        avgCharge: avgChargeRes.data || {},
        inactive: inactiveRes.data || {},
        ltv: ltvRes.data || {}
      })

      setChartData({
        topCustomers: topCustomersRes.data || {},
        bestSelling: bestSellingRes.data || {},
        depositMethods: depositMethodsRes.data || {},
        orderStatus: orderStatusRes.data || {}
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportDashboard = () => {
    // Export dashboard as PDF using browser print
    const printWindow = window.open('', '_blank')
    const dashboardContent = document.querySelector('.dashboard-content').innerHTML
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Analytics Dashboard Export</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .grid { display: grid; gap: 20px; }
            .card { border: 1px solid #ccc; padding: 15px; border-radius: 8px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <h1>Analytics Dashboard - ${new Date().toLocaleDateString()}</h1>
          ${dashboardContent}
        </body>
      </html>
    `)
    
    printWindow.document.close()
    printWindow.print()
  }

  if (loading) {
    return (
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <LoadingSkeleton className="h-10 w-48" />
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(12)].map((_, i) => (
            <LoadingSkeleton key={i} className="h-32" />
          ))}
        </div>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <LoadingSkeleton key={i} className="h-80" />
          ))}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div 
      className="space-y-6 dashboard-content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div 
        className="flex justify-between items-center"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Comprehensive business metrics and insights
          </p>
        </div>
        <div className="flex space-x-3">
          <DateRangeFilter />
          <motion.button
            onClick={exportDashboard}
            className="btn-secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Export PDF
          </motion.button>
        </div>
      </motion.div>

      {/* Primary KPI Cards */}
      <motion.div 
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <motion.div key="revenue-card"><KPICard
          title="Total Revenue"
          value={metrics.revenue?.total || 0}
          change={metrics.revenue?.change || 0}
          icon={CurrencyDollarIcon}
          color="green"
          currency={currency}
          tooltip="Total revenue from completed orders"
        /></motion.div>
        <motion.div key="deposits-card"><KPICard
          title="Total Deposits"
          value={metrics.deposits?.total || 0}
          change={metrics.deposits?.change || 0}
          icon={BanknotesIcon}
          color="blue"
          currency={currency}
          tooltip="Total deposits excluding bonuses"
        /></motion.div>
        <motion.div key="orders-card"><KPICard
          title="Total Orders"
          value={metrics.orders?.total || 0}
          change={metrics.orders?.change || 0}
          icon={ShoppingCartIcon}
          color="purple"
          tooltip="Total number of orders placed"
        /></motion.div>
        <motion.div key="signups-card"><KPICard
          title="New Signups"
          value={metrics.signups?.total || 0}
          change={metrics.signups?.change || 0}
          icon={UserGroupIcon}
          color="indigo"
          tooltip="New user registrations"
        /></motion.div>
      </motion.div>

      {/* Secondary KPI Cards */}
      <motion.div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div key="profit-card"><KPICard
          title="Total Profit"
          value={metrics.profit?.total || 0}
          change={metrics.profit?.change || 0}
          icon={TrophyIcon}
          color="emerald"
          currency={currency}
          tooltip="Total profit from completed orders"
        /></motion.div>
        <motion.div key="margin-card"><KPICard
          title="Profit Margin"
          value={metrics.profit?.margin || 0}
          change={metrics.profit?.marginChange || 0}
          icon={ChartBarIcon}
          color="yellow"
          suffix="%"
          tooltip="Profit margin percentage"
        /></motion.div>
        <motion.div key="rewards-card"><KPICard
          title="Rewards Paid"
          value={metrics.rewards?.total || 0}
          icon={GiftIcon}
          color="pink"
          currency={currency}
          tooltip="Total bonus/reward payments"
        /></motion.div>
        <motion.div key="ltv-card"><KPICard
          title="Customer LTV"
          value={metrics.ltv?.ltv || 0}
          icon={CurrencyDollarIcon}
          color="cyan"
          currency={currency}
          tooltip="Average customer lifetime value"
        /></motion.div>
      </motion.div>

      {/* Conversion & User Metrics */}
      <motion.div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div key="signup-deposit-card"><KPICard
          title="Signup to Deposit"
          value={metrics.signupToDeposit?.conversion_rate || 0}
          icon={ChartBarIcon}
          color="blue"
          suffix="%"
          tooltip="Percentage of signups who made deposits"
        /></motion.div>
        <motion.div key="signup-order-card"><KPICard
          title="Signup to Order"
          value={metrics.signupToOrder?.conversion_rate || 0}
          icon={ChartBarIcon}
          color="green"
          suffix="%"
          tooltip="Percentage of signups who placed orders"
        /></motion.div>
        <motion.div key="zero-balance-card"><KPICard
          title="Zero Balance Users"
          value={metrics.users?.zeroBalance || 0}
          icon={UsersIcon}
          color="red"
          tooltip="Users with zero account balance"
        /></motion.div>
        <motion.div key="affiliate-card"><KPICard
          title="Affiliate Earners"
          value={metrics.affiliate?.affiliatePositive || 0}
          icon={UsersIcon}
          color="purple"
          tooltip="Users with positive affiliate balance"
        /></motion.div>
      </motion.div>

      {/* Average Metrics */}
      <motion.div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div key="avg-deposit-card"><KPICard
          title="Avg Deposit"
          value={metrics.avgDeposit?.average || 0}
          icon={BanknotesIcon}
          color="blue"
          currency={currency}
          tooltip="Average deposit amount"
        /></motion.div>
        <motion.div key="avg-order-card"><KPICard
          title="Avg Order Value"
          value={metrics.avgCharge?.average || 0}
          icon={ShoppingCartIcon}
          color="green"
          currency={currency}
          tooltip="Average order charge amount"
        /></motion.div>
        <motion.div key="inactive-card"><KPICard
          title="Inactive Users"
          value={metrics.inactive?.inactive || 0}
          icon={UsersIcon}
          color="gray"
          tooltip="Users inactive for 30+ days"
        /></motion.div>
        <motion.div 
          className="card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {metrics.deposits?.count || 0}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Total Deposits Count
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Charts */}
      <motion.div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div key="revenue-chart"><ChartCard
          title="Revenue Trend"
          data={metrics.revenue?.chartData}
          type="line"
          currency={currency}
        /></motion.div>
        <motion.div key="deposit-methods-chart"><ChartCard
          title="Deposit Methods"
          data={chartData.depositMethods}
          type="doughnut"
          currency={currency}
        /></motion.div>
        <motion.div key="top-customers-chart"><ChartCard
          title="Top Customers"
          data={chartData.topCustomers}
          type="bar"
          currency={currency}
        /></motion.div>
        <motion.div key="order-status-chart"><ChartCard
          title="Order Status Distribution"
          data={chartData.orderStatus}
          type="doughnut"
        /></motion.div>
      </motion.div>

      {/* Additional Charts */}
      <motion.div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div key="best-selling-chart"><ChartCard
          title="Best Selling Services"
          data={chartData.bestSelling}
          type="bar"
        /></motion.div>
        <motion.div key="deposits-comparison-chart"><ChartCard
          title="Deposits vs Previous Period"
          data={metrics.deposits?.chartData}
          type="bar"
          currency={currency}
        /></motion.div>
      </motion.div>
    </motion.div>
  )
}

export default Dashboard