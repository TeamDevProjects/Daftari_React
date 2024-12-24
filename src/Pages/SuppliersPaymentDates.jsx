import { useState } from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import supplierPaymentDateService from '../Services/supplierPaymentDate'
import { PaymentDatesColumns } from '../Constants/TablesColumns'
import SupplierPaymentDatesTable from '../components/Tables/SupplierPaymentDatesTable'
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
  const [activeTitle, setActiveTitle] = useState('ToDay')

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
  }, [activePaymentDate])
 */
  const handelPaymentAsToDay = () => {
    setActivePaymentDate(toDayPaymentDate || [])
    setActiveTitle('ToDay')
  }
  const handelPaymentAsOld = () => {
    setActivePaymentDate(oldPaymentDate || [])
    setActiveTitle('Old')
  }
  const handelPaymentAsCloser = () => {
    setActivePaymentDate(closerPaymentDate || [])
    setActiveTitle('Closer')
  }
  return (
    <>
      <div className="panner">
        <button onClick={goBack}>
          <IoIosArrowBack />
        </button>
      </div>
      <div className="page-section">
        <div className="flex btn-group">
          <div className="btn" onClick={handelPaymentAsCloser}>
            Closer
          </div>
          <div className="btn" onClick={handelPaymentAsToDay}>
            ToDay
          </div>
          <div className="btn" onClick={handelPaymentAsOld}>
            Old
          </div>
        </div>
        <h4 className="center mb-1 table-header">{`${activeTitle} Payment Dates`}</h4>
        <SupplierPaymentDatesTable
          columns={PaymentDatesColumns}
          rows={activePaymentDate}
        />
      </div>
    </>
  )
}
export default SuppliersPaymentDates
