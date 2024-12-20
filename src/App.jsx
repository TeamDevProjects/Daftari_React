import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useUser } from './Context/userContext'

import {
  HomeLayout,
  User,
  SignUp,
  SignIn,
  Clients,
  Suppliers,
  SuppliersTransactions,
  ClientsTransactions,
  SuppliersPaymentDates,
  ClientsPaymentDates,
  Error,
} from './Pages'

import { action as SignInAction } from './Pages/SignIn'
import { loader as LoaderSuppliers } from './Pages/Suppliers'
import { loader as LoaderClients } from './Pages/Clients'
/* actions */
import { action as ActionClients } from './Pages/Clients'
import { action as ActionSuppliers } from './Pages/Suppliers'
import authService from './Services/authService'
import { useEffect, useState, useCallback, useContext } from 'react'
import { ErrorElement } from './components'
import NetworkContext from './Context/NetworkContext'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
})

function App() {
  const { user } = useUser()

  const [isUserLogin, setIsUserLogin] = useState(
    authService.getIsLogin() || false
  )

  const checkIsLogin = useCallback(() => {
    const isLogin = authService.getIsLogin()
    setIsUserLogin(isLogin ?? false)
  }, [])

  // Listen for changes to `localStorage` (e.g., on logout)
  useEffect(() => {
    checkIsLogin() // Initial check

    const handleStorageChange = () => {
      checkIsLogin() // Re-check login status
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [checkIsLogin, user])

  const router = createBrowserRouter([
    {
      path: '/',
      index: true,
      element: isUserLogin ? <Navigate to="/user" replace /> : <SignIn />,
      action: SignInAction,
    },
    {
      path: '/signUp',
      element: <SignUp />,
    },
    {
      path: '/',
      element: <HomeLayout />,
      errorElement: <Error />,
      children: [
        {
          path: '/user',
          element: <User />,
          errorElement: <ErrorElement />,
        },
        {
          path: 'Clients',
          element: <Clients />,
          errorElement: <ErrorElement />,
          loader: LoaderClients,
          action: ActionClients,
        },
        {
          path: 'Clients/ClientsTransactions/:clientId',
          element: <ClientsTransactions />,
          errorElement: <ErrorElement />,
        },
        {
          path: 'Clients/ClientsPaymentDates',
          element: <ClientsPaymentDates />,
          errorElement: <ErrorElement />,
        },

        {
          path: 'Suppliers',
          element: <Suppliers />,
          errorElement: <ErrorElement />,
          loader: LoaderSuppliers,
          action: ActionSuppliers,
        },
        {
          path: 'Suppliers/SuppliersTransactions/:supplierId',
          element: <SuppliersTransactions />,
          errorElement: <ErrorElement />,
        },
        {
          path: 'Suppliers/SuppliersPaymentDates',
          element: <SuppliersPaymentDates />,
          errorElement: <ErrorElement />,
        },
      ],
    },
  ])

  const { isConnected } = useContext(NetworkContext)

  if (!isConnected) return <p className='flex center'>No internet connection</p>
  
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
