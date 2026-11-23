# Atividade Somativa 2 — React + Firebase

Aplicação com 3 páginas: **Cadastro**, **Login** e **Principal**, usando React, React Router DOM, Firebase Authentication (e-mail/senha) e Cloud Firestore.

## 1. Configurar o Firebase (uma vez)

1. Acesse https://console.firebase.google.com com sua conta Google e clique em **Adicionar projeto**. Dê um nome e conclua (o Google Analytics pode ficar desativado).
2. Na página do projeto, clique no ícone **Web (`</>`)** para registrar um app. Dê um apelido (ex.: `meu-app`). Não precisa marcar Hosting.
3. Na tela seguinte aparece o objeto `firebaseConfig`. **Deixe essa tela aberta** ou copie os valores.
4. Menu **Criação > Authentication > Vamos começar > Sign-in method > E-mail/senha** → ative a primeira chave (não a do "link por e-mail") → **Salvar**.
5. Menu **Criação > Firestore Database > Criar banco de dados**. Escolha uma região (ex.: `southamerica-east1`) e o modo **produção**.
6. Na aba **Regras** do Firestore, cole o conteúdo do arquivo `firestore.rules` deste projeto e clique em **Publicar**. Isso garante que cada usuário leia somente o próprio documento.
7. Copie `.env.example` para `.env` e preencha com os valores do passo 3:

| Variável `.env` | Campo do `firebaseConfig` |
|---|---|
| `VITE_FIREBASE_API_KEY` | `apiKey` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `authDomain` |
| `VITE_FIREBASE_PROJECT_ID` | `projectId` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `storageBucket` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `messagingSenderId` |
| `VITE_FIREBASE_APP_ID` | `appId` |

Sem aspas e sem espaços. Se esquecer, a tela mostra o aviso "Firebase não configurado".

## 2. Executar localmente

Requer Node.js 18+.

```bash
npm install
npm run dev      # abre em http://localhost:5173
npm run build    # gera a pasta dist/ (build de produção)
npm run preview  # testa o build localmente
```

Depois de editar o `.env`, reinicie o `npm run dev`.

## 3. Publicar (deploy)

### Opção A — Vercel (mais simples)
1. Suba o projeto para um repositório no GitHub (o `.env` e `node_modules` já estão no `.gitignore`).
2. Em https://vercel.com, **Add New > Project** e importe o repositório. O Vite é detectado sozinho (build: `npm run build`, saída: `dist`).
3. Antes de clicar em Deploy, abra **Environment Variables** e cadastre as 6 variáveis `VITE_FIREBASE_*` com os mesmos valores do `.env`.
4. Clique em **Deploy**. O arquivo `vercel.json` já garante que `/login`, `/cadastro` e `/principal` funcionem ao recarregar a página.
5. No Firebase: **Authentication > Settings > Domínios autorizados > Adicionar domínio** e inclua o domínio da Vercel (ex.: `meu-app.vercel.app`).

