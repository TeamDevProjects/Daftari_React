import { Link, useLoaderData } from 'react-router-dom'
import { Modal, SearchForm } from '../components'
import {
  handelDateFormate,
  handelDateTimeFormate,
} from '../assets/Utilities/date'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import AddEditPersonForm from '../components/Forms/AddEditPersonForm'
import { MdDelete, MdOutlineSettingsInputComponent } from 'react-icons/md'
import { FaUserEdit } from 'react-icons/fa'
import PdfReportGenerator from '../components/Reports/PdfReportGenerator'
import { CiCalendarDate } from 'react-icons/ci'
import { IoIosAdd } from 'react-icons/io'
import { ReportPeopleColumns } from '../Constants/ReportColumns'
import { PeopleColumns } from '../Constants/TablesColumns'
import PdfFilteredReportGenerator from '../components/Reports/pdfFilteredReportGenerator'
import { LuDollarSign } from 'react-icons/lu'
import FilterPersonForm from '../components/Forms/FilterPersonForm'
import SupplierServices from '../Services/supplier'
import NoContent from '../components/NoContent'

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async () => {
  const accessToken = localStorage.getItem('accessToken')
  if (!accessToken) {
    throw new Response('Unauthorized', { status: 401 })
  }

  try {
    const results = await SupplierServices.GetAll()

    return { suppliers: results } // Returning suppliers data from API
  } catch {
    throw new Response('Failed to fetch suppliers')
  }
}

// eslint-disable-next-line react-refresh/only-export-components
export const action = async ({ request }) => {
  try {
    const formData = await request.formData()
    const data = Object.fromEntries(formData)

    const method = request.method

    if (method === 'post') {
      // Handle the 'add' operation
      const createdItem = await SupplierServices.Add(data) // Replace with your actual logic
    } else if (method === 'put') {
      // Handle the 'update' operation
      const updatedItem = await SupplierServices.Update(data, 1) // Replace with your actual logic
    } else {
      return { status: 405, message: 'Method not allowed' }
    }
  } catch (error) {
    console.error('Error in action function:', error)
    return { status: 500, message: 'An error occurred', error: error.message }
  }
}

