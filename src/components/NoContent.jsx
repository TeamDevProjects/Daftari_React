/* eslint-disable react/prop-types */
import noContentImg from '../assets/no-content.png'

const NoContent = ({text}) => {
  return (
    <div className="no-content">
      <img className="no-content" src={noContentImg} alt="noContentImg!!" />
      <p className="center">{text}</p>
    </div>
  )
}

export default NoContent
