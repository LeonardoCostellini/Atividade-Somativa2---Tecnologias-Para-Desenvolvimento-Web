import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { firebaseConfigurado, auth, db } from '../services/firebase.js'
import AuthLayout from '../components/AuthLayout.jsx'
import Field from '../components/Field.jsx'
import Alert from '../components/Alert.jsx'
import { emailValido, mensagemErroFirebase } from '../utils/helpers.js'

const vazio = { email: '', senha: '', nome: '', sobrenome: '', dataNascimento: '' }

function Cadastro() {
  const navigate = useNavigate()
  const [form, setForm] = useState(vazio)
  const [erros, setErros] = useState({})
  const [mensagem, setMensagem] = useState(null) // { tipo, texto }
  const [enviando, setEnviando] = useState(false)

  const alterar = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  function validar() {
    const novo = {}
    if (!emailValido(form.email.trim())) novo.email = 'Informe um e-mail válido.'
    if (form.senha.length < 6) novo.senha = 'A senha deve ter no mínimo 6 caracteres.'
    if (!form.nome.trim()) novo.nome = 'Informe o nome.'
    if (!form.sobrenome.trim()) novo.sobrenome = 'Informe o sobrenome.'
    if (!form.dataNascimento) novo.dataNascimento = 'Informe a data de nascimento.'
    else if (form.dataNascimento > new Date().toISOString().slice(0, 10))
      novo.dataNascimento = 'A data não pode estar no futuro.'
    return novo
  }

  async function cadastrar(e) {
    e.preventDefault()
    setMensagem(null)
    if (!firebaseConfigurado) {
      setMensagem({ tipo: 'erro', texto: 'Firebase não configurado. Preencha o arquivo .env e reinicie o servidor.' })
      return
    }
    const novo = validar()
    setErros(novo)
    if (Object.keys(novo).length > 0) return

    setEnviando(true)
    let credencial
    try {
      // 1) Cria o usuário no Firebase Authentication (e-mail/senha)
      credencial = await createUserWithEmailAndPassword(auth, form.email.trim(), form.senha)
      const uid = credencial.user.uid // 2) UID gerado pelo Firebase

      // 3) Grava os demais dados no Firestore, usando o UID como id do documento
      await setDoc(doc(db, 'usuarios', uid), {
        uid,
        nome: form.nome.trim(),
        sobrenome: form.sobrenome.trim(),
        dataNascimento: form.dataNascimento,
        email: form.email.trim(),
      })

      // A senha NUNCA vai para o Firestore. Encerra a sessão e pede o login.
      await signOut(auth)
      navigate('/login', { state: { cadastrado: true } })
    } catch (erro) {
      // Se a conta foi criada mas o Firestore falhou, remove a conta para não ficar incompleta.
      if (credencial?.user) await credencial.user.delete().catch(() => {})
      setMensagem({ tipo: 'erro', texto: mensagemErroFirebase(erro) })
      setEnviando(false)
    }
  }

  return (
    <AuthLayout
      titulo="Criar conta"
      subtitulo="Preencha os dados abaixo para se cadastrar."
      rodape={<>Já tem conta? <Link to="/login">Entrar</Link></>}
    >
      <form onSubmit={cadastrar} noValidate>
        <Alert tipo={mensagem?.tipo}>{mensagem?.texto}</Alert>
        <div className="linha">
          <Field id="nome" label="Nome" autoComplete="given-name" value={form.nome} onChange={alterar} erro={erros.nome} />
          <Field id="sobrenome" label="Sobrenome" autoComplete="family-name" value={form.sobrenome} onChange={alterar} erro={erros.sobrenome} />
        </div>
        <Field id="dataNascimento" label="Data de nascimento" type="date" value={form.dataNascimento} onChange={alterar} erro={erros.dataNascimento} />
        <Field id="email" label="E-mail" type="email" autoComplete="email" value={form.email} onChange={alterar} erro={erros.email} />
        <Field id="senha" label="Senha" type="password" autoComplete="new-password" value={form.senha} onChange={alterar} erro={erros.senha} />
        <button className="botao" type="submit" disabled={enviando}>
          {enviando ? 'Cadastrando…' : 'Cadastrar'}
        </button>
      </form>
    </AuthLayout>
  )
}

export default Cadastro
