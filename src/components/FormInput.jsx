/* eslint-disable react/prop-types */
// eslint-disable-next-line react/prop-types
const FormInput = ({ label, name, type, defaultValue, size }) => {
  return (
    <div className="form-control">
      <label htmlFor={name} className="label">
        <span className="label-text capitalize">{label}</span>
      </label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        className={`input input-bordered ${size}`}
      />
      {Error && <p className="text-error">{TextError}</p>}
    </div>
  )
}
export default FormInput
