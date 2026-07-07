import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ToastProvider } from './components/Toast'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import OrderList from './pages/OrderList'
import OrderCreate from './pages/OrderCreate'
import OrderDetail from './pages/OrderDetail'
import ProductList from './pages/ProductList'
import ProductCreate from './pages/ProductCreate'
import ProductDetail from './pages/ProductDetail'
import Layout from './components/Layout'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()

  console.log('ProtectedRoute - user:', user, 'isLoading:', isLoading)

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    console.log('ProtectedRoute - No user, redirecting to login')
    return <Navigate to="/login" replace />
  }

  console.log('ProtectedRoute - User authenticated, rendering children')
  return <>{children}</>
}

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="orders" element={<OrderList />} />
              <Route path="orders/create" element={<OrderCreate />} />
              <Route path="orders/:id" element={<OrderDetail />} />
              <Route path="products" element={<ProductList />} />
              <Route path="products/create" element={<ProductCreate />} />
              <Route path="products/:id" element={<ProductDetail />} />
            </Route>
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App