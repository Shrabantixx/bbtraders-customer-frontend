import { useEffect, useState } from 'react'
import { apiGet, apiPost, apiDelete } from '../../lib/apiClient'
import type { Category } from '../../types'

function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([])
  const [newName, setNewName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadCategories() {
    try {
      const data = await apiGet('/categories')
      setCategories(data)
    } catch (err) {
      console.error(err)
      setError('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetching data on mount, not a synchronous setState
    loadCategories()
  }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return
    try {
      await apiPost('/categories', { name: newName })
      setNewName('')
      loadCategories()
    } catch (err) {
      console.error(err)
      setError('Failed to add category')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this category?')) return
    try {
      await apiDelete(`/categories/${id}`)
      loadCategories()
    } catch (err) {
      console.error(err)
      setError('Failed to delete category')
    }
  }

  if (loading) return <p className="p-6 text-gray-500">Loading...</p>

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Categories</h1>

      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New category name"
          className="flex-1 border rounded-lg px-3 py-2"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Add
        </button>
      </form>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="space-y-2">
        {categories.map((cat) => (
          <div key={cat.id} className="flex justify-between items-center border rounded-lg p-3">
            <span>{cat.name}</span>
            <button
              onClick={() => handleDelete(cat.id)}
              className="text-red-500 text-sm hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoryManager