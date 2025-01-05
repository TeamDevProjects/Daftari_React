export const handelDateFormate = (datetimeString) => {
  const dateTime = new Date(datetimeString)
  const day = dateTime.getDate()
  const month = dateTime.getMonth() + 1 // Months are zero-based, so add 1
  const year = dateTime.getFullYear()

  // Return in the format day/month/year
  return `${day}/${month}/${year}`
}

export const handelDateTimeFormate = (datetimeString) => {
  const dateTime = new Date(datetimeString)
  const day = dateTime.getDate()
  const month = dateTime.getMonth() + 1 // Months are zero-based, so add 1
  const year = dateTime.getFullYear()
  const hour = dateTime.getHours()
  const minute = dateTime.getMinutes()
  const second = dateTime.getSeconds()
  const ampm = hour >= 12 ? 'PM' : 'AM'

  // Convert to 12-hour format
  const hour12 = hour % 12 || 12

  // Return in the format day/month/year hour:minute:second AM/PM
  return `${day}/${month}/${year} ${hour12}:${
    minute < 10 ? '0' + minute : minute
  }:${second < 10 ? '0' + second : second} ${ampm}`
}
