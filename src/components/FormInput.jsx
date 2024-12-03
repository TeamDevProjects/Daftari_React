// eslint-disable-next-line react/prop-types
const FormInput = ({ label, name, type, defaultValue, size, required }) => {
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
        required={required}
      />
    </div>
  )
}
export default FormInput
