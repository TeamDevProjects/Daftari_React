import { useEffect, useState, useReducer, useCallback } from 'react'
import { FormInput, FormSelect, SubmitBtn } from '../components/index'
import { Form, Link, useNavigate } from 'react-router-dom'
import { GetBusinessTypes } from '../Services/businessType'
import { GetSectors } from '../Services/sector'
import userServices from '../Services/user'

// Initial state for the form
const initialState = {
  phone: '',
  city: '',
  country: '',
  address: '',
  storeName: '',
  userName: '',
  passwordHash: '',
  sectorId: 0,
  businessTypeId: 0,
  errors: {},
}

// Reducer function to handle form state
const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_FIELD_VALUE':
      return {
        ...state,
        [action.field]: action.value,
        errors: { ...state.errors, [action.field]: '' }, // set ex: username error ""
      }
    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.error },
      }
    default:
      return state
  }
}

const validatePhone = (phone) => {
  const re = /^[0-9]{11}$/
  return re.test(phone)
}

// Validation function
const validate = (state) => {
  const errors = {} // !''  = true
  if (!state.userName.trim()) errors.userName = 'userName is require'
  if (!state.passwordHash.trim()) errors.passwordHash = 'Password is require'
  if (state.passwordHash.trim().length < 5)
    errors.passwordHash = 'must be more than 5 chars'
  if (!state.city.trim()) errors.city = 'city is require'
  if (!state.country.trim()) errors.country = 'country is require'
  if (!state.address.trim()) errors.address = 'address is require'
  if (!state.storeName.trim()) errors.storeName = 'storeName is require'
  if (state.sectorId == 0) errors.sectorId = 'sectorId is require'
  if (state.businessTypeId == 0)
    errors.businessTypeId = 'businessTypeId is require'

  if (!state.phone) errors.phone = 'Phone is require'
  if (!validatePhone(state.phone)) errors.phone = 'must be more than 11 digits'

  return errors
}
const SignUp = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    dispatch({ type: 'SET_FIELD_VALUE', field: name, value })
  }

  const handleBusinessTypeChange = (e) => {
    const { value } = e.target
    dispatch({
      type: 'SET_FIELD_VALUE',
      field: 'businessTypeId',
      value: Number(value),
    })
  }

  const handleSectorChange = (e) => {
    const { value } = e.target
    dispatch({
      type: 'SET_FIELD_VALUE',
      field: 'sectorId',
      value: Number(value),
    })
  }

  const handlePhoneOnkeyDown = (e) => {
    const charCode = e.charCode
    if (charCode < 48 || charCode > 57) {
      e.preventDefault()
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkIsValidForm = useCallback(() => {
    if (
      !state.phone ||
      !state.city ||
      !state.country ||
      !state.address ||
      !state.storeName ||
      !state.userName ||
      !state.passwordHash ||
      state.sectorId == 0 ||
      state.businessTypeId == 0
    ) {
      return false
    }
    return true
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    const User = {
      phone: state?.phone.trim(),
      city: state?.city.trim(),
      country: state?.country.trim(),
      address: state?.address.trim(),
      storeName: state?.storeName.trim(),
      name: state?.userName.trim(),
      userName: state?.userName.trim(),
      passwordHash: state?.passwordHash.trim(),
      sectorId: state?.sectorId,
      businessTypeId: state?.businessTypeId,
    }

    const errors = validate(state)

    if (Object.keys(errors).length > 0) {
      for (const field in errors) {
        dispatch({ type: 'SET_ERROR', field, error: errors[field] })
      }
      console.log('Error', state.errors)
    } else {
      console.log('Form submitted successfully', User)
      //UserDispatch(signupUser(User))
      userServices.UserSignUp(User)

      // after Success Sign up navigate to Login Page
      setTimeout(() => {
        navigate('/Signin')
      }, 200)
    }
  }

  const [businessTypes, setBusinessTypes] = useState([])
  const [sectors, setSectors] = useState([])

  useEffect(() => {
    const FetchBusinessTypes = async () => {
      const result = await GetBusinessTypes()
      setBusinessTypes(result)
    }

    const FetchSectors = async () => {
      const result = await GetSectors()
      setSectors(result)
    }

    FetchBusinessTypes()
    FetchSectors()
    return () => {
      false
    }
  }, [])

  useEffect(() => {
    checkIsValidForm()
    console.log(userServices.GetClients())
    return () => {
      false
    }
  }, [checkIsValidForm, state])

  return (
    <section className="register-container">
      <Form method="POST" className="register-form" onSubmit={handleSubmit}>
        <h4 className="form-title">Register</h4>
        <div className="flex">
          <FormInput
            type="text"
            label="userName"
            name="userName" // => field name
            onChange={handleChange} // => field value
            Error={!!state.errors.userName} // false or true
            TextError={state.errors.userName} // ''    or 'some thing'
          />

          <FormInput
            type="text"
            label="phone"
            name="phone"
            onChange={handleChange}
            onKeyPress={handlePhoneOnkeyDown}
            Error={!!state.errors.phone}
            TextError={state.errors.phone}
          />
        </div>
        <FormInput
          type="password"
          label="password"
          name="passwordHash"
          onChange={handleChange}
          Error={!!state.errors.passwordHash}
          TextError={state.errors.passwordHash}
        />
        <div className="flex">
          <FormInput
            type="text"
            label="city"
            name="city"
            onChange={handleChange}
            Error={!!state.errors.city}
            TextError={state.errors.city}
          />
          <FormInput
            type="text"
            label="country"
            name="country"
            onChange={handleChange}
            Error={!!state.errors.country}
            TextError={state.errors.country}
          />
        </div>
        <div className="flex">
          <FormInput
            type="text"
            label="address"
            name="address"
            onChange={handleChange}
            Error={!!state.errors.address}
            TextError={state.errors.address}
          />
          <FormInput
            type="text"
            label="storeName"
            name="storeName"
            onChange={handleChange}
            Error={!!state.errors.storeName}
            TextError={state.errors.storeName}
          />
        </div>
        <div className="flex">
          <FormSelect
            label="businessType"
            name="businessTypeId"
            options={businessTypes}
            optionId={'businessTypeId'}
            optionValue={'businessTypeName'}
            onChange={handleBusinessTypeChange}
            Error={!!state.errors.businessTypeId}
            TextError={state.errors.businessTypeId}
          />
          <FormSelect
            label="sector"
            name="sectorId"
            options={sectors}
            optionId={'sectorId'}
            optionValue={'sectorName'}
            onChange={handleSectorChange}
            Error={!!state.errors.sectorId}
            TextError={state.errors.sectorId}
          />
        </div>
        <div className="submit-btn-container">
          <SubmitBtn text="Register" disabled={!checkIsValidForm()} />
        </div>
        <p className="form-link">
          Already a member?
          <Link to="/SignIn" className="form-text">
            SignIn
          </Link>
        </p>
      </Form>
    </section>
  )
}

export default SignUp
