import { useEffect, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/style.css'

const FormDatePicker = () => {
  const [selected, setSelected] = useState(null) // Selected date
  const [month, setMonth] = useState(new Date()) // Month displayed in the calendar

  useEffect(() => {
    // Set the selected date to one month from today
    const today = new Date()
    const nextMonth = new Date(today)
    nextMonth.setMonth(today.getMonth() + 1)

    setSelected(nextMonth)
    setMonth(nextMonth) // Update the calendar view
  }, [])

  return (
    <div className="small-datepicker">
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={(date) => {
          setSelected(date)
          setMonth(date) // Update calendar view to match selected date
        }}
        month={month} // Control the calendar's displayed month
        footer={
          selected ? (
            <>
              <span>Selected:</span>
              <p dir="rtl"> {selected.toLocaleDateString()}</p>
            </>
          ) : (
            <p>Pick a day.</p>
          )
        }
      />
    </div>
  )
}

export default FormDatePicker
