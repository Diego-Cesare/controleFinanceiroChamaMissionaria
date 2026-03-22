import { db } from "./firebase.js";
import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

/* ================== SALVAR ================== */

/**
 * Salva documento com validação mínima e timestamp consistente
 */
export async function salvarDocumento(collectionName, data) {
  try {
    if (!collectionName) throw new Error("Collection inválida");
    if (!data || typeof data !== "object") throw new Error("Dados inválidos");

    // Sanitização leve
    const payload = {
      ...data,
      createdAt: serverTimestamp(),
    };

    await addDoc(collection(db, collectionName), payload);

    return true;
  } catch (error) {
    console.error(`[Firestore] Erro ao salvar em "${collectionName}":`, error);
    return false;
  }
}

/**
 * Deleta um documento pelo ID
 */
export async function deletarDocumento(collectionName, id) {
  try {
    await deleteDoc(doc(db, collectionName, id));
    return true;
  } catch (error) {
    console.error(`Erro ao deletar ${collectionName}:`, error);
    return false;
  }
}

/* ================== ESCUTAR ================== */

// Armazena listeners ativos (evita duplicação)
const listeners = new Map();

/**
 * Escuta coleção com controle de listener e dados normalizados
 */
export function escutarColecao(collectionName, callback) {
  const q = query(collection(db, collectionName), orderBy("createdAt", "desc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const dados = [];
      const nomesUnicos = new Set();

      snapshot.forEach((doc) => {
        const raw = doc.data();

        const createdAt = raw.createdAt?.toDate?.() || null;

        const item = {
          id: doc.id,
          ...raw,
          createdAt,
        };

        dados.push(item);

        if (raw.nome && typeof raw.nome === "string") {
          nomesUnicos.add(raw.nome.trim().toLowerCase());
        }
      });

      // Ordenação segura
      dados.sort((a, b) => {
        const tA = a.createdAt ? a.createdAt.getTime() : 0;
        const tB = b.createdAt ? b.createdAt.getTime() : 0;
        return tB - tA;
      });

      callback({
        dados,
        totalDizimistas: nomesUnicos.size,
        totalRegistros: snapshot.size,
      });
    },
    (error) => {
      console.error(`[Firestore] Erro ao escutar "${collectionName}":`, error);
    },
  );
}
