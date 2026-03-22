function setupModal(openBtnId, modalId, closeBtnId) {
  const openBtn = document.getElementById(openBtnId);
  const modal = document.getElementById(modalId);
  const closeBtn = document.getElementById(closeBtnId);

  if (!openBtn || !modal || !closeBtn) {
    console.warn("Modal não inicializado:", {
      openBtnId,
      modalId,
      closeBtnId,
    });
    return;
  }

  openBtn.addEventListener("click", () => {
    modal.classList.add("active");
  });

  closeBtn.addEventListener("click", () => {
    modal.classList.remove("active");
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
    }
  });
}
document.addEventListener("DOMContentLoaded", () => {
  setupModal("abrirModalDizimo", "modalDizimo", "fecharModal");
  setupModal("abrirModalOfertas", "modalOfertas", "fecharModalOfertas");
  setupModal("abrirModalDespesas", "modalDespesas", "fecharModalDespesas");
});
