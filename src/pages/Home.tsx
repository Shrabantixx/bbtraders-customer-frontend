import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Category, Product } from '../types'
import { Link } from 'react-router-dom'

function Home() {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('id, name')

      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('id, name, description, price, stock, image_url, category_id')
        .limit(8)

      if (categoryError) console.error('Category fetch failed:', categoryError.message)
      if (productError) console.error('Product fetch failed:', productError.message)

      if (categoryData) setCategories(categoryData)
      if (productData) setProducts(productData)
      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) {
    return <p className="p-6 text-gray-500">Loading...</p>
  }

  return (
    <div className="p-6">
      <section className="bg-green-600 text-white rounded-lg p-8 mb-8">
        <h1 className="text-3xl font-bold">Welcome to BB Traders Clone</h1>
        <p className="mt-2 text-green-100">Quality products, delivered fast.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white border rounded-lg p-4 text-center hover:shadow-md cursor-pointer transition"
            >
              {cat.name}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Featured Products</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="bg-white border rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="bg-gray-100 h-32 rounded mb-2 flex items-center justify-center text-gray-400">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="h-full object-cover" />
                ) : (
                  'No image'
                )}
              </div>
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-green-600 font-semibold">৳{product.price}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home