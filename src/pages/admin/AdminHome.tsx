import { Link } from 'react-router-dom'

function AdminHome() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid gap-4">
        <Link to="/admin/categories" className="border rounded-lg p-4 hover:shadow-md transition">
          <h2 className="font-medium">Manage Categories</h2>
          <p className="text-sm text-gray-500">Add or remove product categories</p>
        </Link>
        <Link to="/admin/products" className="border rounded-lg p-4 hover:shadow-md transition">
          <h2 className="font-medium">Manage Products</h2>
          <p className="text-sm text-gray-500">Add, edit, or remove products</p>
        </Link>
        <Link to="/admin/orders" className="border rounded-lg p-4 hover:shadow-md transition">
          <h2 className="font-medium">Manage Orders</h2>
          <p className="text-sm text-gray-500">View orders and update delivery status</p>
        </Link>
      </div>
    </div>
  )
}

export default AdminHome