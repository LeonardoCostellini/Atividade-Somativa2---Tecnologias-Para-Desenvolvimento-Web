function Alert({ tipo = 'erro', children }) {
  if (!children) return null
  return (
    <div className={`alerta alerta-${tipo}`} role={tipo === 'erro' ? 'alert' : 'status'}>
      {children}
    </div>
  )
}

export default Alert
