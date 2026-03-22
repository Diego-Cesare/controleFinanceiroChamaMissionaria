// Importa a função para inicializar o app Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";

// Importa o módulo do Firestore (banco de dados NoSQL do Firebase)
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

// Configuração do seu projeto Firebase
// Esses dados identificam sua aplicação dentro da infraestrutura do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD...", // Chave pública de autenticação da API (não é segredo crítico, mas evite expor desnecessariamente)
  authDomain: "nono-259e9.firebaseapp.com", // Domínio usado para autenticação (login, OAuth, etc.)
  projectId: "nono-259e9", // ID único do projeto no Firebase
  storageBucket: "nono-259e9.firebasestorage.app", // Bucket para armazenamento de arquivos (Firebase Storage)
  messagingSenderId: "23109162051", // ID usado para serviços de mensageria (Firebase Cloud Messaging)
  appId: "1:23109162051:web:85c15d1244f385455870f6", // Identificador único da aplicação
};

// Inicializa o app Firebase com as configurações acima
const app = initializeApp(firebaseConfig);

// Inicializa o Firestore vinculado ao app
// 'db' será usado para fazer operações no banco (CRUD)
const db = getFirestore(app);

// Exporta a instância do banco para ser reutilizada em outros arquivos do projeto
export { db };
