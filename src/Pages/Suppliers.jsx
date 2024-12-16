import { Link, useLoaderData } from 'react-router-dom'
import { Modal, SearchForm } from '../components'
import {
  handelDateFormate,
  handelDateTimeFormate,
} from '../assets/Utilities/date'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import AddEditPersonForm from '../components/Forms/AddEditPersonForm'
import SupplierServices from '../Services/supplier'
import { MdDelete, MdOutlineSettingsInputComponent } from 'react-icons/md'
import { FaUserEdit } from 'react-icons/fa'
import PdfReportGenerator from '../components/Reports/PdfReportGenerator'
import { CiCalendarDate } from 'react-icons/ci'
import { IoIosAdd } from 'react-icons/io'
import { ReportPeopleColumns } from '../Constants/ReportColumns'
import { PeopleColumns } from '../Constants/TablesColumns'
import PdfFilteredReportGenerator from '../components/Reports/pdfFilteredReportGenerator'
import { LuDollarSign } from 'react-icons/lu'

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async () => {
  const accessToken = localStorage.getItem('accessToken')
  if (!accessToken) {
    throw new Response('Unauthorized', { status: 401 })
  }

  try {
    const results = await supplierServices.GetAll()

    return { suppliers: results } // Returning suppliers data from API
  } catch {
    throw new Response('Failed to fetch suppliers')
  }
}

// eslint-disable-next-line react-refresh/only-export-components
export const action = async ({ request }) => {
  const formData = await request.formData()
  const data = Object.fromEntries(formData)
}

const Suppliers = () => {
  const { suppliers } = useLoaderData()
  const [isModalOpen, setModalOpen] = useState(false)
  const [totalPayment, setTotalPayment] = useState(0)

  const [totalWidthdrol, setTotalWidthdrol] = useState(0)

  const [mode, setMode] = useState('Add')
  const [method, setMethod] = useState('post')

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

  const handleSubmit = (supplier) => {
    if (mode == 'Add') {
      console.log('Add Supplier', supplier)
      toast.success('Supplier Added Successfully')
      return
    }
    // Update
    console.log('Edit Supplier', supplier)
    toast.success('Supplier Updated Successfully')
    setModalOpen(false)
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
  useEffect(() => {
    if (!suppliers) return
    let totalwidthdrolResult = 0
    let totalPaymentResult = 0
    const totalPaymentArr = suppliers.filter((c) => c.totalAmount >= 0)

    if (totalPaymentArr.length > 0) {
      totalPaymentResult = totalPaymentArr.reduce(
        (prev, curr) => prev.totalAmount + curr.totalAmount
      )
    }

    setTotalPayment(totalPaymentResult)

    const TotalWidthdrolArr = suppliers.filter((c) => c.totalAmount < 0)

    if (TotalWidthdrolArr.length > 0) {
      totalwidthdrolResult = TotalWidthdrolArr.reduce(
        (prev, curr) => prev.totalAmount + curr.totalAmount
      )
      setTotalWidthdrol(totalwidthdrolResult)
    }
  }, [])
  console.log(suppliers)
  // Render suppliers if data is available
  return (
    <>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <AddEditPersonForm
          onSubmit={handleSubmit}
          title={'Supplier'}
          buttonText={'Supplier'}
          mode={mode}
          method={method}
        />
      </Modal>

      <div className="page-section">
        <div className="flex center amount-container">
          <div className="red-box">
            <span className="amount-message">For Me</span>
            <div className="amount red">
              <LuDollarSign />
              <span className="red">{totalWidthdrol || '00'}</span>
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
          <button className="btn btn-paymentdate">
            <CiCalendarDate />
            <Link to="SuppliersPaymentDates">Payment Dates</Link>
          </button>
        </div>
      </div>
      <div className="page-section">
        <div className="flex">
          <PdfFilteredReportGenerator
            title={`Supplier Report`}
            subtitle={`Generated on: ${handelDateTimeFormate(new Date())}`}
            columns={ReportPeopleColumns}
            rows={ReportRows}
            footer={'Generated by Daftari Management System'}
          />
          <div className="btn btn-add">
            <MdOutlineSettingsInputComponent />
          </div>
          <button className="btn btn-add" onClick={handelAddSupplierModal}>
            <IoIosAdd />
            <span>Add Supplier</span>
          </button>
          <div className="" style={{ flex: 4 }}>
            <SearchForm />
          </div>
        </div>
        <div className="table-wrapper">
          {suppliers && suppliers.length > 0 ? (
            <table border="1" style={{ width: '100%', textAlign: 'left' }}>
              <thead>
                <tr>
                  {PeopleColumns.map((col, index) => (
                    <th key={index}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {suppliers.map((supplier) => (
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
                          onClick={() =>
                            SupplierServices.Delete(supplier.supplierId)
                          }
                          style={{
                            backgroundColor: '#d63031',
                            color: 'white',
                            border: 'none',
                            padding: '5px 10px',
                          }}
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No Suppliers found.</p>
          )}
        </div>
      </div>
    </>
  )
}

export default Suppliers
