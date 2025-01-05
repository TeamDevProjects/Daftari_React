/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react'
import { Link, useLoaderData } from 'react-router-dom'
import { toast } from 'react-toastify'
import { handelDateFormate } from '../assets/Utilities/date'
import supplierImg from '../assets/supplier.png'
import { LuDollarSign } from 'react-icons/lu'
import {
  PdfReportGenerator,
  PdfFilteredReportGenerator,
} from '../components/Reports'
import { CiCalendarDate } from 'react-icons/ci'
import { IoIosAdd } from 'react-icons/io'
import { ReportPeopleColumns } from '../Constants/ReportColumns'
import { PeopleColumns } from '../Constants/TablesColumns'
import { MODE, ORDER_PERSON_BY, UI } from '../Constants/Variables'
import { useUser } from '../Context/userContext'
import SupplierServices from '../Services/supplier'
import { Modal, SearchForm } from '../components/UI'
import { AddEditPersonForm, OrderingPersonForm } from '../components/Forms'
import { SuppliersTable } from '../components/Tables'
import { MdOutlineSettingsInputComponent } from 'react-icons/md'
import { REACT_QUERY_NAME } from '../Constants/Variables'
import { queryClient } from '../App'

const _GotAllSuppliers = async () => {
  try {
    return await SupplierServices.GetAll()
  } catch (error) {
    toast.error(error.message)
    return
  }
}
const SuppliersQuery = {
  queryKey: [REACT_QUERY_NAME.SUPPLIERS],
  queryFn: async () => await _GotAllSuppliers(),
}
const _calcTotal_Got = (clients) => {
  if (!clients || clients.length == 0) return 0

  const total_Got = clients.reduce(
    (total, client) =>
      client.totalAmount >= 0 ? total + client.totalAmount : total,
    0
  )
  return total_Got
}

const _calcTotal_Gave = (clients) => {
  if (!clients || clients.length == 0) return 0

  const total_Gave = clients.reduce(
    (total, client) =>
      client.totalAmount < 0 ? total + client.totalAmount : total,
    0
  )
  return total_Gave
}
// eslint-disable-next-line react-refresh/only-export-components
export const loader = (queryClient) => async () => {
  try {
    const initialSuppliers = await queryClient.ensureQueryData(SuppliersQuery)

    //set default total_GotDate & total_Gave
    const initialTotal_Got = _calcTotal_Got(initialSuppliers)

    const initialTotal_Gave = _calcTotal_Gave(initialSuppliers)

    return { initialSuppliers, initialTotal_Got, initialTotal_Gave }
  } catch {
    throw new Response('Failed to fetch suppliers')
  }
}

