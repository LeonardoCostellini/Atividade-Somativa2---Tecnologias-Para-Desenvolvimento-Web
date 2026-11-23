import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../services/firebase.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import Alert from '../components/Alert.jsx'
import { formatarData, mensagemErroFirebase } from '../utils/helpers.js'

function Principal() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [dados, setDados] = useState(null)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    let ativo = true
    async function buscar() {
      try {
        // Busca o documento cujo id é o UID do usuário autenticado
        const snap = await getDoc(doc(db, 'usuarios', user.uid))
        if (!ativo) return
        if (snap.exists()) setDados(snap.data())
        else setErro('Nenhum dado de perfil foi encontrado para esta conta.')
      } catch (e) {
        if (ativo) setErro(mensagemErroFirebase(e))
      } finally {
        if (ativo) setCarregando(false)
      }
    }
    buscar()
    return () => { ativo = false }
  }, [user.uid])

  async function sair() {
    await signOut(auth)
    navigate('/login')
  }

  const iniciais = dados ? `${dados.nome[0]}${dados.sobrenome[0]}`.toUpperCase() : ''

  return (
    <main className="principal">
      <div className="cartao cartao-perfil">
        {carregando && <div className="tela-carregando" role="status"><span className="spinner" /> Carregando seus dados…</div>}
        <Alert tipo="erro">{erro}</Alert>

        {dados && (
          <>
            <div className="avatar" aria-hidden="true">{iniciais}</div>
            <h1>Olá, {dados.nome}!</h1>
            <p className="subtitulo">Estes são os dados da sua conta.</p>
            <dl className="dados">
              <div><dt>Nome</dt><dd>{dados.nome}</dd></div>
              <div><dt>Sobrenome</dt><dd>{dados.sobrenome}</dd></div>
              <div><dt>Data de nascimento</dt><dd>{formatarData(dados.dataNascimento)}</dd></div>
            </dl>
          </>
        )}
        <button className="botao botao-contorno" onClick={sair}>Sair</button>
      </div>
    </main>
  )
}

export default Principal