### Opção B — Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting   # pasta pública: dist | single-page app: Sim | sobrescrever index.html: Não
npm run build
firebase deploy
```
O `.env` é lido no momento do `npm run build`, então ele precisa estar preenchido nessa máquina.

### Testar após publicar
Abra a URL pública → crie uma conta → confira em **Authentication > Users** e em **Firestore > usuarios** (o id do documento deve ser igual ao UID) → entre → confira os dados → clique em Sair → tente abrir `/principal` deslogado (deve voltar ao Login) → tente entrar com senha errada (deve aparecer a mensagem de erro).

## 4. Entrega em ZIP
Compacte a pasta do projeto **sem** `node_modules` (e sem `dist` e `.env`). Quem receber roda `npm install`.

---

## 5. Entendendo o projeto

### Pastas e arquivos
| Caminho | Para que serve |
|---|---|
| `index.html` | Página única do app; carrega `src/main.jsx` e as fontes. |
| `src/main.jsx` | Ponto de entrada: renderiza o `<App />` na tela. |
| `src/App.jsx` | Componente raiz: envolve tudo com o `AuthProvider` e mostra as rotas. |
| `src/routes/AppRoutes.jsx` | **Arquivo de rotas separado** (exigência do professor). Liga cada URL a uma página. |
| `src/pages/Cadastro.jsx` | Página 1: formulário com 5 campos e botão Cadastrar. |
| `src/pages/Login.jsx` | Página 2: e-mail, senha e botão Entrar. |
| `src/pages/Principal.jsx` | Página 3: mostra nome, sobrenome e data de nascimento + botão Sair. |
| `src/services/firebase.js` | Conexão com o Firebase; exporta `auth` e `db`. Lê as credenciais do `.env`. |
| `src/contexts/AuthContext.jsx` | Guarda "quem é o usuário logado" e o estado de carregamento. |
| `src/components/` | Peças reutilizáveis: `Field` (campo), `Alert` (mensagens), `AuthLayout` (visual de Cadastro/Login), `PrivateRoute` (proteção da Principal). |
| `src/utils/helpers.js` | Mensagens de erro em português, validação de e-mail e formatação de data. |
| `src/index.css` | Estilos de todas as páginas. |
| `.env.example` / `.env` | Modelo das credenciais / suas credenciais reais (não vai para o GitHub). |
| `firestore.rules` | Regras de segurança para colar no Console do Firebase. |
| `vercel.json` | Faz as rotas funcionarem ao recarregar a página na Vercel. |

### Como funciona o cadastro
1. Você preenche os 5 campos; cada um é guardado em um *state* do React (`useState`), como na Unidade 4.
2. Ao clicar em **Cadastrar**, o código valida os campos (obrigatórios, e-mail válido, senha com 6+ caracteres, data não futura).
3. Chama `createUserWithEmailAndPassword(auth, email, senha)`. O Firebase cria a conta e devolve o usuário com o **UID**.
4. Chama `setDoc(doc(db, 'usuarios', uid), {...})` para salvar `uid`, `nome`, `sobrenome`, `dataNascimento` e `email` no Firestore. A **senha não é salva aí**: ela fica só no Authentication.
5. Se o passo 4 falhar, a conta criada é removida para não ficar pela metade. Se der certo, vai para o Login com mensagem de sucesso.

### Firebase Authentication
É o serviço que guarda quem pode entrar: e-mail e senha (criptografada e gerenciada pelo Google). Ele verifica credenciais, mantém a sessão do navegador e gera o UID de cada usuário.

### Firestore e UID
O Firestore é o banco NoSQL (coleções → documentos, como na Unidade 6). Aqui há a coleção `usuarios`, com **um documento por pessoa**.
O **UID** é o identificador único e permanente gerado pelo Authentication. Usá-lo como id do documento liga as duas partes: "esta conta de login" ↔ "estes dados pessoais". Também permite buscar os dados direto, sem filtros, e permite a regra de segurança "só acesso o documento cujo id é o meu UID".

### Como funciona o login
Em **Entrar**, `signInWithEmailAndPassword(auth, email, senha)` pergunta ao Firebase se os dados conferem. Se sim, vai para `/principal`. Se não (usuário inexistente ou senha errada), aparece "Usuário não cadastrado ou dados de acesso incorretos." Não há validação simulada no JavaScript.

### Como o app sabe quem está logado
O `AuthContext` usa `onAuthStateChanged`, que avisa sempre que o login muda (inclusive ao recarregar a página, pois o Firebase lembra a sessão). Enquanto o Firebase verifica, `carregando` fica `true`, e a `PrivateRoute` mostra "Verificando sessão…" em vez de mandar o usuário para o Login por engano.

### Como os dados aparecem na Principal
A página pega `user.uid` do contexto, executa `getDoc(doc(db, 'usuarios', user.uid))` (uma Promise, como na Unidade 6), guarda o resultado no state e exibe nome, sobrenome e data. O botão **Sair** chama `signOut(auth)` e volta ao Login.

### Navegação
`AppRoutes.jsx` usa `BrowserRouter` e `Route` (Unidade 5). Rotas: `/cadastro`, `/login`, `/principal` (protegida) e `/` (redireciona para o Login). Os links entre páginas usam `<Link to="...">` e, após ações, `useNavigate()`.

### Diferenças em relação às aulas (para você saber explicar)
- **Firebase v9+ (modular)**: a aula usa `firebase@8.9.1` com `firebase.auth()`. Hoje o padrão é `import { getAuth } ...`. A lógica é a mesma.
- **React Router v6**: usa `<Routes>` e `element={<Pagina />}` no lugar de `component={Pagina}` e `exact`.
- **Componentes de função e Hooks** (`useState`, `useEffect`) no lugar de classes com `this.state`. A Unidade 2 também ensina componentes de função.
- **Vite** no lugar do `create-react-app` (pedido no enunciado do prompt): `npm run dev` no lugar de `npm start`.
