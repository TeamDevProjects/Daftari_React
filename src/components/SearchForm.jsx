import { useNavigation, Form } from 'react-router-dom'
import Wrapper from '../assets/wrappers/SearchForm'
import { CiSearch } from 'react-icons/ci'
import { useReducer } from 'react'

// Initial state for the form
const initialState = {
  search: '',
}

// Reducer function to handle form state
const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_FIELD_VALUE':
      return {
        ...state,
        [action.field]: action.value,
      }
    default:
      return state
  }
}

const SearchForm = ({ onSubmit }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const handleChange = (e) => {
    const { name, value } = e.target
    dispatch({ type: 'SET_FIELD_VALUE', field: name, value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const temp = state.search

    onSubmit(temp)
  }

  const navigation = useNavigation()
  const isSubmitting = navigation.state === 'submitting'
  return (
    <Wrapper>
      <Form className="search-form " onSubmit={handleSubmit}>
        <input
          type="search"
          name="search"
          className="input-bordered form-input"
          disabled={isSubmitting}
          onChange={handleChange}
        />
        <button className="btn">
          <CiSearch className="fs-1" />
        </button>
      </Form>
    </Wrapper>
  )
}
export default SearchForm
