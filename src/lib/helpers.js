import { TRANSACTION_TYPE_NAME } from "../Constants/Variables"

export const calcTotalPayment = (transactions) => {
  if (!transactions || transactions.length == 0) return 0

  const totalPayment = transactions.reduce(
    (total, transaction) =>
      transaction.transactionTypeName == TRANSACTION_TYPE_NAME.PAYMENT
        ? total + transaction.amount
        : total,
    0
  )
  return totalPayment
}

export const calcTotalWithdraw = (transactions) => {
  if (!transactions || transactions.length == 0) return 0

  const totalWithdraw = transactions.reduce(
    (total, transaction) =>
      transaction.transactionTypeName === TRANSACTION_TYPE_NAME.WITHDRAW
        ? total + transaction.amount
        : total,
    0
  )
  return totalWithdraw
}

export const calcTotal_Gave = (people) => {
  if (!people || people.length == 0) return 0

  const total_Gave = people.reduce(
    (total, client) =>
      client.totalAmount >= 0 ? total + client.totalAmount : total,
    0
  )
  return total_Gave
}

export const calcTotal_got = (people) => {
  if (!people || people.length == 0) return 0

  const total_got = people.reduce(
    (total, client) =>
      client.totalAmount < 0 ? total + client.totalAmount : total,
    0
  )
  return total_got
}