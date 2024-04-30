/**
 * Função responsável por exibir uma mensagem informativa, de alerta ou executar uma operação de espera ou armazenamento.
 * @typedef {("info"|"determinant"|"output"|"storage"|"start"|"round")} ActionType
 */

const LOG_COLORS = {
  info: "#3498db", // azul
  determinant: "#e67e22", // laranja
  output: "#b07cc6", // roxo
  storage: "#2ecc71", // verde
  start: "#f1c40f", // amarelo
};

/**
 * Função utilitária apenas para mostrar a mensagem no console de desenvolvedor.
 * @param {ActionType} type - O tipo da mensagem.
 * @param {string} message - A mensagem a ser registrada.
 */
function log(type, message) {
  const color = LOG_COLORS[type] || "#6789ab"; // cor padrão é cinza
  console.log(
    `%c[${type}]`,
    `color: ${color}; background-color: #111; padding: 2px; border-radius: 2px;`,
    `- ${message}`
  );
  // console.log(`[${type}] - ${message}`);
}

/**
 * Retorna a representação da matriz como uma única string formatada.
 * @param {Array<Array<any>>} matrix - A matriz a ser representada.
 * @returns {string} Uma string representando a matriz formatada.
 */
function writeMatrix(matriz) {
  return matriz.map((linha) => `[${linha.join(", ")}]`).join("\n");
}

/**
 * Verifica se uma matriz é uma matriz NxN (3x3, 2x2, etc).
 * @param {Array<Array<any>>} matrix - A matriz a ser verificada.
 * @param {number} size - O tamanho da matriz (número de linhas e colunas) Ex: 3 -> 3x3.
 * @returns {boolean} Retorna true se a matriz for uma matriz NxN, caso contrário, retorna false.
 */
function isMatrixNxN(matrix, size) {
  // Verifica se é uma matriz e se todos os arrays (vetores) têm o mesmo tamanho
  if (!Array.isArray(matrix) || !areArraysOfEqualSize(matrix)) {
    return false;
  }
  // Retorna true se a matriz tiver exatamente o tamanho definido no parâmetro 'size'
  // Retorna true se a matriz tiver exatamente 'n' linhas
  return matrix.length === size;
}

/**
 * Verifica se todos os arrays em uma matriz têm o mesmo tamanho.
 * @param {Array<Array<any>>} matrix - A matriz a ser verificada.
 * @returns {boolean} Retorna true se todos os arrays têm o mesmo tamanho, caso contrário, retorna false.
 */
function areArraysOfEqualSize(matrix) {
  // Se houver menos de dois arrays, não faz sentido comparar tamanhos
  if (matrix.length < 2) return true;
  // Verifica se todos os arrays têm o mesmo comprimento
  return matrix.every((arr) => arr.length === matrix[0].length);
}

/**
 * Verifica se um valor é um número.
 * @param {*} value - O valor a ser verificado.
 * @returns {boolean} true se o valor for um número, false caso contrário.
 */
function isNumber(value) {
  return typeof value === "number" && !isNaN(value);
}

/**
 * Arredonda um número de ponto flutuante para três casas decimais.
 * @param {number} numero - O número a ser arredondado.
 * @returns {number} Um número com apenas três casas decimais.
 */
function roundToThreeDecimalPlaces(number) {
  return Math.round(number * 1000) / 1000;
}

/**
 * Verifica se um elemento existe, ou seja, se não é nulo ou indefinido.
 * @param {HTMLElement | null} el - O elemento a ser verificado.
 * @returns {boolean} Retorna true se o elemento existir (não for nulo ou indefinido), caso contrário, retorna false.
 */
const elementExists = (el) => el != null;

/**
 * Verifica se um determinante dado é igual a zero.
 * @param {number} det O valor do determinante a ser verificado.
 * @returns {boolean} Retorna true se o determinante for zero, false caso contrário.
 */
const isDeterminantEqualsZero = (det) => det === 0;

/**
 * Verifica se todos os determinantes em um array são iguais a zero.
 * @param {number[]} determinants Um array contendo os determinantes a serem verificados.
 * @returns {boolean} Retorna true se todos os determinantes forem zero, false caso contrário.
 */
function areAllDeterminantsZero(determinants) {
  // Verifica se todos os elementos do array são iguais a zero
  return determinants.every((det) => isDeterminantEqualsZero(det));
}

/**
 * Verifica se há determinantes dentro de um array que não são iguais a zero.
 * @param {number[]} determinants Um array contendo os determinantes a serem verificados.
 * @returns {boolean} Retorna true se algum determinante não for zero, false caso contrário.
 */
function hasDeterminantsNotEqualsZero(determinants) {
  // Verifica se algum elemento do array não é igual a zero
  return determinants.some((det) => det !== 0);
}

/**
 * Verifica se um determinante dado não é igual a zero.
 * @param {number} det O valor do determinante a ser verificado.
 * @returns {boolean} Retorna true se o determinante não for zero, false caso contrário.
 */
const isDeterminantNotEqualsZero = (det) => det !== 0;

export {
  isMatrixNxN,
  isNumber,
  log,
  writeMatrix,
  elementExists,
  roundToThreeDecimalPlaces,
  isDeterminantEqualsZero,
  isDeterminantNotEqualsZero,
  areAllDeterminantsZero,
  hasDeterminantsNotEqualsZero,
};
