import { useState } from 'react'
import { IoIosAdd, IoIosArrowBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import supplierPaymentDateService from '../Services/supplierPaymentDate'
import { PaymentDatesColumns } from '../Constants/TablesColumns'
import { SupplierPaymentDatesTable } from '../components/Tables'
import PaymentDateImg from '../assets/payroll.png'
import { MODE, PAYMENT_Date } from '../Constants/Variables'
import { useQuery } from '@tanstack/react-query'
import { REACT_QUERY_NAME } from '../Constants/Variables'
import { Modal } from '../components/UI'
import { AddEditPaymentDateForm } from '../components/Forms'

const SuppliersPaymentDatesQuery = {
  queryKey: [REACT_QUERY_NAME.SUPPLIERS_PAYMENTDATE],
  queryFn: async () => {
    try {
      const [todayResults, oldResults, closerResults] = await Promise.all([
        supplierPaymentDateService.GetToDay(),
        supplierPaymentDateService.GetOld(),
        supplierPaymentDateService.GetCloser(),
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
    await queryClient.ensureQueryData({
      queryKey: SuppliersPaymentDatesQuery.queryKey,
      queryFn: SuppliersPaymentDatesQuery.queryFn,
    })
  } catch (error) {
    console.error('Error fetching payment dates:', error.message)
    toast.error('Fail to fetch data')
  }
}

const SuppliersPaymentDates = () => {
  const navigate = useNavigate()
  const { data } = useQuery(SuppliersPaymentDatesQuery)
  const { today, old, closer } = data
  const [toDayPaymentDate, setToDayPaymentDate] = useState(today)
  const [oldPaymentDate, setOldPaymentDate] = useState(old)
  const [closerPaymentDate, setCloserPaymentDate] = useState(closer)

  const [mode, setMode] = useState(MODE.ADD)
  const [isModalOpen, setModalOpen] = useState(false)

  const [activePaymentDate, setActivePaymentDate] = useState(toDayPaymentDate)
  const [activeTitle, setActiveTitle] = useState(PAYMENT_Date.TODAY)
  // ==============[ Privet Methods ]==================
  // ================[ Handel UI ]=====================

  const handelAddPaymentDateModal = () => {
    setMode(MODE.ADD)
    handleOpenModal()
  }

  const handelUpdatePaymentDateModal = (paymentDate) => {
    setMode(MODE.UPDATE)
    //  setCurrentPerson(person)

    handleOpenModal()
    console.log(paymentDate)
  }
  const handleOpenModal = () => {
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
  }
  // ==============[ Action Methods ]==================
  const handleSubmit = () => {}

  const handelDelete = (paymentDateId) => {
    return console.log(paymentDateId)
  }

  const goBack = () => {
    navigate(-1) // الرجوع إلى الصفحة السابقة
  }

  /*   const fetchToDayPaymentDates = async () => {
    try {
      const results = await supplierPaymentDateService.GetToDay()
      if (results) setToDayPaymentDate(results)
      else toast.error('Faild to fethch data')
    } catch (error) {
      toast.error(error.message)
    }
  }

  const fetchOldPaymentDates = async () => {
    try {
      const results = await supplierPaymentDateService.GetOld()
      if (results) setOldPaymentDate(results)
      else toast.error('Faild to fethch data')
    } catch (error) {
      toast.error(error.message)
    }
  }

  const fetchCloserPaymentDates = async () => {
    try {
      const results = await supplierPaymentDateService.GetCloser()
      if (results) setCloserPaymentDate(results)
      else toast.error('Faild to fethch data')
    } catch (error) {
      toast.error(error.message)
    }
  }
  useEffect(() => {
    // fetch paymentDates old, today, closer
    fetchToDayPaymentDates()
    fetchOldPaymentDates()
    fetchCloserPaymentDates()
  }, [])
*/
  const handelPaymentAsToDay = () => {
    setActivePaymentDate(toDayPaymentDate || [])
    setActiveTitle(PAYMENT_Date.TODAY)
  }
  const handelPaymentAsOld = () => {
    setActivePaymentDate(oldPaymentDate || [])
    setActiveTitle(PAYMENT_Date.OLD)
  }
  const handelPaymentAsCloser = () => {
    setActivePaymentDate(closerPaymentDate || [])
    setActiveTitle(PAYMENT_Date.CLOSER)
  }

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <AddEditPaymentDateForm
          onSubmit={handleSubmit}
          title={'Supplier PaymentDate'}
          buttonText={'PaymentDate'}
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
        <button className="btn btn-add" onClick={handelAddPaymentDateModal}>
          <IoIosAdd />
          <span>Add Payment Date</span>
        </button>
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
            <SupplierPaymentDatesTable
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
export default SuppliersPaymentDates
