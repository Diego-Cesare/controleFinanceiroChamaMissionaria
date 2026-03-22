const buttons = document.querySelectorAll("footer button");
const views = document.querySelectorAll("[data-view]");

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.target;

    // remove active de tudo
    views.forEach((view) => view.classList.remove("active"));

    // ativa a view correta
    const targetView = document.querySelector(`[data-view="${target}"]`);

    if (targetView) {
      targetView.classList.add("active");
    }
  });
});

function ativarView(target) {
  // 🔁 Esconde todas as views
  views.forEach((view) => {
    view.classList.remove("active");
  });

  // ✅ Mostra a view correta
  const viewAtiva = document.querySelector(`[data-view="${target}"]`);
  if (viewAtiva) viewAtiva.classList.add("active");

  // 🎯 Atualiza botão ativo
  buttons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.target === target);
  });
}

// Evento de clique
buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    ativarView(btn.dataset.target);
  });
});
