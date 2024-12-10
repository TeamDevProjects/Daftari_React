/* eslint-disable react/prop-types */

const FormTextarea = ({ label, name, defaultValue, onChange, required }) => {
  return (
    <div className="form-control">
      <label htmlFor={name} className="label">
        <span className="label-text capitalize">{label}</span>
      </label>
      <textarea
        name={name}
        defaultValue={defaultValue}
        className={`input input-bordered no-resize-textarea`}
        placeholder="Type something..."
        onChange={onChange}
        required={required}
      />
    </div>
  )
}

export default FormTextarea
