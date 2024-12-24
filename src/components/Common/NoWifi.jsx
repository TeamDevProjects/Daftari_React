/* eslint-disable react/prop-types */
import noWifiImg from '../../assets/no-wifi.png'

const NoWifi = ({ text }) => {
  return (
    <div className="no-content" style={{ marginTop: '30vh' }}>
      <img className="no-content" src={noWifiImg} alt="noWifiImg!!" />
      <p className="center">{text}</p>
    </div>
  )
}

export default NoWifi
