/* eslint-disable react/prop-types */
import serverErrorImg from '../../assets/error.png'

const ServerError = ({ text }) => {
  return (
    <div className="no-content" style={{ marginTop: '30vh' }}>
      <img className="no-content" src={serverErrorImg} alt="serverErrorImg!!" />
      <p className="center">{text}</p>
    </div>
  )
}

export default ServerError
