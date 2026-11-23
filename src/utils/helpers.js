// Traduz códigos de erro do Firebase para mensagens claras.
export function mensagemErroFirebase(erro) {
  switch (erro?.code) {
    case 'auth/email-already-in-use':
      return 'Este e-mail já está cadastrado. Use outro e-mail ou entre na sua conta.'
    case 'auth/invalid-email':
      return 'O e-mail informado é inválido.'
    case 'auth/weak-password':
      return 'A senha é muito fraca. Use pelo menos 6 caracteres.'
    case 'auth/network-request-failed':
      return 'Sem conexão com o servidor. Verifique sua internet e tente de novo.'
    case 'auth/too-many-requests':
      return 'Muitas tentativas seguidas. Aguarde alguns minutos e tente de novo.'
    case 'auth/operation-not-allowed':
      return 'O login por e-mail/senha não está ativado no Firebase Authentication.'
    case 'permission-denied':
      return 'O Firestore recusou a gravação. Confira as regras de segurança.'
    default:
      return 'Não foi possível concluir a operação. Tente novamente.'
  }
}

export const emailValido = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

// "2000-05-17" -> "17/05/2000" (sem usar Date, para evitar erro de fuso horário)
export function formatarData(iso) {
  if (!iso) return '—'
  const [ano, mes, dia] = iso.split('-')
  return `${dia}/${mes}/${ano}`
}
