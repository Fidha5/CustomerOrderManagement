import { Link, useLocation } from 'react-router-dom'

interface BreadcrumbItem {
  label: string
  path: string
}

function Breadcrumbs() {
  const location = useLocation()

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const pathnames = location.pathname.split('/').filter(Boolean)

    if (pathnames.length === 0) {
      return [{ label: 'Dashboard', path: '/' }]
    }

    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Dashboard', path: '/' }
    ]

    let currentPath = ''

    // Handle Orders routes
    if (pathnames[0] === 'orders') {
      currentPath = '/orders'
      breadcrumbs.push({ label: 'Orders', path: currentPath })

      if (pathnames[1] === 'create') {
        currentPath = '/orders/create'
        breadcrumbs.push({ label: 'Create Order', path: currentPath })
      } else if (pathnames[1]) {
        // It's an order detail page
        currentPath = '/orders/' + pathnames[1]
        breadcrumbs.push({ label: 'Order Details', path: currentPath })
      }
    }

    // Handle Customers routes (future)
    else if (pathnames[0] === 'customers') {
      currentPath = '/customers'
      breadcrumbs.push({ label: 'Customers', path: currentPath })

      if (pathnames[1]) {
        currentPath = '/customers/' + pathnames[1]
        breadcrumbs.push({ label: 'Customer Details', path: currentPath })
      }
    }

    // Handle Products routes (future)
    else if (pathnames[0] === 'products') {
      currentPath = '/products'
      breadcrumbs.push({ label: 'Products', path: currentPath })

      if (pathnames[1]) {
        currentPath = '/products/' + pathnames[1]
        breadcrumbs.push({ label: 'Product Details', path: currentPath })
      }
    }

    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs()

  if (breadcrumbs.length <= 1) {
    return null // Don't show breadcrumbs on dashboard
  }

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={breadcrumb.path} className="flex items-center gap-2">
          {index > 0 && (
            <span className="text-gray-400">/</span>
          )}
          {index === breadcrumbs.length - 1 ? (
            <span className="font-medium text-gray-900">{breadcrumb.label}</span>
          ) : (
            <Link
              to={breadcrumb.path}
              className="hover:text-primary transition-colors"
            >
              {breadcrumb.label}
            </Link>
          )}
        </div>
      ))}
    </div>
  )
}

export default Breadcrumbs