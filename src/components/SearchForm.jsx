import { useNavigation, Form } from 'react-router-dom'
import Wrapper from '../assets/wrappers/SearchForm'
import { CiSearch } from 'react-icons/ci'

const SearchForm = ({ searchTerm }) => {
  const navigation = useNavigation()
  const isSubmitting = navigation.state === 'submitting'
  return (
    <Wrapper>
      <Form className="search-form ">
        <input
          type="search"
          name="search"
          className="input-bordered form-input"
          defaultValue={searchTerm}
          disabled={isSubmitting}
        />
        <button className="btn">
          {/* {isSubmitting ? 'searching...' : 'search'} */}
          <CiSearch className="fs-1" />
        </button>
      </Form>
    </Wrapper>
  )
}
export default SearchForm
