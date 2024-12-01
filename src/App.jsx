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
ClientsPaymentDates 
} from "./Pages"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
})

const router = createBrowserRouter([
  {
    path: "/Home",
    element: <Home/>,
    errorElement: ,
    children: [
      {
        index: true,
        element:,
        errorElement: ,
        loader: ,
      },
      {
        path: ,
        errorElement: ,
        loader: ,
        element: ,
      },
      {
        path: ,
        element: ,
        action: ,
        errorElement: ,
      },
      {
        path: ,
        element: ,
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
