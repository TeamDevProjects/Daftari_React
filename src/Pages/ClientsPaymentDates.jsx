import { IoIosArrowBack } from 'react-icons/io'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { ClientPaymentDatesTable } from '../components/Tables'
import { PaymentDatesColumns } from '../Constants/TablesColumns'
import { useState } from 'react'
import clientPaymentDateService from '../Services/clientPaymentDateService'
import { toast } from 'react-toastify'
import PaymentDateImg from '../assets/payroll.png'
import { MODE, PAYMENT_Date } from '../Constants/Variables'
import { REACT_QUERY_NAME } from '../Constants/Variables'
import { Modal } from '../components/UI'
import { AddEditPaymentDateForm } from '../components/Forms'
import { queryClient } from '../App'

const ClientPaymentDatesQuery = {
  queryKey: [REACT_QUERY_NAME.CLIENTS_PAYMENTDATE],
  queryFn: async () => {
    try {
      const [todayResults, oldResults, closerResults] = await Promise.all([
        clientPaymentDateService.GetToDay(),
        clientPaymentDateService.GetOld(),
        clientPaymentDateService.GetCloser(),
      ])

      return {
        today: todayResults || [],
        old: oldResults || [],
        closer: closerResults || [],
      }
    } catch (error) {
      toast.error('Fail to fetch data')
      throw error // Ensure the error propagates to React Query
    }
  },
}

export const loader = (queryClient) => async () => {
  try {
    const data = await queryClient.ensureQueryData(ClientPaymentDatesQuery)
    return data || { today: [], old: [], closer: [] }
  } catch {
    toast.error('Failed to fetch data')
    return { today: [], old: [], closer: [] } // Default fallback
  }
}

const ClientsPaymentDates = () => {
  const navigate = useNavigate()
  const { today = [], old = [], closer = [] } = useLoaderData() || {}

  const [mode, setMode] = useState(MODE.ADD)
  const [isModalOpen, setModalOpen] = useState(false)

  const [currentPaymentDate, setCurrentPaymentDate] = useState(null)
  const [activePaymentDate, setActivePaymentDate] = useState(today)

  const [activeTitle, setActiveTitle] = useState(PAYMENT_Date.TODAY)

  // ==============[ Privet Methods ]==================

  const _filterActivePaymentDates = (paymentDateId) => {
    setActivePaymentDate((prevPaymentDates) =>
      prevPaymentDates.filter(
        (paymentDate) => paymentDate.clientPaymentDateId !== paymentDateId
      )
    )
  }

  const _updatePaymentDate = async (paymentDate) => {
    try {
      console.log('Edit payment date', paymentDate)
      await clientPaymentDateService.Update(
        { ...paymentDate, clientId: currentPaymentDate?.clientId },
        currentPaymentDate?.clientPaymentDateId
      )
      setActivePaymentDate((prevPaymentDates) =>
        prevPaymentDates.map((c) =>
          c.clientPaymentDateId === currentPaymentDate.clientPaymentDateId
            ? {
                ...c,
                ...paymentDate,
                clientPaymentDateId: currentPaymentDate?.clientPaymentDateId,
              }
            : c
        )
      )
      toast.success('payment date Updated Successfully')
    } catch (error) {
      toast.error(error?.message)
    }
  }

  // ================[ Handel UI ]=====================
  const handleOpenModal = () => {
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
  }

  const handelPaymentAsToDay = () => {
    setActivePaymentDate(today || [])
    setActiveTitle(PAYMENT_Date.TODAY)
  }

  const handelPaymentAsOld = () => {
    setActivePaymentDate(old || [])
    setActiveTitle(PAYMENT_Date.OLD)
  }

  const handelPaymentAsCloser = () => {
    setActivePaymentDate(closer || [])
    setActiveTitle(PAYMENT_Date.CLOSER)
  }

  // ==============[ Action Methods ]==================
  const handleSubmit = async (paymentdate) => {
    if (mode == MODE.UPDATE) {
      await _updatePaymentDate(paymentdate)
      console.log(paymentdate)
    }
    // refresh
    setModalOpen(false)

    queryClient.removeQueries(REACT_QUERY_NAME.CLIENTS_PAYMENTDATE)
  }

  const handelUpdatePaymentDateModal = (paymentDate) => {
    setMode(MODE.UPDATE)

    handleOpenModal()
    setCurrentPaymentDate(paymentDate)
    console.log(paymentDate)
  }

  const handelDelete = async (paymentDateId) => {
    try {
      await clientPaymentDateService.Delete(paymentDateId)

      _filterActivePaymentDates(paymentDateId)

      queryClient.removeQueries(REACT_QUERY_NAME.CLIENTS_PAYMENTDATE)

      // Refresh

      toast.success('paymentDate deleted Successfully')
    } catch (error) {
      toast.error('Failed to delete user paymentDate', error.message)
    }
  }

  const goBack = () => {
    navigate(-1)
  }
  return (
    <>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <AddEditPaymentDateForm
          onSubmit={handleSubmit}
          title={'Client PaymentDate'}
          buttonText={'PaymentDate'}
          currentPaymentDate={currentPaymentDate}
          clientId={currentPaymentDate?.clientId}
          mode={mode}
        />
      </Modal>
      <div className="page-section">
        <button className="btn-back" onClick={goBack}>
          <IoIosArrowBack />
        </button>
        <div className="center section-logo">
          <img src={PaymentDateImg} alt="supplierImg!!!" />
          <p>Suppliers PaymentDates</p>
        </div>
      </div>
      <div className="page-section">
        <div className="tab-wrap">
          <input
            type="radio"
            id="tab1"
            name="tabGroup1"
            className={`tab ${
              activeTitle == PAYMENT_Date.CLOSER && 'active-tab'
            }`}
            checked
          />
          <label
            htmlFor="tab1"
            onClick={handelPaymentAsCloser}
            className={`tab ${
              activeTitle == PAYMENT_Date.CLOSER && 'active-tab'
            }`}
          >
            Closer
          </label>

          <input
            type="radio"
            id="tab2"
            name="tabGroup1"
            className={`tab ${
              activeTitle == PAYMENT_Date.TODAY && 'active-tab'
            }`}
          />
          <label
            htmlFor="tab2"
            onClick={handelPaymentAsToDay}
            className={`tab ${
              activeTitle == PAYMENT_Date.TODAY && 'active-tab'
            }`}
          >
            ToDay
          </label>

          <input
            type="radio"
            id="tab3"
            name="tabGroup1"
            className={`tab ${activeTitle == PAYMENT_Date.OLD && 'active-tab'}`}
          />
          <label
            htmlFor="tab3"
            onClick={handelPaymentAsOld}
            className={`tab ${activeTitle == PAYMENT_Date.OLD && 'active-tab'}`}
          >
            Old
          </label>

          <div className="tab__content">
            <ClientPaymentDatesTable
              columns={PaymentDatesColumns}
              rows={activePaymentDate}
              onDelete={handelDelete}
              onEdit={handelUpdatePaymentDateModal}
            />
          </div>
        </div>
      </div>
    </>
  )
}
export default ClientsPaymentDates
