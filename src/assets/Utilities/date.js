import { format } from 'date-fns'
export const handelDateTimeFormate = (dateTime) => {
  // const date = new Date()
  const formattedDate = format(dateTime, 'dd MMM HH:mm:ss')

  console.log(formattedDate)
  return formattedDate
  // Example Output: "05 Dec 14:15:22"
}
