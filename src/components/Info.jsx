import { useNavigate } from 'react-router-dom'

/* eslint-disable react/prop-types */
const Info = ({ name, phone }) => {
  const navigate = useNavigate()

  const goBack = () => {
    navigate(-1)
  }
  return (
    <div className="info">
      <span>
        <span>name : </span>
        <span className="data name" onClick={goBack}>
          {name}
        </span>
      </span>
      <span>
        <span>phone : </span>
        <span className="data">{phone}</span>
      </span>
    </div>
  )
}

export default Info
