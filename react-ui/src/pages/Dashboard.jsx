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
  BanknotesIcon
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
        topCustomersRes,
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
        axios.get(`/api/metrics/top-customers?period=${dateRange}&currency=${currency}&timezone=${timezone}`),
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
        users: usersRes.data
      })

      setChartData({
        topCustomers: topCustomersRes.data,
        depositMethods: depositMethodsRes.data,
        orderStatus: orderStatusRes.data
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <LoadingSkeleton className="h-10 w-48" />
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <DateRangeFilter />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Revenue"
          value={metrics.revenue?.total || 0}
          change={metrics.revenue?.change || 0}
          icon={CurrencyDollarIcon}
          color="green"
          currency={currency}
        />
        <KPICard
          title="Total Deposits"
          value={metrics.deposits?.total || 0}
          change={metrics.deposits?.change || 0}
          icon={BanknotesIcon}
          color="blue"
          currency={currency}
        />
        <KPICard
          title="Total Orders"
          value={metrics.orders?.total || 0}
          change={metrics.orders?.change || 0}
          icon={ShoppingCartIcon}
          color="purple"
        />
        <KPICard
          title="New Signups"
          value={metrics.signups?.total || 0}
          change={metrics.signups?.change || 0}
          icon={UserGroupIcon}
          color="indigo"
        />
        <KPICard
          title="Total Sales"
          value={metrics.sales?.total || 0}
          change={metrics.sales?.change || 0}
          icon={ChartBarIcon}
          color="emerald"
          currency={currency}
        />
        <KPICard
          title="Total Profit"
          value={metrics.profit?.total || 0}
          change={metrics.profit?.change || 0}
          icon={CurrencyDollarIcon}
          color="green"
          currency={currency}
        />
        <KPICard
          title="Zero Balance Users"
          value={metrics.users?.zeroBalance || 0}
          icon={UsersIcon}
          color="red"
        />
        <KPICard
          title="Profit Margin"
          value={metrics.profit?.margin || 0}
          change={metrics.profit?.marginChange || 0}
          icon={ChartBarIcon}
          color="yellow"
          suffix="%"
        />
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
    </div>
  )
}

export default Dashboard