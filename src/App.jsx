import { RouterProvider, createBrowserRouter } from 'react-router-dom'
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

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      {
        path: '/',
        index: true,
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
  {
    path: '/signup',
    element: <SignUp />,
  },
  {
    path: '/signin',
    element: <SignIn />,
    action: SignInAction,
  },
])

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