const Suppliers = () => {
  const { suppliers } = useLoaderData()
  const [suppliersState, setSuppliers] = useState(suppliers)

  const [isModalOpen, setModalOpen] = useState(false)
  const [totalPayment, setTotalPayment] = useState(0)

  const [totalWithdraw, setTotalWithdraw] = useState(0)

  const [mode, setMode] = useState('Add')
  const [method, setMethod] = useState('post')
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Function to handle searching suppliers by name
  const handleSearch = async (query) => {
    if (!query) {
      setSuppliers(suppliers) // Reset to the original list when the query is empty
      return
    }

    try {
      setIsLoading(true)
      const results = await SupplierServices.SearchByName(query) // Call API to search by name
      setSuppliers(results)
      setIsLoading(false)
    } catch (error) {
      console.error('Error searching suppliers:', error)
      toast.error('Failed to search suppliers.')
      setIsLoading(false)
    }
  }

  const handelAddSupplierModal = () => {
    setMode('Add')
    setMethod('post')
    handleOpenModal()
  }

  const handelUpdateSupplierModal = () => {
    setMode('Update')
    setMethod('put')
    handleOpenModal()
  }

  const handleOpenModal = () => {
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
  }

  const handelOpenFilterModel = () => {
    setIsFilterModalOpen(true)
  }

  const handelCloseFilterModel = () => {
    setIsFilterModalOpen(false)
  }

  const handelSubmitFilter = async (filterBy) => {
    console.log(filterBy)
    // getall orderbyname & reset clients by orderbyname

    if (filterBy == 'orderByName') {
      const results = await SupplierServices.GetAllOrderByName()
      console.log(results)
      if (Array.isArray(results) && results.length > 0) {
        setSuppliers(results)
        console.log('filtering')
      }
    } else if (filterBy == 'default') {
      setSuppliers(suppliers)
    }
  }
  const handleSubmit = async (supplier) => {
    try {
      if (mode === 'Add') {
        const newSupplier = await SupplierServices.Add(supplier)
        setSuppliers((prevSuppliers) => [...prevSuppliers, newSupplier])
        toast.success('Supplier Added Successfully')
      } else if (mode === 'Update') {
        const updatedSupplier = await SupplierServices.Update(supplier)
        setSuppliers((prevSuppliers) =>
          prevSuppliers.map((c) =>
            c.supplierId === updatedSupplier.supplierId ? updatedSupplier : c
          )
        )
        toast.success('Supplier Updated Successfully')
      }
      setModalOpen(false)
    } catch (error) {
      console.error('Error saving Supplier:', error)
      toast.error('Failed to save Supplier.')
    }
  }

  const handleDeleteSupplier = async (supplierId) => {
    try {
      await SupplierServices.Delete(supplierId)
      setSuppliers((prevSuppliers) =>
        prevSuppliers.filter((supplier) => supplier.clientId !== supplierId)
      )
      toast.success('Supplier deleted successfully.')
    } catch (error) {
      console.error('Error deleting Supplier:', error)
      toast.error('Failed to delete Supplier.')
    }
  }

  const ReportRows = suppliers.map((r) => [
    r.supplierId || '-', // ID
    r.name || '-', // Name
    r.country || '-', // Country
    r.city || '-', // City
    r.address || '-', // Address
    r.phone || '-', // Phone
    handelDateFormate(r.dateOfPayment) || '-', // Payment Date
    r.totalAmount ? `$${r.totalAmount.toFixed(2)}` : '-', // Amount, formatted as currency
    r.paymentMethodName || '-', // Payment Method
  ])

  const ReportFilterRows = suppliersState.map((r) => [
    r.supplierId || '-', // ID
    r.name || '-', // Name
    r.country || '-', // Country
    r.city || '-', // City
    r.address || '-', // Address
    r.phone || '-', // Phone
    handelDateFormate(r.dateOfPayment) || '-', // Payment Date
    r.totalAmount ? `$${r.totalAmount.toFixed(2)}` : '-', // Amount, formatted as currency
    r.paymentMethodName || '-', // Payment Method
  ])

  useEffect(() => {
    const calculateTotals = () => {
      if (!suppliers) return

      const totalPaymentResult = suppliers.reduce(
        (total, supplier) =>
          supplier.totalAmount >= 0 ? total + supplier.totalAmount : total,
        0
      )

      const totalWithdrawResult = suppliers.reduce(
        (total, supplier) =>
          supplier.totalAmount < 0 ? total + supplier.totalAmount : total,
        0
      )

      setTotalPayment(totalPaymentResult)
      setTotalWithdraw(totalWithdrawResult)
    }

    calculateTotals()
    setIsLoading(false)
  }, [])

  // Render suppliers if data is available

  if (isLoading) {
    return <p>Loading...</p>
  }

  return (
    <>
      {/* ==[ Add / Edit Suppliers]== */}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <AddEditPersonForm
          onSubmit={handleSubmit}
          title={'Supplier'}
          buttonText={'Supplier'}
          mode={mode}
          method={method}
        />
      </Modal>

      {/* == [ Filter Clients]== */}
      <Modal isOpen={isFilterModalOpen} onClose={handelCloseFilterModel}>
        <FilterPersonForm
          title={'Suppliers Ordering'}
          onSubmit={handelSubmitFilter}
        />
      </Modal>

      <div className="page-section">
        <div className="flex center amount-container">
          <div className="red-box">
            <span className="amount-message">For Me</span>
            <div className="amount red">
              <LuDollarSign />
              <span className="red">{totalWithdraw || '00'}</span>
            </div>
          </div>
          <div className="line"></div>
          <div className="green-box">
            <span className="amount-message">To Me</span>
            <div className="amount green">
              <LuDollarSign />
              <span className="">{totalPayment || '00'}</span>
            </div>
          </div>
        </div>
        <div className="flex center mb-1">
          <PdfReportGenerator
            title={`Supplier Report`}
            subtitle={`Generated on: ${handelDateTimeFormate(new Date())}`}
            columns={ReportPeopleColumns}
            rows={ReportRows}
            footer={'Generated by Daftari Management System'}
          />
          <Link to="SuppliersPaymentDates">
            <button className="btn btn-paymentdate">
              <CiCalendarDate />
              <span>Payment Dates</span>
            </button>
          </Link>
        </div>
      </div>
      <div className="page-section">
        <div className="flex">
          <PdfFilteredReportGenerator
            title={`Supplier Report`}
            subtitle={`Generated on: ${handelDateTimeFormate(new Date())}`}
            columns={ReportPeopleColumns}
            rows={ReportFilterRows}
            footer={'Generated by Daftari Management System'}
          />
          <div className="btn btn-add" onClick={handelOpenFilterModel}>
            <MdOutlineSettingsInputComponent />
          </div>
          <button className="btn btn-add" onClick={handelAddSupplierModal}>
            <IoIosAdd />
            <span>Add Supplier</span>
          </button>
          <div className="" style={{ flex: 4 }}>
            <SearchForm onSubmit={handleSearch} />
          </div>
        </div>
        <div className="table-wrapper">
          {suppliersState && suppliersState.length > 0 && (
            <table border="1" style={{ width: '100%', textAlign: 'left' }}>
              <thead>
                <tr>
                  {PeopleColumns.map((col, index) => (
                    <th key={index}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {suppliersState.map((supplier) => (
                  <tr key={supplier.supplierId || '-'}>
                    <td>{supplier.supplierId || '-'}</td>
                    <td>
                      <Link to={`SuppliersTransactions/${supplier.supplierId}`}>
                        {supplier.name || '-'}
                      </Link>
                    </td>
                    <td>{supplier.country || '-'}</td>
                    <td>{supplier.city || '-'}</td>
                    <td>{supplier.address || '-'}</td>
                    <td>{supplier.phone || '-'}</td>
                    <td>{handelDateFormate(supplier.dateOfPayment) || '-'}</td>
                    <td>{supplier.totalAmount || '-'}</td>
                    <td>{supplier.paymentMethodName || '-'}</td>
                    {/* <td>{supplier.notes || '-'}</td> */}
                    <td>
                      <div className="flex">
                        <button
                          /* onClick={} */
                          style={{
                            marginRight: '5px',
                            backgroundColor: '#00b894',
                            color: 'white',
                            border: 'none',
                            padding: '5px 10px',
                          }}
                          onClick={handelUpdateSupplierModal}
                        >
                          <FaUserEdit />
                        </button>
                        <button
                          style={{
                            backgroundColor: '#d63031',
                            color: 'white',
                            border: 'none',
                            padding: '5px 10px',
                          }}
                          onClick={() =>
                            handleDeleteSupplier(supplier.supplierId)
                          }
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {suppliersState.length == 0 && <NoContent text="No Suppliers found." />}
      </div>
    </>
  )
}

export default Suppliers
