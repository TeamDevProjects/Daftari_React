/* eslint-disable react/prop-types */
// eslint-disable-next-line react/prop-types
<<<<<<< HEAD
const FormInput = ({ label, name, type, defaultValue, size, TextError }) => {
=======
const FormInput = ({
  label,
  name,
  type,
  defaultValue,
  size,
  required,
  Error,
  TextError,
  onChange,
  onKeyDown,
}) => {
>>>>>>> 2785269b3bc26a87daded2bce06f43b6e3f93980
  return (
    <div className="form-control">
      <label htmlFor={name} className="label">
        <span className="label-text capitalize">{label}</span>
      </label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        className={`input input-bordered ${Error && 'input-error'} ${size}`}
        onChange={onChange}
        onKeyDown={onKeyDown}
        required={required}
      />
      {Error && <p className="text-error">{TextError}</p>}
    </div>
  )
}
export default FormInput
