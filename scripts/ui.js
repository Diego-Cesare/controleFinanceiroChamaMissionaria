import { formatarMoeda, formatarData } from "./helpers.js";
import { escutarColecao } from "./services.js";
import { deletarDocumento } from "./services.js";

// Estado central dos totais
let totais = {
  dizimos: 0,
  ofertas: 0,
  despesas: 0,
};

export function renderLista({
  collectionName,
  listaId,
  viewSelector,
  mostrarNome = false,
}) {
  const lista = document.getElementById(listaId);
  if (!lista) return;

  // 🔥 Evita múltiplos listeners duplicados
  if (!lista.dataset.listener) {
    lista.addEventListener("click", async (e) => {
      const btn = e.target.closest(".btn-delete");
      if (!btn) return;

      const id = btn.dataset.id;

      const confirmacao = confirm("Excluir este item?");
      if (!confirmacao) return;

      const ok = await deletarDocumento(collectionName, id);

      if (!ok) alert("Erro ao deletar");
    });

    lista.dataset.listener = "true";
  }

  escutarColecao(
    collectionName,
    ({ dados, totalDizimistas, totalRegistros }) => {
      let total = 0;
      const fragment = document.createDocumentFragment();

      dados.forEach((d) => {
        const valor = Number(d.valor) || 0;
        total += valor;

        const item = document.createElement("div");
        item.className = "dizimo-item";

        // Nome
        const nome = document.createElement("strong");
        nome.textContent = mostrarNome ? d.nome || "-" : "Oferta";

        // 🔥 Botão delete
        const btnDelete = document.createElement("button");
        btnDelete.className = "btn-delete";
        btnDelete.dataset.id = d.id;
        btnDelete.textContent = "Remover";

        const linha1 = document.createElement("div");
        linha1.className = "linha linha-topo";
        linha1.appendChild(nome);
        linha1.appendChild(btnDelete);

        // Valor
        const valorSpan = document.createElement("span");
        valorSpan.textContent = formatarMoeda(valor);

        // Data
        const dataSpan = document.createElement("span");
        dataSpan.textContent = formatarData(d.data);

        const linha2 = document.createElement("div");
        linha2.className = "linha info";
        linha2.appendChild(valorSpan);
        linha2.appendChild(dataSpan);

        item.appendChild(linha1);
        item.appendChild(linha2);

        fragment.appendChild(item);
      });

      lista.innerHTML = "";
      lista.appendChild(fragment);

      atualizarTotal(viewSelector, total);
      atualizarCardTotal(collectionName, total);

      atualizarMetricas(collectionName, {
        totalDizimistas,
        totalRegistros,
      });
    },
  );
}
/* ================== UI ================== */

function atualizarTotal(viewSelector, total) {
  const el = document.querySelector(`${viewSelector} .page-titulo strong`);
  if (el) el.textContent = formatarMoeda(total);
}

function atualizarCardTotal(collectionName, total) {
  const map = {
    dizimos: "totalDeDizimo",
    ofertas: "totalDeOfertas",
    despesas: "totalDeDespesas",
  };

  const el = document.getElementById(map[collectionName]);
  if (el) el.textContent = formatarMoeda(total);

  totais[collectionName] = total;
  atualizarSaldo();
}

function atualizarMetricas(
  collectionName,
  { totalDizimistas, totalRegistros },
) {
  if (collectionName === "dizimos") {
    const el = document.getElementById("dizimistasTotal");
    if (el) el.textContent = totalDizimistas ?? 0;
  }

  if (collectionName === "ofertas") {
    const el = document.getElementById("ofertasTotal");
    if (el) el.textContent = totalRegistros ?? 0;
  }

  if (collectionName === "despesas") {
    const el = document.getElementById("despesasTotal");
    if (el) el.textContent = totalRegistros ?? 0;
  }
}

function atualizarSaldo() {
  const dizimos = totais.dizimos || 0;
  const ofertas = totais.ofertas || 0;
  const despesas = totais.despesas || 0;

  const saldoTotal = dizimos + ofertas;
  const saldoAtual = saldoTotal - despesas;

  const st = document.getElementById("saldoTotal");
  const sa = document.getElementById("saldoAtual");

  if (st) st.textContent = formatarMoeda(saldoTotal);
  if (sa) sa.textContent = formatarMoeda(saldoAtual);
}
