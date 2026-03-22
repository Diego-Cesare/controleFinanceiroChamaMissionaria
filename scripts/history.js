// Importa função que escuta mudanças em uma coleção (provavelmente Firestore em tempo real)
import { escutarColecao } from "./services.js";

// Importa utilitários de formatação
import { formatarMoeda, formatarData } from "./helpers.js";

// Array global que armazena todos os registros (dízimos, ofertas, despesas)
let historico = [];

// Estado do filtro atual (controla o que será exibido)
let filtroAtual = "todos";

// 🔥 Função responsável por carregar e escutar todas as coleções
function carregarHistorico() {
  // Itera sobre as coleções financeiras
  ["dizimos", "ofertas", "despesas"].forEach((colecao) => {
    // Escuta mudanças em tempo real (onSnapshot ou equivalente)
    escutarColecao(colecao, ({ dados }) => {
      // Remove do histórico os dados antigos dessa coleção
      // Isso evita duplicidade ao receber atualização em tempo real
      historico = historico.filter((i) => i.tipo !== colecao);

      // Adiciona a propriedade "tipo" em cada item para padronizar os dados
      const formatados = dados.map((d) => ({
        ...d,
        tipo: colecao,
      }));

      // Insere os novos dados no histórico global
      historico.push(...formatados);

      // Re-renderiza a interface sempre que houver atualização
      renderHistorico();
    });
  });
}

// Função responsável por renderizar o histórico na tela
function renderHistorico() {
  const lista = document.getElementById("listaHistorico");
  if (!lista) return; // Evita erro caso o elemento não exista

  // Limpa a lista antes de renderizar novamente
  lista.innerHTML = "";

  // Aplica filtro selecionado
  const filtrados =
    filtroAtual === "todos"
      ? historico
      : historico.filter((i) => i.tipo === filtroAtual);

  // Ordena por data (mais recente primeiro)
  filtrados.sort((a, b) => new Date(b.data) - new Date(a.data));

  // Percorre os itens filtrados e cria os elementos HTML
  filtrados.forEach((item) => {
    const div = document.createElement("div");
    div.className = "dizimo-item"; // Classe base do item

    // Estrutura HTML do item
    div.innerHTML = `
      <div class="linha">
        <strong>${item.nome || item.tipo}</strong>
        <small class="small-tipo">${item.tipo}</small>
      </div>
      <div class="linha info">
        <span>${formatarMoeda(item.valor)}</span>
        <span>${formatarData(item.data)}</span>
      </div>
    `;

    // Adiciona o item na lista
    lista.appendChild(div);

    // Seleciona o badge de tipo (dízimo, oferta, despesa)
    const badge = div.querySelector(".small-tipo");

    // Aplica cores dinâmicas conforme o tipo
    if (item.tipo === "despesas") {
      badge.style.backgroundColor = "var(--red-hover)";
      badge.style.color = "var(--red)";
    }

    if (item.tipo === "dizimos") {
      badge.style.backgroundColor = "var(--green-hover)";
      badge.style.color = "var(--green)";
    }

    if (item.tipo === "ofertas") {
      badge.style.backgroundColor = "var(--accent-hover)";
      badge.style.color = "var(--accent)";
    }
  });
}

// Controle dos botões de filtro
document.querySelectorAll(".filtros button").forEach((btn) => {
  btn.addEventListener("click", () => {
    // Remove estado ativo de todos os botões
    document
      .querySelectorAll(".filtros button")
      .forEach((b) => b.classList.remove("active"));

    // Ativa o botão clicado
    btn.classList.add("active");

    // Atualiza o filtro atual com base no atributo data-filter
    filtroAtual = btn.dataset.filter;

    // Re-renderiza a lista com o novo filtro
    renderHistorico();
  });
});

// Exportação para Excel
document.getElementById("exportarExcel").addEventListener("click", () => {
  // Validação: evita exportar vazio
  if (!historico.length) {
    alert("Nenhum dado para exportar");
    return;
  }

  // Mapeia os dados para um formato mais amigável para planilha
  const dados = historico.map((item) => ({
    Tipo: item.tipo,
    Nome: item.nome || "-",
    Valor: item.valor,
    Data: item.data,
  }));

  // Cria planilha (worksheet)
  const ws = XLSX.utils.json_to_sheet(dados);

  // Cria arquivo (workbook)
  const wb = XLSX.utils.book_new();

  // Adiciona a planilha ao arquivo
  XLSX.utils.book_append_sheet(wb, ws, "Historico");

  // Faz download do arquivo Excel
  XLSX.writeFile(wb, "historico_financeiro.xlsx");
});

// Inicializa o carregamento dos dados ao abrir a página
carregarHistorico();
