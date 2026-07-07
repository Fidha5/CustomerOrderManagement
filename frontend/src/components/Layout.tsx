import { useState } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Breadcrumbs from './Breadcrumbs'

function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden p-2 rounded-md hover:bg-gray-100"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Customer Order Management</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="text-xs sm:text-sm text-gray-600 hidden sm:block">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className={`${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0 fixed sm:static z-50 w-64 bg-white border-r border-gray-200 min-h-screen transition-transform duration-300 ease-in-out`}>
          <nav className="p-4 space-y-2">
            <Link
              to="/"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                isActive('/') ? 'bg-primary-light text-primary' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </Link>

            <Link
              to="/orders"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                isActive('/orders') || isActive('/orders/create') || isActive('/orders/')
                  ? 'bg-primary-light text-primary'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Orders
            </Link>

            <Link
              to="/products"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                isActive('/products') || isActive('/products/create') || isActive('/products/')
                  ? 'bg-primary-light text-primary'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7l8-4m0 10L4 17" />
              </svg>
              Products
            </Link>

            {/* Mobile-only close button */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="sm:hidden flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 w-full"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Close Menu
            </button>

            {/* Future navigation items */}
            {/* <Link
              to="/customers"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                isActive('/customers') ? 'bg-primary-light text-primary' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Customers
            </Link>

            <Link
              to="/products"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                isActive('/products') ? 'bg-primary-light text-primary' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7l8-4m0 10L4 17" />
              </svg>
              Products
            </Link> */}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Breadcrumbs />
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout