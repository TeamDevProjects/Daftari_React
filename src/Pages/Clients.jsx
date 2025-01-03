import { useState } from 'react'
import { Link, useLoaderData } from 'react-router-dom'
import { MdOutlineSettingsInputComponent } from 'react-icons/md'
import { LuDollarSign } from 'react-icons/lu'
import { CiCalendarDate } from 'react-icons/ci'
import { IoIosAdd } from 'react-icons/io'
import { toast } from 'react-toastify'
import clientServices from '../Services/client.js'
import { handelDateFormate } from '../assets/Utilities/date'
import clientImg from '../assets/client.png'
import {
  PdfFilteredReportGenerator,
  PdfReportGenerator,
} from '../components/Reports'
import { OrderingPersonForm, AddEditPersonForm } from '../components/Forms'
import { SearchForm, Modal } from '../components/UI/'
import { useUser } from '../Context/userContext.jsx'
import { MODE, ORDER_PERSON_BY } from '../Constants/Variables'
import { ReportPeopleColumns } from '../Constants/ReportColumns.js'
import { PeopleColumns } from '../Constants/TablesColumns.js'
import { ClientsTable } from '../components/Tables'
import { queryClient } from '../App'
import { REACT_QUERY_NAME } from '../Constants/Variables'

// eslint-disable-next-line react-refresh/only-export-components

