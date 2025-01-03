import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

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
import { loader as LoaderSuppliersPaymentDates } from './Pages/SuppliersPaymentDates'
import { loader as LoaderClientsPaymentDates } from './Pages/ClientsPaymentDates'
import { loader as LoaderUser } from './Pages/User'
import { loader as LoaderClientsTransactions } from './Pages/ClientsTransactions'

import authService from './Services/authService'
import { useEffect, useState, useCallback } from 'react'
import { ErrorElement } from './components/Common'
// import NoWifi from './components/Common/NoWifi'
// import NetworkContext from './Context/NetworkContext'
// import NetworkContext from './Context/NetworkContext'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
})

function App() {
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
  }, [checkIsLogin])

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
          loader: LoaderUser(queryClient),
          errorElement: <ErrorElement />,
        },
        {
          path: 'Clients',
          element: <Clients />,
          errorElement: <ErrorElement />,
          loader: LoaderClients(queryClient),
        },
        {
          path: 'Clients/ClientsTransactions/:clientId',
          element: <ClientsTransactions />,
          loader: LoaderClientsTransactions,
          errorElement: <ErrorElement />,
        },
        {
          path: 'Clients/ClientsPaymentDates',
          element: <ClientsPaymentDates />,
          loader: LoaderClientsPaymentDates(queryClient),
          errorElement: <ErrorElement />,
        },

        {
          path: 'Suppliers',
          element: <Suppliers />,
          errorElement: <ErrorElement />,
          loader: LoaderSuppliers(queryClient),
        },
        {
          path: 'Suppliers/SuppliersTransactions/:supplierId',
          element: <SuppliersTransactions />,
          errorElement: <ErrorElement />,
        },
        {
          path: 'Suppliers/SuppliersPaymentDates',
          element: <SuppliersPaymentDates />,
          loader: LoaderSuppliersPaymentDates(queryClient),
          errorElement: <ErrorElement />,
        },
      ],
    },
  ])

  // const { isConnected } = useContext(NetworkContext)

  // if (!isConnected) return <NoWifi text="No internet connection"/>

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
