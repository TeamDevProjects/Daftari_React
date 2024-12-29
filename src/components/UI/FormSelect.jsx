/* eslint-disable react/prop-types */
// eslint-disable-next-line react/prop-types
const FormSelect = ({
  label,
  name,
  defaultValue,
  size,
  options,
  optionId,
  optionValue,
  Error,
  TextError,
  onChange,
}) => {
  return (
    <div className="form-control">
      <label htmlFor={name} className="label">
        <span className="label-text capitalize">{label}</span>
      </label>
      <select
        name={name}
        value={defaultValue}
        id={name}
        onChange={onChange}
        className={`input input-bordered ${Error && 'select-error'} ${size}`}
      >
        <option value="">Select...</option>
        {Array.isArray(options) &&
          options?.length > 0 &&
          options.map((option) => (
            <option key={option[optionId]} value={option[optionId]}>
              {option[optionValue]}
            </option>
          ))}
      </select>
      {Error && <p className="text-error">{TextError}</p>}
    </div>
  )
}

export default FormSelect
