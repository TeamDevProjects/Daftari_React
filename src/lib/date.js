export const handelDateFormate = (datetimeString = null) => {
  const dateTime = datetimeString ? new Date(datetimeString) : new Date()

  // Get date parts adjusted to Egypt's time zone
  const options = {
    timeZone: 'Africa/Cairo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }
  const formatter = new Intl.DateTimeFormat('en-EG', options)
  const [day, month, year] = formatter.format(dateTime).split('/')

  // Return in the format day/month/year
  return `${day}/${month}/${year}`
}

export const handelDateTimeFormate = (datetimeString = null) => {
  const dateTime = datetimeString ? new Date(datetimeString) : new Date()

  // Get parts adjusted to Egypt's time zone
  const optionsDate = {
    timeZone: 'Africa/Cairo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }
  const formatterDate = new Intl.DateTimeFormat('en-EG', optionsDate)
  const [day, month, year] = formatterDate.format(dateTime).split('/')

  const optionsTime = {
    timeZone: 'Africa/Cairo',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }
  const formatterTime = new Intl.DateTimeFormat('en-EG', optionsTime)
  const time = formatterTime.format(dateTime)

  // Return in the format day/month/year hour:minute:second AM/PM
  return `${day}/${month}/${year} ${time}`
}
