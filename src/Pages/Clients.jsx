import { useState } from 'react'
import { Link, useLoaderData } from 'react-router-dom'
import { MdOutlineSettingsInputComponent } from 'react-icons/md'
import { LuDollarSign } from 'react-icons/lu'
import { CiCalendarDate } from 'react-icons/ci'
import { IoIosAdd } from 'react-icons/io'
import { toast } from 'react-toastify'
import clientServices from '../Services/client.js'
import clientImg from '../assets/client.png'
import {
  PdfFilteredReportGenerator,
  PdfReportGenerator,
} from '../components/Reports'
import { OrderingPersonForm, AddEditPersonForm } from '../components/Forms'
import { SearchForm, Modal } from '../components/UI/'
import { useUser } from '../Context/userContext.jsx'
import { MODE, ORDER_PERSON_BY, UI } from '../Constants/Variables'
import { ReportPeopleColumns } from '../Constants/ReportColumns.js'
import { PeopleColumns } from '../Constants/TablesColumns.js'
import { ClientsTable } from '../components/Tables'
import { queryClient } from '../App'
import { REACT_QUERY_NAME } from '../Constants/Variables'
import { calcTotal_Gave, calcTotal_got } from '../lib/helpers.js'
import { handelDateFormate } from '../lib/date.js'

// eslint-disable-next-line react-refresh/only-export-components

const _getAllClients = async () => {
  try {
    return await clientServices.GetAll()
  } catch (error) {
    toast.error(error.message)
    return
  }
}



const ClientsQuery = {
  queryKey: [REACT_QUERY_NAME.CLIENTS],
  queryFn: async () => await _getAllClients(),
}

export const loader = (queryClient) => async () => {
  try {
    const initialClients = await queryClient.ensureQueryData(ClientsQuery)

    //set default total_GaveDate & total_got
    const initialTotal_Gave = calcTotal_Gave(initialClients)

    const initialTotal_got = calcTotal_got(initialClients)

    return { initialClients, initialTotal_Gave, initialTotal_got }
  } catch {
    return {
      initialClients: [],
      initialTotal_Gave: 0,
      initialTotal_got: 0,
    }
  }
}

const Clients = () => {
  const { initialClients, initialTotal_Gave, initialTotal_got } =
    useLoaderData()

  const [clients, setClients] = useState(initialClients || [])
  const [total_Gave, setTotal_Gave] = useState(initialTotal_Gave || 0)
  const [total_got, setTotal_got] = useState(initialTotal_got || 0)

  const [mode, setMode] = useState(MODE.ADD)
  const [isModalOpen, setModalOpen] = useState(false)

  const [isOrderingModalOpen, setIsOrderingModalOpen] = useState(false)
  const [currentPerson, setCurrentPerson] = useState(null)

  const { user } = useUser()

  // ==============[ Privet Methods ]==================
  const _refreshTotal_Gave = (newClients) => {
    if (!newClients) return

    const total_GaveResult = calcTotal_Gave(newClients)

    setTotal_Gave(total_GaveResult)
  }

  const _refreshTotal_got = (newClients) => {
    if (!newClients) return

    const total_gotResult = calcTotal_got(newClients)

    setTotal_got(total_gotResult)
  }

  const _refresh = async () => {
    // Refresh
    _refreshTotal_Gave(clients)
    _refreshTotal_got(clients)
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
            ? { ...c, ...client, clientId: currentPerson?.clientId }
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
        prevClients.filter((client) => client.clientId !== clientId)
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
    Array.isArray(data) &&
    data.length > 0 &&
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

  const balance = total_Gave - total_got

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
          <p>{UI.HEADER.CLIENTS}</p>
        </div>
      </div>
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
              <span className="">{total_got || '00'}</span>
            </div>
          </div>
        </div>
        <div className="flex center mb-1">
          <PdfReportGenerator
            title={`Clients Report`}
            gave={total_Gave}
            got={total_got}
            balance={balance}
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
            gave={total_Gave}
            got={total_got}
            balance={balance}
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
