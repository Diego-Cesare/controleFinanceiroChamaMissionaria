// Função utilitária para formatar valores numéricos em moeda brasileira (Real - BRL)
export const formatarMoeda = (valor) =>
  valor.toLocaleString("pt-BR", {
    style: "currency", // Define o formato como moeda
    currency: "BRL", // Define a moeda como Real brasileiro
  });

// Função utilitária para formatar datas no padrão brasileiro
export const formatarData = (dataString) => {
  // Converte a string recebida em um objeto Date
  const data = new Date(dataString);

  // Retorna a data formatada no padrão: "dd de mês por extenso de aaaa"
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit", // Dia com dois dígitos (ex: 05)
    month: "long", // Mês por extenso (ex: março)
    year: "numeric", // Ano completo (ex: 2026)
  });
};
