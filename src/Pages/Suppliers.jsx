import { useLoaderData } from 'react-router-dom'
import { Modal, SearchForm } from '../components'
import { handelDateTimeFormate } from '../assets/Utilities/date'
import { useState } from 'react'
import { toast } from 'react-toastify'
import AddEditPersonForm from '../components/Forms/AddEditPersonForm'
import supplierServices from '../Services/supplier'
import { MdDelete } from 'react-icons/md'
import { FaUserEdit } from 'react-icons/fa'

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

const Suppliers = () => {
  const { suppliers } = useLoaderData()
  const [isModalOpen, setModalOpen] = useState(false)

  const [mode, setMode] = useState('Add')

  const handelAddSupplierModal = () => {
    setMode('Add')
    handleOpenModal()
  }

  const handelUpdateSupplierModal = () => {
    setMode('Update')
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

  const columns = [
    'ClientId',
    'Name',
    'Country',
    'City',
    'Address',
    'Phone',
    'Date of payment',
    'Total amount',
    'Payment Method Name',
    /* 'Notes', */
    'Action',
  ]

  // Render suppliers if data is available
  return (
    <>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <AddEditPersonForm
          onSubmit={handleSubmit}
          title={'Supplier'}
          buttonText={'Supplier'}
          mode={mode}
        />
      </Modal>
      <SearchForm />
      <div className="table-wrapper">
        {suppliers && suppliers.length > 0 ? (
          <table border="1" style={{ width: '100%', textAlign: 'left' }}>
            <thead>
              <tr>
                {columns.map((col, index) => (
                  <th key={index}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier) => (
                <tr key={supplier.supplierId || '-'}>
                  <td>{supplier.supplierId || '-'}</td>
                  <td>{supplier.name || '-'}</td>
                  <td>{supplier.country || '-'}</td>
                  <td>{supplier.city || '-'}</td>
                  <td>{supplier.address || '-'}</td>
                  <td>{supplier.phone || '-'}</td>
                  <td>
                    {handelDateTimeFormate(supplier.dateOfPayment) || '-'}
                  </td>
                  <td>{supplier.totalAmount || '-'}</td>
                  <td>{supplier.paymentMethodName || '-'}</td>
                  {/* <td>{supplier.notes || '-'}</td> */}
                  <td>
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
                      /*  onClick={} */
                      style={{
                        backgroundColor: '#d63031',
                        color: 'white',
                        border: 'none',
                        padding: '5px 10px',
                      }}
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No Suppliers found.</p>
        )}
      </div>
      <div className="center">
        <button className="btn" onClick={handelAddSupplierModal}>
          Add Supplier
        </button>
      </div>
    </>
  )
}

export default Suppliers
