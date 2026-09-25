import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

interface OrderItem {
  quantity: number
  price: number
  product: { name: string } [] | null
}

interface OrderResult {
  id: string
  customer_name: string
  phone: string
  address: string
  status: string
  total: number
  created_at: string
}

function TrackOrder() {
  const [orderId, setOrderId] = useState('')
  const [phone, setPhone] = useState('')
  const [order, setOrder] = useState<OrderResult | null>(null)
  const [items, setItems] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setOrder(null)
    setItems([])
    setSearched(true)

    if (!orderId || !phone) {
      setError('Please enter both Order ID and phone number.')
      return
    }

    setLoading(true)

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('id, customer_name, phone, address, status, total, created_at')
      .eq('id', orderId.trim())
      .eq('phone', phone.trim())
      .single()

    if (orderError || !orderData) {
      setError('No order found. Check your Order ID and phone number and try again.')
      setLoading(false)
      return
    }

    const { data: itemsData, error: itemsError } = await supabase
      .from('order_items')
      .select('quantity, price, product:products(name)')
      .eq('order_id', orderData.id)

    if (itemsError) console.error('Order items fetch failed:', itemsError.message)

    setOrder(orderData)
    setItems(itemsData || [])
    setLoading(false)
  }

  const statusSteps = ['pending', 'shipped', 'delivered']
  const currentStepIndex = order ? statusSteps.indexOf(order.status) : -1

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Track Your Order</h1>

      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Order ID</label>
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Paste your Order ID"
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="The phone number used at checkout"
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Track Order'}
        </button>
      </form>

      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

      {order && (
        <div className="mt-8 border rounded-lg p-6">
          <div className="flex justify-between text-sm text-gray-500 mb-4">
            <span>Order placed</span>
            <span>{new Date(order.created_at).toLocaleDateString()}</span>
          </div>

          <div className="flex items-center justify-between mb-6">
            {statusSteps.map((step, i) => (
              <div key={step} className="flex-1 flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                    i <= currentStepIndex ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {i + 1}
                </div>
                {i < statusSteps.length - 1 && (
                  <div className={`flex-1 h-1 ${i < currentStepIndex ? 'bg-green-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
          <p className="text-center font-medium capitalize mb-6">{order.status}</p>

          <div className="border-t pt-4 space-y-2">
            {items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>{item.product?.[0]?.name || 'Product'} × {item.quantity}</span>
                <span>৳{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 mt-4 flex justify-between font-semibold">
            <span>Total</span>
            <span>৳{order.total}</span>
          </div>

          <p className="text-sm text-gray-500 mt-4">Delivering to: {order.address}</p>
        </div>
      )}

      {!order && !error && searched && !loading && (
        <p className="text-gray-500 text-sm mt-4">No results yet.</p>
      )}
    </div>
  )
}

export default TrackOrder