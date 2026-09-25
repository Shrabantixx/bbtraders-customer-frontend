import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { totalItems } = useCart()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await signOut()
    navigate('/')
  }

  return (
    <header className="bg-green-600 text-white px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold">
        BB Traders Clone
      </Link>
      <nav className="flex gap-6 items-center">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/track-order" className="hover:underline">Track Order</Link>
        <Link to="/cart" className="hover:underline">Cart ({totalItems})</Link>
        <Link to="/contact" className="hover:underline">Contact</Link>
        <Link to="/become-seller" className="hover:underline">Sellers</Link>

        {user ? (
          <>
            <Link to="/orders" className="hover:underline">My Orders</Link>
            <button onClick={handleLogout} className="hover:underline">Logout</button>
          </>
        ) : (
          <Link to="/login" className="hover:underline">Login</Link>
        )}
      </nav>
    </header>
  )
}

export default Navbar