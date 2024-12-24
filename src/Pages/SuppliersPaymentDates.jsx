import { useState } from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import supplierPaymentDateService from '../Services/supplierPaymentDate'
import { PaymentDatesColumns } from '../Constants/TablesColumns'
import SupplierPaymentDatesTable from '../components/Tables/SupplierPaymentDatesTable'
import PaymentDateImg from '../assets/payroll.png'
import { PAYMENT_Date } from '../Constants/Variables'
import { useQuery } from '@tanstack/react-query'

const SuppliersPaymentDatesQuery = {
  queryKey: ['SuppliersPaymentDatesQuery'],
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

  const [activePaymentDate, setActivePaymentDate] = useState(toDayPaymentDate)
  const [activeTitle, setActiveTitle] = useState(PAYMENT_Date.TODAY)

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
      <div className="page-section">
        <button className='btn-back' onClick={goBack}>
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
            <SupplierPaymentDatesTable
              columns={PaymentDatesColumns}
              rows={activePaymentDate}
            />
          </div>
        </div>
      </div>
    </>
  )
}
export default SuppliersPaymentDates
