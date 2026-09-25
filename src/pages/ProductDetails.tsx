
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import type { Product } from '../types'
import { useCart } from '../context/CartContext'

function ProductDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [ added, setAdded ] = useState(false)
  const { addToCart } = useCart()

  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, description, price, stock, image_url, category_id')
        .eq('id', id)
        .single()

      if (error) console.error('Product fetch failed:', error.message)
      if (data) setProduct(data)
      setLoading(false)
    }

    fetchProduct()
  }, [id])

  function handleAddToCart() {
    if (!product) return
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  if (loading) return <p className="p-6 text-gray-500">Loading...</p>
  if (!product) return <p className="p-6 text-red-500">Product not found.</p>

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Link to="/" className="text-green-600 hover:underline text-sm">← Back to Home</Link>

      <div className="grid sm:grid-cols-2 gap-8 mt-4">
        <div className="bg-gray-100 h-80 rounded-lg flex items-center justify-center text-gray-400">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="h-full object-cover rounded-lg" />
          ) : (
            'No image'
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-2xl text-green-600 font-semibold mt-2">৳{product.price}</p>
          <p className="text-gray-600 mt-4">{product.description || 'No description available.'}</p>
          <p className="text-sm text-gray-500 mt-2">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>

          <button 
            onClick={handleAddToCart}
            disabled={added}
            className={`mt-6 px-6 py-3 rounded-lg font-medium transition ${
                added
                    ? 'bg-green-800 text-white cursor-default'
                    : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {added ? '✓ Added to Cart' : 'Add to Cart'}
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails