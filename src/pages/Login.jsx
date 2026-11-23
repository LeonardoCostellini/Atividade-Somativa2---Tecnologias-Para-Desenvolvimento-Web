import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { firebaseConfigurado, auth } from '../services/firebase.js'
import AuthLayout from '../components/AuthLayout.jsx'
import Field from '../components/Field.jsx'
import Alert from '../components/Alert.jsx'
import { emailValido, mensagemErroFirebase } from '../utils/helpers.js'

const CREDENCIAIS_INVALIDAS = [
  'auth/invalid-credential',
  'auth/user-not-found',
  'auth/wrong-password',
  'auth/invalid-login-credentials',
]

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', senha: '' })
  const [erros, setErros] = useState({})
  const [mensagem, setMensagem] = useState(
    location.state?.cadastrado
      ? { tipo: 'sucesso', texto: 'Cadastro realizado com sucesso! Entre com seu e-mail e senha.' }
      : null
  )
  const [enviando, setEnviando] = useState(false)

  const alterar = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  async function entrar(e) {
    e.preventDefault()
    setMensagem(null)
    if (!firebaseConfigurado) {
      setMensagem({ tipo: 'erro', texto: 'Firebase não configurado. Preencha o arquivo .env e reinicie o servidor.' })
      return
    }
    const novo = {}
    if (!emailValido(form.email.trim())) novo.email = 'Informe um e-mail válido.'
    if (!form.senha) novo.senha = 'Informe a senha.'
    setErros(novo)
    if (Object.keys(novo).length > 0) return

    setEnviando(true)
    try {
      // Validação real no Firebase Authentication
      await signInWithEmailAndPassword(auth, form.email.trim(), form.senha)
      navigate('/principal')
    } catch (erro) {
      const texto = CREDENCIAIS_INVALIDAS.includes(erro.code)
        ? 'Usuário não cadastrado ou dados de acesso incorretos.'
        : mensagemErroFirebase(erro)
      setMensagem({ tipo: 'erro', texto })
      setEnviando(false)
    }
  }

  return (
    <AuthLayout
      titulo="Entrar"
      subtitulo="Use o e-mail e a senha cadastrados."
      rodape={<>Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link></>}
    >
      <form onSubmit={entrar} noValidate>
        <Alert tipo={mensagem?.tipo}>{mensagem?.texto}</Alert>
        <Field id="email" label="E-mail" type="email" autoComplete="email" value={form.email} onChange={alterar} erro={erros.email} />
        <Field id="senha" label="Senha" type="password" autoComplete="current-password" value={form.senha} onChange={alterar} erro={erros.senha} />
        <button className="botao" type="submit" disabled={enviando}>
          {enviando ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </AuthLayout>
  )
}

export default Login
