import React, { useState, useEffect } from 'react'
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
      ] = await Promise.all([
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
      ])

      setMetrics({
        deposits: depositsRes.data,
        sales: salesRes.data,
        signups: signupsRes.data,
        revenue: revenueRes.data,
        profit: profitRes.data,
        orders: ordersRes.data,
        users: usersRes.data,
        signupToDeposit: signupToDepositRes.data,
        signupToOrder: signupToOrderRes.data,
        rewards: rewardsRes.data,
        affiliate: affiliateRes.data,
        avgDeposit: avgDepositRes.data,
        avgCharge: avgChargeRes.data,
        inactive: inactiveRes.data,
        ltv: ltvRes.data
      })

      setChartData({
        topCustomers: topCustomersRes.data,
        bestSelling: bestSellingRes.data,
        depositMethods: depositMethodsRes.data,
        orderStatus: orderStatusRes.data
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportDashboard = () => {
    // Simple implementation - in production you'd use a proper PDF library
    window.print()
  }

  if (loading) {
    return (
      <div className="space-y-6">
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
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Comprehensive business metrics and insights
          </p>
        </div>
        <div className="flex space-x-3">
          <DateRangeFilter />
          <button
            onClick={exportDashboard}
            className="btn-secondary"
          >
            Export PDF
          </button>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Revenue"
          value={metrics.revenue?.total || 0}
          change={metrics.revenue?.change || 0}
          icon={CurrencyDollarIcon}
          color="green"
          currency={currency}
          tooltip="Total revenue from completed orders"
        />
        <KPICard
          title="Total Deposits"
          value={metrics.deposits?.total || 0}
          change={metrics.deposits?.change || 0}
          icon={BanknotesIcon}
          color="blue"
          currency={currency}
          tooltip="Total deposits excluding bonuses"
        />
        <KPICard
          title="Total Orders"
          value={metrics.orders?.total || 0}
          change={metrics.orders?.change || 0}
          icon={ShoppingCartIcon}
          color="purple"
          tooltip="Total number of orders placed"
        />
        <KPICard
          title="New Signups"
          value={metrics.signups?.total || 0}
          change={metrics.signups?.change || 0}
          icon={UserGroupIcon}
          color="indigo"
          tooltip="New user registrations"
        />
      </div>

      {/* Secondary KPI Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Profit"
          value={metrics.profit?.total || 0}
          change={metrics.profit?.change || 0}
          icon={TrophyIcon}
          color="emerald"
          currency={currency}
          tooltip="Total profit from completed orders"
        />
        <KPICard
          title="Profit Margin"
          value={metrics.profit?.margin || 0}
          change={metrics.profit?.marginChange || 0}
          icon={ChartBarIcon}
          color="yellow"
          suffix="%"
          tooltip="Profit margin percentage"
        />
        <KPICard
          title="Rewards Paid"
          value={metrics.rewards?.total || 0}
          icon={GiftIcon}
          color="pink"
          currency={currency}
          tooltip="Total bonus/reward payments"
        />
        <KPICard
          title="Customer LTV"
          value={metrics.ltv?.ltv || 0}
          icon={CurrencyDollarIcon}
          color="cyan"
          currency={currency}
          tooltip="Average customer lifetime value"
        />
      </div>

      {/* Conversion & User Metrics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Signup to Deposit"
          value={metrics.signupToDeposit?.conversion_rate || 0}
          icon={ChartBarIcon}
          color="blue"
          suffix="%"
          tooltip="Percentage of signups who made deposits"
        />
        <KPICard
          title="Signup to Order"
          value={metrics.signupToOrder?.conversion_rate || 0}
          icon={ChartBarIcon}
          color="green"
          suffix="%"
          tooltip="Percentage of signups who placed orders"
        />
        <KPICard
          title="Zero Balance Users"
          value={metrics.users?.zeroBalance || 0}
          icon={UsersIcon}
          color="red"
          tooltip="Users with zero account balance"
        />
        <KPICard
          title="Affiliate Earners"
          value={metrics.affiliate?.affiliatePositive || 0}
          icon={UsersIcon}
          color="purple"
          tooltip="Users with positive affiliate balance"
        />
      </div>

      {/* Average Metrics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Avg Deposit"
          value={metrics.avgDeposit?.average || 0}
          icon={BanknotesIcon}
          color="blue"
          currency={currency}
          tooltip="Average deposit amount"
        />
        <KPICard
          title="Avg Order Value"
          value={metrics.avgCharge?.average || 0}
          icon={ShoppingCartIcon}
          color="green"
          currency={currency}
          tooltip="Average order charge amount"
        />
        <KPICard
          title="Inactive Users"
          value={metrics.inactive?.inactive || 0}
          icon={UsersIcon}
          color="gray"
          tooltip="Users inactive for 30+ days"
        />
        <div className="card p-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {metrics.deposits?.count || 0}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Total Deposits Count
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard
          title="Revenue Trend"
          data={metrics.revenue?.chartData}
          type="line"
          currency={currency}
        />
        <ChartCard
          title="Deposit Methods"
          data={chartData.depositMethods}
          type="doughnut"
          currency={currency}
        />
        <ChartCard
          title="Top Customers"
          data={chartData.topCustomers}
          type="bar"
          currency={currency}
        />
        <ChartCard
          title="Order Status Distribution"
          data={chartData.orderStatus}
          type="doughnut"
        />
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard
          title="Best Selling Services"
          data={chartData.bestSelling}
          type="bar"
        />
        <ChartCard
          title="Deposits vs Previous Period"
          data={metrics.deposits?.chartData}
          type="bar"
          currency={currency}
        />
      </div>
    </div>
  )
}

export default Dashboard