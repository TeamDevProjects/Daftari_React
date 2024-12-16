/* eslint-disable react/prop-types */

const FilterPersonForm = ({ title, onSubmit }) => {
  // onSubmit => onSubmit(filterBy:string)

  // array of objects (filterBy:{name,label})
  const filterByArr = [
    { id: 1, name: 'default', label: 'All' },
    { id: 2, name: 'orderByName', label: 'Order By Name' },
    { id: 3, name: 'orderByMostAmount', label: 'Order By Amount' },
    { id: 4, name: 'orderByLowAmount', label: 'Oder By Amount' },
    {
      id: 5,
      name: 'orderByLastTransactions',
      label: 'order By Last Transactions',
    },
  ]
  // onClick select , setFilterNameState

  return (
    <>
      <h4 className="form-title">{title}</h4>
      <ul className="filter-form">
        {filterByArr.map(({ id, name, label }) => (
          <li key={id} onClick={() => onSubmit(name)}>
            {label}
          </li>
        ))}
      </ul>
    </>
  )
}

export default FilterPersonForm
