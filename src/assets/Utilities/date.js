export const handelDateTimeFormate = (datetimeString) => {
  const dateTime = new Date(datetimeString)
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric', // Include seconds
    hour12: true, // Ensures AM/PM format
  }).format(dateTime) // output :. "1/3/2025, 12:45:21 MP"

  return formattedDate
}

export const handelDateFormate = (datetimeString) => {
  const dateTime = new Date(datetimeString)
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  }).format(dateTime) // output :. "1/3/2025"
  return formattedDate
}
