import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

interface OrderSummary {
  id: string
  status: string
  total: number
  created_at: string
}

function OrderHistory() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<OrderSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      if (!user) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('orders')
        .select('id, status, total, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) console.error('Order history fetch failed:', error.message)
      setOrders(data || [])
      setLoading(false)
    }

    fetchOrders()
  }, [user])

  if (loading) return <p className="p-6 text-gray-500">Loading...</p>

  if (!user) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Please log in to see your orders.</p>
        <Link to="/login" className="text-green-600 hover:underline mt-2 inline-block">
          Log In
        </Link>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">You haven't placed any orders yet.</p>
        <Link to="/" className="text-green-600 hover:underline mt-2 inline-block">
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      <div className="space-y-3">
        {orders.map((order) => (
          <Link
            key={order.id}
            to={`/order-confirmation/${order.id}`}
            className="block border rounded-lg p-4 hover:shadow-md transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
                <p className="font-medium capitalize">{order.status}</p>
              </div>
              <p className="text-green-600 font-semibold">৳{order.total}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default OrderHistory