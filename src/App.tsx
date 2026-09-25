import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import TrackOrder from './pages/TrackOrder'
import Login from './pages/Login'
import Register from './pages/Register'
import OrderHistory from './pages/OrderHistory'
import ContactUs from './pages/ContactUs'
import BecomeSeller from './pages/BecomeSeller'
import AdminRoute from './components/AdminRoute'
import CategoryManager from './pages/admin/CategoryManager'
import ProductManager from './pages/admin/ProductManager'
import OrderManager from './pages/admin/OrderManager'
import AdminHome from './pages/admin/AdminHome'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="product/:id" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="order-confirmation/:id" element={<OrderConfirmation />} />
        <Route path="track-order" element={<TrackOrder />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="orders" element={<OrderHistory />} />
        <Route path="contact" element={<ContactUs />} />
        <Route path="become-seller" element={<BecomeSeller />} />
        <Route
           path="admin/categories"
           element={
                  <AdminRoute>
                   <CategoryManager />
                  </AdminRoute>
                 }
          />
      
      </Route>
      <Route
         path="admin/products"
         element={
       <AdminRoute>
       <ProductManager />
       </AdminRoute>
       }
     />
     <Route
        path="admin/orders"
        element={
       <AdminRoute>
      <OrderManager />
      </AdminRoute>
      }
     />
     <Route
       path="admin"
       element={
      <AdminRoute>
      <AdminHome />
     </AdminRoute>
     }
    />
    </Routes>
  )
}

export default App