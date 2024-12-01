import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
  Home,
  Login,
  SignUp,
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

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <Error />,
    children: [
      {
        path: '/Clients',
        element: <Clients />,
        children: [
          { path: '/ClientsTransactions', element: <ClientsTransactions /> },
          { path: '/ClientsPaymentDates', element: <ClientsPaymentDates /> },
        ],
      },
      {
        path: '/Suppliers',
        element: <Suppliers />,
        children: [
          {
            path: '/SuppliersTransactions',
            element: <SuppliersTransactions />,
          },
          {
            path: '/SuppliersPaymentDates',
            element: <SuppliersPaymentDates />,
          },
        ],
      },
    ],
  },
])

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />;
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
