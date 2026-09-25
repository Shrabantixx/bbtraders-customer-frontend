import { useParams, Link } from 'react-router-dom'

function OrderConfirmation() {
  const { id } = useParams()

  return (
    <div className="p-6 max-w-lg mx-auto text-center">
      <div className="text-green-600 text-5xl mb-4">✓</div>
      <h1 className="text-2xl font-bold mb-2">Order Placed Successfully!</h1>
      <p className="text-gray-600 mb-4">
        Your order has been received and will be processed soon.
      </p>
      <div className="bg-gray-100 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-500">Your Order ID</p>
        <p className="font-mono text-sm break-all">{id}</p>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        Save this Order ID — you'll need it to track your order later.
      </p>
      <Link to="/" className="text-green-600 hover:underline">Continue Shopping</Link>
    </div>
  )
}

export default OrderConfirmation