const _getAllClients = async () => {
  return await clientServices.GetAll()
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

const ClientsQuery = {
  queryKey: [REACT_QUERY_NAME.CLIENTS],
  queryFn: async () => await _getAllClients(),
}

export const loader = (queryClient) => async () => {
  try {
    const initialClients = await queryClient.ensureQueryData(ClientsQuery)

    if (!initialClients || initialClients.length == 0) return

    //set default totalPaymentDate & totalWithdraw
    const initialTotalPayment = _calcTotalPayment(initialClients)

    const initialTotalWithdraw = _calcTotalWithdraw(initialClients)

    return { initialClients, initialTotalPayment, initialTotalWithdraw }
  } catch {
    return {
      initialClients: [],
      initialTotalPayment: 0,
      initialTotalWithdraw: 0,
    }
  }
}

const Clients = () => {
  const { initialClients, initialTotalPayment, initialTotalWithdraw } =
    useLoaderData()

  const [clients, setClients] = useState(initialClients || [])
  const [totalPayment, setTotalPayment] = useState(initialTotalPayment || 0)
  const [totalWithdraw, setTotalWithdraw] = useState(initialTotalWithdraw || 0)

  const [mode, setMode] = useState(MODE.ADD)
  const [isModalOpen, setModalOpen] = useState(false)

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
    _refreshTotalPayment(clients)
    _refreshTotalWithdraw(clients)
  }

  const _addClient = async (client) => {
    try {
      const newClient = await clientServices.Add(client)
      setClients((prevClients) => [...prevClients, newClient])

      toast.success('New Client Added Successfully')
    } catch (error) {
      toast.error(error?.message)
    }
  }

  const _updateClient = async (client) => {
    try {
      await clientServices.Update(client, currentPerson?.clientId)

      setClients((prevClients) =>
        prevClients.map((c) =>
          c.clientId === currentPerson.clientId
            ? { ...client, clientId: currentPerson?.clientId }
            : c
        )
      )
      console.log(client)
      toast.success('Client Updated Successfully')
    } catch (error) {
      toast.error(error?.message)
    }
  }

  // ================[ Handel UI ]=====================

  const handelAddClientModal = () => {
    setMode(MODE.ADD)
    handleOpenModal()
  }

  const handelUpdateClientModal = (person) => {
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

  const handleSubmit = async (client) => {
    if (mode === MODE.ADD) {
      await _addClient(client)
    } else if (mode === MODE.UPDATE) {
      await _updateClient(client)
    }
    // Refresh
    await _refresh()

    setModalOpen(false)
    queryClient.removeQueries(REACT_QUERY_NAME.CLIENTS)
  }

  const handleDeleteClient = async (clientId) => {
    try {
      await clientServices.Delete(clientId)

      setClients((prevClients) =>
        prevClients.Ordering((client) => client.clientId !== clientId)
      )

      // Refresh
      await _refresh()
      queryClient.removeQueries(REACT_QUERY_NAME.CLIENTS)

      toast.success('Client deleted successfully.')
    } catch (error) {
      console.error('Error deleting client:', error)
      toast.error('Failed to delete client.')
    }
  }

  const handelSubmitOrdering = async (orderBy) => {
    console.log(orderBy)
    let results

    switch (orderBy) {
      case ORDER_PERSON_BY.DEFAULT:
        setClients(initialClients)
        break
      case ORDER_PERSON_BY.NAME:
        results = await clientServices.GetAllOrderByName()
        setClients(results)
        break

      case ORDER_PERSON_BY.CLOSER_PAYMENT_DATES:
        results = await clientServices.GetAllOrderByCloserPaymentDates()
        setClients(results)
        break

      case ORDER_PERSON_BY.OLDER_PAYMENT_DATES:
        results = await clientServices.GetAllOrderByOldPaymentDates()
        setClients(results)
        break

      case ORDER_PERSON_BY.LARGEST_AMOUNT:
        results = await clientServices.GetAllOrderByLargestTotalAmount()
        setClients(results)
        break

      case ORDER_PERSON_BY.SMALLEST_AMOUNT:
        results = await clientServices.GetAllOrderBySmallestTotalAmount()
        setClients(results)
        break

      default:
        setClients(initialClients)
        break
    }

    queryClient.removeQueries(REACT_QUERY_NAME.CLIENTS)
  }

  const formatReportRows = (data) =>
    data?.map((r, index) => [
      index + 1,
      r?.name || '-',
      r?.country || '-',
      r?.city || '-',
      r?.address || '-',
      r?.phone || '-',
      handelDateFormate(r?.dateOfPayment) || '-',
      r?.totalAmount ? `$${r?.totalAmount.toFixed(2)}` : '-',
      r?.paymentMethodName || '-',
    ])

  const handleSearch = async (temp) => {
    try {
      if (!temp || temp == '') {
        setClients(initialClients)
        return
      }

      const results = await clientServices.SearchByName(temp) // Call API to search by name

      setClients(results)
    } catch {
      setClients([])
    }
  }

  const ReportRows = formatReportRows(initialClients)
  const ReportOrderingRows = formatReportRows(clients)

  return (
    <>
      {/* ==[ Add / Edit Clients]== */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <AddEditPersonForm
          onSubmit={handleSubmit}
          title={'client'}
          buttonText={'Client'}
          mode={mode}
          currentPerson={currentPerson}
        />
      </Modal>
      {/* == [ Ordering Clients]== */}
      <Modal isOpen={isOrderingModalOpen} onClose={handelCloseOrderingModel}>
        <OrderingPersonForm
          title={'Clients Ordering'}
          onSubmit={handelSubmitOrdering}
        />
      </Modal>
      <div className="page-section">
        <h4 className="header-title">store : {user?.storeName}</h4>
        <div className="center section-logo">
          <img src={clientImg} alt="clientImg!!!" />
          <p>Clients</p>
        </div>
      </div>
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
            title={`Clients Report`}
            get={totalPayment}
            give={totalWithdraw}
            columns={ReportPeopleColumns}
            rows={ReportRows}
          />
          <Link to="ClientsPaymentDates">
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
            title={`Client Report`}
            get={totalPayment}
            give={totalWithdraw}
            columns={ReportPeopleColumns}
            rows={ReportOrderingRows}
          />
          <div className="btn btn-add" onClick={handelOpenOrderingModel}>
            <MdOutlineSettingsInputComponent />
          </div>
          <button className="btn btn-add" onClick={handelAddClientModal}>
            <IoIosAdd />
            <span>Add Client</span>
          </button>
          <div className="" style={{ flex: 4 }}>
            <SearchForm onSubmit={handleSearch} />
          </div>
        </div>
        <ClientsTable
          rows={clients}
          columns={PeopleColumns}
          onDelete={handleDeleteClient}
          onEdit={handelUpdateClientModal}
        />
      </div>
    </>
  )
}

export default Clients
