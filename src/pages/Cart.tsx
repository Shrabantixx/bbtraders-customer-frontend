import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function Cart() {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart()

  if (items.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Your cart is empty.</p>
        <Link to="/" className="text-green-600 hover:underline mt-2 inline-block">
          Browse products
        </Link>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.product.id} className="flex items-center justify-between border rounded-lg p-4">
            <div>
              <h3 className="font-medium">{item.product.name}</h3>
              <p className="text-green-600">৳{item.product.price}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                className="border rounded px-2"
              >
                −
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                className="border rounded px-2"
              >
                +
              </button>
              <button
                onClick={() => removeFromCart(item.product.id)}
                className="text-red-500 text-sm ml-4"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-t pt-4">
        <span className="text-lg font-semibold">Total: ৳{totalPrice}</span>
        <Link
          to="/checkout"
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  )
}

export default Cart