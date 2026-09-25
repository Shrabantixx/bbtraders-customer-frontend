import { useEffect, useState } from 'react'
import { apiGet, apiPut } from '../../lib/apiClient'

interface Order {
  id: string
  customer_name: string
  phone: string
  address: string
  status: string
  total: number
  created_at: string
}

const STATUS_OPTIONS = ['pending', 'shipped', 'delivered']

function OrderManager() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  async function loadOrders() {
    try {
      const data = await apiGet('/orders')
      setOrders(data)
    } catch (err) {
      console.error(err)
      setError('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetching data on mount
    loadOrders()
  }, [])

  async function handleStatusChange(orderId: string, newStatus: string) {
    setUpdatingId(orderId)
    try {
      await apiPut(`/orders/${orderId}/status`, { status: newStatus })
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      )
    } catch (err) {
      console.error(err)
      setError('Failed to update status')
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading) return <p className="p-6 text-gray-500">Loading...</p>

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Orders</h1>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">{order.customer_name}</p>
                  <p className="text-sm text-gray-500">{order.phone}</p>
                  <p className="text-sm text-gray-500">{order.address}</p>
                </div>
                <div className="text-right">
                  <p className="text-green-600 font-semibold">৳{order.total}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <span className="text-sm text-gray-500">Status:</span>
                <select
                  value={order.status}
                  disabled={updatingId === order.id}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className="border rounded-lg px-3 py-1 text-sm capitalize"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status} className="capitalize">
                      {status}
                    </option>
                  ))}
                </select>
                {updatingId === order.id && (
                  <span className="text-xs text-gray-400">Saving...</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default OrderManager