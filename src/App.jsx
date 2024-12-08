import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { UserProvider } from './Context/userContext'

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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
})

import { action as SignInAction } from './Pages/SignIn'
import { loader as LoaderSuppliers } from './Pages/Suppliers'
import { loader as LoaderClients } from './Pages/Clients'
import authService from './Services/authService'

const checkIsLogin = () => {
  const isLogin = authService.getIsLogin()
  if (isLogin == null) {
    return false
  }

  return isLogin
}
const router = createBrowserRouter([
  {
    path: '/',
    index: true,
    element: checkIsLogin() ? <Navigate to="/user" /> : <SignIn />,
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
      },
      {
        path: 'Clients',
        element: <Clients />,
        loader: LoaderClients,

        children: [
          { path: 'ClientsTransactions', element: <ClientsTransactions /> },
          { path: 'ClientsPaymentDates', element: <ClientsPaymentDates /> },
        ],
      },
      {
        path: 'Suppliers',
        element: <Suppliers />,
        loader: LoaderSuppliers,
        children: [
          {
            path: 'SuppliersTransactions',
            element: <SuppliersTransactions />,
          },
          {
            path: 'SuppliersPaymentDates',
            element: <SuppliersPaymentDates />,
          },
        ],
      },
    ],
  },
])

function App() {
  return (
    <UserProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </UserProvider>
  )
}

export default App
