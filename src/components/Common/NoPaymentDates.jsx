/* eslint-disable react/prop-types */
import noContentImg from '../../assets/payment.png'

const NoPaymentDates = ({ text }) => {
  return (
    <div className="no-content">
      <img className="no-content" src={noContentImg} alt="noContentImg!!" />
      <p className="center">{text}</p>
    </div>
  )
}

export default NoPaymentDates
