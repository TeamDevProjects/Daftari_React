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
import { MODE, ORDER_PERSON_BY } from '../Constants/Variables'
import { useUser } from '../Context/userContext'
import SupplierServices from '../Services/supplier'
import { Modal, SearchForm } from '../components/UI'
import { AddEditPersonForm, OrderingPersonForm } from '../components/Forms'
import { SuppliersTable } from '../components/Tables'
import { MdOutlineSettingsInputComponent } from 'react-icons/md'
import { REACT_QUERY_NAME } from '../Constants/Variables'
import { queryClient } from '../App'

const SuppliersQuery = {
  queryKey: [REACT_QUERY_NAME.SUPPLIERS],
  queryFn: () => SupplierServices.GetAll(),
}
const _calcTotalPayment = (clients) => {
  if (!clients || clients.length == 0) return 0

  const totalPayment = clients.reduce(
    (total, client) =>
      client.totalAmount >= 0 ? total + client.totalAmount : total,
    0
  )
  return totalPayment
}

const _calcTotalWithdraw = (clients) => {
  if (!clients || clients.length == 0) return 0

  const totalWithdraw = clients.reduce(
    (total, client) =>
      client.totalAmount < 0 ? total + client.totalAmount : total,
    0
  )
  return totalWithdraw
}
// eslint-disable-next-line react-refresh/only-export-components
export const loader = (queryClient) => async () => {
  try {
    const initialSuppliers = await queryClient.ensureQueryData(SuppliersQuery)

    //set default totalPaymentDate & totalWithdraw
    const initialTotalPayment = _calcTotalPayment(initialSuppliers)

    const initialTotalWithdraw = _calcTotalWithdraw(initialSuppliers)

    return { initialSuppliers, initialTotalPayment, initialTotalWithdraw }
  } catch {
    throw new Response('Failed to fetch suppliers')
  }
}

const Suppliers = () => {
  const { initialSuppliers, initialTotalPayment, initialTotalWithdraw } =
    useLoaderData()

  const [suppliers, setSuppliers] = useState(initialSuppliers)
  const [totalPayment, setTotalPayment] = useState(initialTotalPayment || 0)
  const [totalWithdraw, setTotalWithdraw] = useState(initialTotalWithdraw || 0)

  const [isModalOpen, setModalOpen] = useState(false)
  const [mode, setMode] = useState(MODE.ADD)

  const [isOrderingModalOpen, setIsOrderingModalOpen] = useState(false)
  const [currentPerson, setCurrentPerson] = useState(null)

  const { user } = useUser()

  // ==============[ Privet Methods ]==================
  const _refreshTotalPayment = (newClients) => {
    if (!newClients) return

    const totalPaymentResult = _calcTotalPayment(newClients)

    setTotalPayment(totalPaymentResult)
  }

  const _refreshTotalWithdraw = (newClients) => {
    if (!newClients) return

    const totalWithdrawResult = _calcTotalWithdraw(newClients)

    setTotalWithdraw(totalWithdrawResult)
  }

  const _refresh = async () => {
    // Refresh
    _refreshTotalPayment(suppliers)
    _refreshTotalWithdraw(suppliers)
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
            ? { ...supplier, supplierId: currentPerson?.supplierId }
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
        prevSuppliers.Ordering((supplier) => supplier.supplierId !== supplierId)
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
    data.map((r, index) => [
      index + 1, // ID
      r.name || '-', // Name
      r.country || '-', // Country
      r.city || '-', // City
      r.address || '-', // Address
      r.phone || '-', // Phone
      handelDateFormate(r.dateOfPayment || '') || '-', // Payment Date
      r.totalAmount ? `$${r.totalAmount.toFixed(2)}` : '-', // Amount, formatted as currency
      r.paymentMethodName || '-', // Payment Method
    ])

  const ReportRows = formatReportRows(initialSuppliers)

  const ReportOrderingRows = formatReportRows(suppliers)

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
          <p>Suppliers</p>
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
            <span className="amount-message">I Gave</span>
            <div className="amount red">
              <LuDollarSign />
              <span className="red">{totalWithdraw || '00'}</span>
            </div>
          </div>
          <div className="line"></div>
          <div className="green-box">
            <span className="amount-message">I Get</span>
            <div className="amount green">
              <LuDollarSign />
              <span className="">{totalPayment || '00'}</span>
            </div>
          </div>
        </div>
        <div className="flex center mb-1">
          <PdfReportGenerator
            title={`Suppliers Report`}
            columns={ReportPeopleColumns}
            get={totalPayment}
            give={totalWithdraw}
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
            get={totalPayment}
            give={totalWithdraw}
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
