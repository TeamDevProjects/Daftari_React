/* eslint-disable react/prop-types */

import { ORDER_PERSON_BY } from '../../Constants/Variables'

const OrderingPersonForm = ({ title, onSubmit }) => {
  
  const orderingByArr = [
    { id: 1, name: ORDER_PERSON_BY.DEFAULT, label: 'All' },
    { id: 2, name: ORDER_PERSON_BY.NAME, label: 'Name' },
    {
      id: 3,
      name: ORDER_PERSON_BY.CLOSER_PAYMENT_DATES,
      label: 'Closer Payment Date',
    },
    {
      id: 4,
      name: ORDER_PERSON_BY.OLDER_PAYMENT_DATES,
      label: 'Older Payment Date',
    },
    {
      id: 5,
      name: ORDER_PERSON_BY.LARGEST_AMOUNT,
      label: 'Largest Amount',
    },
    {
      id: 6,
      name: ORDER_PERSON_BY.SMALLEST_AMOUNT,
      label: 'Smallest Amount',
    },
  ]

  return (
    <>
      <h4 className="form-title">{title} By</h4>
      <ul className="filter-form">
        {orderingByArr.map(({ id, name, label }) => (
          <li key={id} onClick={() => onSubmit(name)}>
            {label}
          </li>
        ))}
      </ul>
    </>
  )
}

export default OrderingPersonForm
