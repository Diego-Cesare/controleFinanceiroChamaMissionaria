import { salvarDocumento } from "./services.js";
import { renderLista } from "./ui.js";

/* ================== CORE ================== */

// Função genérica para salvar qualquer tipo de registro
async function handleSalvar({ collection, campos, modalId }) {
  const dados = {};

  for (const campo of campos) {
    const el = document.getElementById(campo.id);
    if (!el) continue;

    let valor = el.value;

    // Tratamento por tipo
    if (campo.tipo === "number") {
      valor = parseFloat(valor);
      if (isNaN(valor)) {
        alert("Valor inválido");
        return;
      }
    } else {
      valor = valor.trim();
    }

    // Validação obrigatória
    if (!valor) {
      alert("Preencha todos os campos!");
      return;
    }

    dados[campo.nome] = valor;
  }

  // Persistência
  const ok = await salvarDocumento(collection, dados);
  if (!ok) return;

  // Pós-processamento UI
  limparCampos(campos.map((c) => c.id));
  fecharModal(modalId);
}

/* ================== EVENTOS ================== */

// Dízimo
document.getElementById("salvarDizimo").addEventListener("click", () =>
  handleSalvar({
    collection: "dizimos",
    modalId: "modalDizimo",
    campos: [
      { id: "nomeDizimo", nome: "nome" },
      { id: "valorDizimo", nome: "valor", tipo: "number" },
      { id: "dataDizimo", nome: "data" },
    ],
  }),
);

// Despesas
document.getElementById("salvarDespesas").addEventListener("click", () =>
  handleSalvar({
    collection: "despesas",
    modalId: "modalDespesas",
    campos: [
      { id: "nomeDespesa", nome: "nome" },
      { id: "valorDespesa", nome: "valor", tipo: "number" },
      { id: "dataDespesa", nome: "data" },
    ],
  }),
);

// Ofertas (sem nome)
document.getElementById("salvarOferta").addEventListener("click", () =>
  handleSalvar({
    collection: "ofertas",
    modalId: "modalOfertas",
    campos: [
      { id: "valorOferta", nome: "valor", tipo: "number" },
      { id: "dataOferta", nome: "data" },
    ],
  }),
);

/* ================== INIT ================== */

// Configuração declarativa das listas
const listasConfig = [
  {
    collectionName: "dizimos",
    listaId: "listaDizimos",
    viewSelector: '[data-view="dizimos"]',
    mostrarNome: true,
  },
  {
    collectionName: "despesas",
    listaId: "listaDespesas",
    viewSelector: '[data-view="despesas"]',
    mostrarNome: true,
  },
  {
    collectionName: "ofertas",
    listaId: "listaOfertas",
    viewSelector: '[data-view="ofertas"]',
  },
];

// Inicializa todas as listas dinamicamente
listasConfig.forEach(renderLista);

/* ================== HELPERS UI ================== */

function limparCampos(ids) {
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
}

function fecharModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove("active");
}
