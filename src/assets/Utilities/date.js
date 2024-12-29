import { format } from 'date-fns'
export const handelDateTimeFormate = (dateTime) => {
  // const date = new Date()
  const formattedDate = format(dateTime, 'dd MMM HH:mm:ss')

  return formattedDate
  // Example Output: "05 Dec 14:15:22"
}

export const handelDateFormate = (dateTime) => {
  // const date = new Date()
  if (!dateTime) return ''
  const formattedDate = format(dateTime, 'dd MMM')

  return formattedDate
  // Example Output: "05 Dec 14:15:22"
}
