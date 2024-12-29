/* eslint-disable react/prop-types */
// eslint-disable-next-line react/prop-types
const FormInput = ({
  label,
  name,
  type,
  defaultValue,
  size,
  TextError,
  onChange,
  onKeyPress,
  required,
  Error,
}) => {
  return (
    <div className="form-control">
      <label htmlFor={name} className="label">
        <span className="label-text capitalize">{label}</span>
      </label>
      <input
        type={type}
        name={name}
        id={name}
        defaultValue={defaultValue}
        className={`input input-bordered ${Error && 'input-error'} ${size}`}
        onChange={onChange}
        onKeyPress={onKeyPress}
        required={required}
      />
      {Error && <p className="text-error">{TextError}</p>}
    </div>
  )
}
export default FormInput
