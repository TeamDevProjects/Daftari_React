import { useNavigation } from 'react-router-dom'

// eslint-disable-next-line react/prop-types
const SubmitBtn = ({ text }) => {
  const navigation = useNavigation()
  const isSubmitting = navigation.state === 'submitting'
  return (
    <button type="submit" className="submit-btn" disabled={isSubmitting}>
      {isSubmitting ? (
        <>
          <span className="spinner"></span>
          <span>sending...</span>
        </>
      ) : (
        text || 'submit'
      )}
    </button>
  )
}
export default SubmitBtn
