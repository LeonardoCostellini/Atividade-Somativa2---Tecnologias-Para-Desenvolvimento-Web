function Field({ id, label, erro, ...props }) {
  return (
    <div className="campo">
      <label htmlFor={id}>{label}</label>
      <input id={id} name={id} aria-invalid={Boolean(erro)} {...props} />
      {erro && <small className="campo-erro">{erro}</small>}
    </div>
  )
}

export default Field
