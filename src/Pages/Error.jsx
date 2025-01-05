import { Link, useRouteError } from 'react-router-dom'
import img from '../assets/not-found.svg'
const Error = () => {
  const error = useRouteError()
  console.log(error)
  if (error.status === 404) {
    return (
      <div className="error-page">
        <div>
          <img src={img} alt="not found" />
          <h3>Ohh!</h3>
          <p>We can&apos;t seem to find page you are looking for</p>
          <Link to="/">back home</Link>
        </div>
      </div>
    )
  }
  return (
    <div className="error-page">
      <div>
        <h3>something went wrong </h3>
        <Link to="/">back home</Link>
      </div>
    </div>
  )
}
export default Error
