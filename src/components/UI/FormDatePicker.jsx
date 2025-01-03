/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import {useState } from 'react'

import { format, isValid, parse } from 'date-fns'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/style.css'

/** Render an input field bound to a DayPicker calendar. */
const FormDatePicker = ({ onSelect, defaultValue }) => {

  // Hold the month in state to control the calendar when the input changes
  const [month, setMonth] = useState(new Date(defaultValue))

  // Hold the selected date in state
  const [selectedDate, setSelectedDate] = useState(new Date(defaultValue))

  // Hold the input value in state
  const [inputValue, setInputValue] = useState('')

  const handleDayPickerSelect = (date) => {
    if (!date) {
      setInputValue('')
      setSelectedDate(undefined)
    } else {
      const normalizedDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      )
      setSelectedDate(normalizedDate)
      setMonth(normalizedDate)
      setInputValue(format(normalizedDate, 'MM/dd/yyyy'))
      onSelect(format(normalizedDate, 'yyyy-MM-dd')) 
    }
  }

  const handleInputChange = (e) => {
    setInputValue(e.target.value) // keep the input value in sync
    const date = new Date(e.target.value)
    const parsedDate = parse(
      e.target.value,
      'MM/dd/yyyy',
      new Date(date.getFullYear(), date.getMonth(), date.getDate())
    )

    if (isValid(parsedDate)) {
      setSelectedDate(parsedDate)
      setMonth(parsedDate)
      onSelect(parsedDate)
    } else {
      setSelectedDate(undefined)
    }
  }

  return (
    <div>
      <div className="flex">

      <label htmlFor="dateOfPayment">
        <strong>Date: </strong>
      </label>
      <input
        className="input input-bordered"
        id={'dateOfPayment'}
        type="text"
        value={inputValue}
        placeholder="MM/dd/yyyy"
        onChange={handleInputChange}
        />
        </div>
      <DayPicker
        month={month}
        onMonthChange={setMonth}
        mode="single"
        selected={selectedDate}
        onSelect={handleDayPickerSelect}
        footer={`Selected: ${selectedDate?.toDateString()}`}
      />
    </div>
  )
}

export default FormDatePicker