const Suppliers = () => {
  const { initialSuppliers, initialTotal_Got, initialTotal_Gave } =
    useLoaderData()

  const [suppliers, setSuppliers] = useState(initialSuppliers)
  const [total_Got, setTotal_Got] = useState(initialTotal_Got || 0)
  const [total_Gave, setTotal_Gave] = useState(initialTotal_Gave || 0)

  const [isModalOpen, setModalOpen] = useState(false)
  const [mode, setMode] = useState(MODE.ADD)

  const [isOrderingModalOpen, setIsOrderingModalOpen] = useState(false)
  const [currentPerson, setCurrentPerson] = useState(null)

  const { user } = useUser()

  // ==============[ Privet Methods ]==================
  const _refreshTotal_Got = (newClients) => {
    if (!newClients) return

    const total_GotResult = _calcTotal_Got(newClients)

    setTotal_Got(total_GotResult)
  }

  const _refreshTotal_Gave = (newClients) => {
    if (!newClients) return

    const total_GaveResult = _calcTotal_Gave(newClients)

    setTotal_Gave(total_GaveResult)
  }

  const _refresh = async () => {
    // Refresh
    _refreshTotal_Got(suppliers)
    _refreshTotal_Gave(suppliers)
  }

  const _addSupplier = async (supplier) => {
    try {
      const newSupplier = await SupplierServices.Add(supplier)
      setSuppliers((prevSuppliers) => [...prevSuppliers, newSupplier])

      toast.success('New Supplier Added Successfully')
    } catch (error) {
      toast.error(error?.message)
    }
  }

  const _updateSupplier = async (supplier) => {
    try {
      await SupplierServices.Update(supplier, currentPerson?.supplierId)

      setSuppliers((prevSuppliers) =>
        prevSuppliers.map((c) =>
          c.supplierId === currentPerson.supplierId
            ? { ...c, ...supplier, supplierId: currentPerson?.supplierId }
            : c
        )
      )
      console.log(supplier)
      toast.success('Supplier Updated Successfully')
    } catch (error) {
      toast.error(error?.message)
    }
  }

  // ================[ Handel UI ]=====================
  const handelAddSupplierModal = () => {
    setMode(MODE.ADD)
    handleOpenModal()
  }

  const handelUpdateSupplierModal = (person) => {
    setMode(MODE.UPDATE)
    setCurrentPerson(person)
    handleOpenModal()
  }

  const handleOpenModal = () => {
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
  }

  const handelOpenOrderingModel = () => {
    setIsOrderingModalOpen(true)
  }

  const handelCloseOrderingModel = () => {
    setIsOrderingModalOpen(false)
  }

  // ==============[ Action Methods ]==================

  // Function to handle searching suppliers by name or phone
  const handleSearch = async (temp) => {
    try {
      if (!temp || temp == '') {
        setSuppliers(initialSuppliers)
        return
      }

      const results = await SupplierServices.SearchByName(temp) // Call API to search by name
      setSuppliers(results)
    } catch {
      setSuppliers([])
    }
  }

  const handelSubmitOrdering = async (orderBy) => {
    console.log(orderBy)
    let results

    switch (orderBy) {
      case ORDER_PERSON_BY.DEFAULT:
        setSuppliers(initialSuppliers)
        break
      case ORDER_PERSON_BY.NAME:
        results = await SupplierServices.GetAllOrderByName()
        setSuppliers(results)
        break

      case ORDER_PERSON_BY.CLOSER_PAYMENT_DATES:
        results = await SupplierServices.GetAllOrderByCloserPaymentDates()
        setSuppliers(results)
        break

      case ORDER_PERSON_BY.OLDER_PAYMENT_DATES:
        results = await SupplierServices.GetAllOrderByOldPaymentDates()
        setSuppliers(results)
        break

      case ORDER_PERSON_BY.LARGEST_AMOUNT:
        results = await SupplierServices.GetAllOrderByLargestTotalAmount()
        setSuppliers(results)
        break

      case ORDER_PERSON_BY.SMALLEST_AMOUNT:
        results = await SupplierServices.GetAllOrderBySmallestTotalAmount()
        setSuppliers(results)
        break

      default:
        setSuppliers(initialSuppliers)
        break
    }

    queryClient.removeQueries(REACT_QUERY_NAME.CLIENTS)
  }

  const handleSubmit = async (supplier) => {
    if (mode === MODE.ADD) {
      await _addSupplier(supplier)
    } else if (mode === MODE.UPDATE) {
      await _updateSupplier(supplier)
    }
    // Refresh
    await _refresh()

    setModalOpen(false)
    queryClient.removeQueries(REACT_QUERY_NAME.SUPPLIERS)
  }

  const handleDeleteSupplier = async (supplierId) => {
    try {
      await SupplierServices.Delete(supplierId)

      setSuppliers((prevSuppliers) =>
        prevSuppliers.filter((supplier) => supplier.supplierId !== supplierId)
      )

      // Refresh
      await _refresh()
      queryClient.removeQueries(REACT_QUERY_NAME.SUPPLIERS)

      toast.success('Supplier deleted successfully.')
    } catch (error) {
      console.error('Error deleting Supplier:', error)
      toast.error('Failed to delete Supplier.')
    }
  }

  const formatReportRows = (data) =>
    Array.isArray(data) &&
    data.length > 0 &&
    data.map((r, index) => [
      index + 1, // ID
      r.name || '-', // Name
      r.country || '-', // Country
      r.city || '-', // City
      r.address || '-', // Address
      r.phone || '-', // Phone
      handelDateFormate(r.dateOfPayment) || '-', // Payment Date
      r.totalAmount ? `$${r.totalAmount.toFixed(2)}` : '-', // Amount, formatted as currency
      r.paymentMethodName || '-', // Payment Method
    ])

  const ReportRows = formatReportRows(initialSuppliers)
  const ReportOrderingRows = formatReportRows(suppliers)

  const balance = total_Got - total_Gave

  return (
    <>
      {/* ==[ Add / Edit Suppliers]== */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <AddEditPersonForm
          onSubmit={handleSubmit}
          title={'Supplier'}
          buttonText={'Supplier'}
          mode={mode}
          currentPerson={currentPerson}
        />
      </Modal>

      <div className="page-section">
        <h4 className="header-title">store : {user?.storeName}</h4>
        <div className="center section-logo">
          <img src={supplierImg} alt="supplierImg!!!" />
          <p>{UI.HEADER.SUPPLIERS}</p>
        </div>
      </div>
      {/* == [ Ordering Clients]== */}
      <Modal isOpen={isOrderingModalOpen} onClose={handelCloseOrderingModel}>
        <OrderingPersonForm
          title={'Suppliers Ordering'}
          onSubmit={handelSubmitOrdering}
        />
      </Modal>
      <div className="page-section">
        <div className="flex center amount-container">
          <div className="red-box">
            <span className="amount-message">{UI.TEXT.I_GAVE}</span>
            <div className="amount red">
              <LuDollarSign />
              <span className="red">{total_Gave || '00'}</span>
            </div>
          </div>
          <div className="line"></div>
          <div className="green-box">
            <span className="amount-message">{UI.TEXT.I_GOT}</span>
            <div className="amount green">
              <LuDollarSign />
              <span className="">{total_Got || '00'}</span>
            </div>
          </div>
        </div>
        <div className="flex center mb-1">
          <PdfReportGenerator
            title={`Suppliers Report`}
            columns={ReportPeopleColumns}
            got={total_Got}
            gave={total_Gave}
            balance={balance}
            rows={ReportRows}
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
            got={total_Got}
            gave={total_Gave}
            balance={balance}
            columns={ReportPeopleColumns}
            rows={ReportOrderingRows}
          />
          <div className="btn btn-add" onClick={handelOpenOrderingModel}>
            <MdOutlineSettingsInputComponent />
          </div>
          <button className="btn btn-add" onClick={handelAddSupplierModal}>
            <IoIosAdd />
            <span>Add Supplier</span>
          </button>
          <div style={{ flex: 4 }}>
            <SearchForm onSubmit={handleSearch} />
          </div>
        </div>
        <SuppliersTable
          rows={suppliers}
          columns={PeopleColumns}
          onDelete={handleDeleteSupplier}
          onEdit={handelUpdateSupplierModal}
        />
      </div>
    </>
  )
}

export default Suppliers
