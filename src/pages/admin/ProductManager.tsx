import { useEffect, useState } from 'react'
import { apiGet, apiPost, apiPut, apiDelete } from '../../lib/apiClient'
import type { Product, Category } from '../../types'

function ProductManager() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image_url: '',
    category_id: '',
  })

  async function loadData() {
    try {
      const [productsData, categoriesData] = await Promise.all([
        apiGet('/products'),
        apiGet('/categories'),
      ])
      setProducts(productsData)
      setCategories(categoriesData)
    } catch (err) {
      console.error(err)
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetching data on mount
    loadData()
  }, [])

  function resetForm() {
    setForm({ name: '', description: '', price: '', stock: '', image_url: '', category_id: '' })
    setEditingId(null)
  }

  function startEdit(product: Product) {
    setEditingId(product.id)
    setForm({
      name: product.name,
      description: product.description || '',
      price: String(product.price),
      stock: String(product.stock),
      image_url: product.image_url || '',
      category_id: product.category_id,
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.price) {
      setError('Name and price are required')
      return
    }

    const payload = {
      name: form.name,
      description: form.description || null,
      price: Number(form.price),
      stock: Number(form.stock) || 0,
      image_url: form.image_url || null,
      category_id: form.category_id || null,
    }

    try {
      if (editingId) {
        await apiPut(`/products/${editingId}`, payload)
      } else {
        await apiPost('/products', payload)
      }
      resetForm()
      loadData()
    } catch (err) {
      console.error(err)
      setError(editingId ? 'Failed to update product' : 'Failed to add product')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this product?')) return
    try {
      await apiDelete(`/products/${id}`)
      loadData()
    } catch (err) {
      console.error(err)
      setError('Failed to delete product')
    }
  }

  if (loading) return <p className="p-6 text-gray-500">Loading...</p>

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Products</h1>

      <form onSubmit={handleSubmit} className="border rounded-lg p-4 mb-6 space-y-3">
        <h2 className="font-medium">{editingId ? 'Edit Product' : 'Add New Product'}</h2>

        <input
          type="text"
          placeholder="Product name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border rounded-lg px-3 py-2"
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={2}
          className="w-full border rounded-lg px-3 py-2"
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="border rounded-lg px-3 py-2"
          />
          <input
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            className="border rounded-lg px-3 py-2"
          />
        </div>

        <input
          type="text"
          placeholder="Image URL (optional)"
          value={form.image_url}
          onChange={(e) => setForm({ ...form, image_url: e.target.value })}
          className="w-full border rounded-lg px-3 py-2"
        />

        <select
          value={form.category_id}
          onChange={(e) => setForm({ ...form, category_id: e.target.value })}
          className="w-full border rounded-lg px-3 py-2"
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            {editingId ? 'Update Product' : 'Add Product'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="border px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="space-y-2">
        {products.map((product) => (
          <div key={product.id} className="flex justify-between items-center border rounded-lg p-3">
            <div>
              <p className="font-medium">{product.name}</p>
              <p className="text-sm text-gray-500">৳{product.price} · {product.stock} in stock</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => startEdit(product)} className="text-blue-600 text-sm hover:underline">
                Edit
              </button>
              <button onClick={() => handleDelete(product.id)} className="text-red-500 text-sm hover:underline">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductManager