import { firebaseConfigurado } from '../services/firebase.js'
import Alert from './Alert.jsx'

// Layout compartilhado por Cadastro e Login (mantém a mesma identidade visual).
function AuthLayout({ titulo, subtitulo, children, rodape }) {
  return (
    <main className="auth">
      <aside className="auth-painel">
        <span className="marca">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="8" r="4" fill="currentColor" />
            <path d="M4 21c1-5 5-7 8-7s7 2 8 7z" fill="currentColor" />
          </svg>
          Meu Perfil
        </span>
        <h2>Uma conta, seus dados, só seus.</h2>
        <p>Cadastre-se, entre e consulte as informações guardadas na sua conta.</p>
      </aside>

      <section className="auth-conteudo">
        <div className="cartao">
          {!firebaseConfigurado && (
            <Alert tipo="erro">
              Firebase não configurado. Preencha o arquivo <code>.env</code> (veja{' '}
              <code>.env.example</code>) e reinicie o servidor.
            </Alert>
          )}
          <h1>{titulo}</h1>
          <p className="subtitulo">{subtitulo}</p>
          {children}
          <p className="rodape-form">{rodape}</p>
        </div>
      </section>
    </main>
  )
}

export default AuthLayout
