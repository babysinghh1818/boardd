import React, { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useSettings } from '../contexts/SettingsContext'

const UserModal = ({ user, open, onClose }) => {
  const { currency } = useSettings()

  if (!user) return null

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount || 0)
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="w-full">
                    {/* User Header */}
                    <div className="mb-6">
                      <div className="flex items-center">
                        <div className="h-16 w-16 rounded-full bg-primary-600 flex items-center justify-center">
                          <span className="text-xl font-medium text-white">
                            {user.profile?.first_name?.charAt(0)}{user.profile?.last_name?.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {user.profile?.first_name} {user.profile?.last_name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {user.profile?.email}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Role: {user.profile?.role} | ID: {user.profile?.id}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                      <div className="card p-4">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Balance</dt>
                        <dd className="text-lg font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(user.profile?.balance)}
                        </dd>
                      </div>
                      <div className="card p-4">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Spent</dt>
                        <dd className="text-lg font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(user.stats?.totalSpent)}
                        </dd>
                      </div>
                      <div className="card p-4">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Orders</dt>
                        <dd className="text-lg font-semibold text-gray-900 dark:text-white">
                          {user.stats?.totalOrders || 0}
                        </dd>
                      </div>
                      <div className="card p-4">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Affiliate Balance</dt>
                        <dd className="text-lg font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(user.profile?.affiliate_bal_available)}
                        </dd>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      {/* Recent Orders */}
                      <div className="card p-4">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                          Recent Orders
                        </h4>
                        <div className="space-y-3">
                          {user.recentOrders?.slice(0, 5).map((order, index) => (
                            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  Order #{order.id}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {order.service_id} • {order.status}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {formatCurrency(order.charge)}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {new Date(order.created).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recent Transactions */}
                      <div className="card p-4">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                          Recent Transactions
                        </h4>
                        <div className="space-y-3">
                          {user.recentTransactions?.slice(0, 5).map((transaction, index) => (
                            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {transaction.type}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {transaction.transaction_id}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {formatCurrency(transaction.amount)}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {new Date(transaction.created).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Top Services */}
                    {user.topServices && user.topServices.length > 0 && (
                      <div className="card p-4 mt-6">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                          Top Services Used
                        </h4>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
                          {user.topServices.map((service, index) => (
                            <div key={index} className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                Service {service.service_id}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {service.count} orders
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {formatCurrency(service.total_spent)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default UserModal