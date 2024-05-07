// Verifica se o usuário prefere o tema escuro
const prefersDarkMode =
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

// Define o tema inicial com base nas preferências do usuário
const isDarkModeInitialTheme =
  localStorage.theme === "dark" || (!localStorage.theme && prefersDarkMode);

// Aplica o tema inicial
applyTheme(isDarkModeInitialTheme);

// Função para aplicar o tema escuro ou claro
function applyTheme(isDarkMode) {
  const root = document.documentElement;
  root.classList.toggle("dark", isDarkMode);
  localStorage.theme = isDarkMode ? "dark" : "light";
  log("dark", `Tema alterado para o modo ${isDarkMode ? "dark" : "light"}`);
}

// Alterna entre os modos escuro e claro
function toggleDarkMode() {
  const isDarkMode = document.documentElement.classList.contains("dark");
  applyTheme(!isDarkMode);
}

// Adiciona um evento de clique para alternar o modo escuro
const darkModeButton = document.getElementById("switch-dark-mode");
darkModeButton.addEventListener("click", toggleDarkMode);
