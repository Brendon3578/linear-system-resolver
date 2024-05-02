/**
 * Função responsável por exibir uma mensagem informativa, de alerta ou executar uma operação de espera ou armazenamento.
 * @typedef {("info"|"determinant"|"output"|"storage"|"start"|"round")} ActionType
 */

const LOG_COLORS = {
  start: "#3498db", // azul
  determinant: "#e67e22", // laranja
  output: "#b07cc6", // roxo
  storage: "#2ecc71", // verde
  info: "#f1c40f", // amarelo
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
 * Verifica se um número é Infinity ou -Infinity.
 * @param {number} number O número a ser verificado.
 * @returns {boolean} Retorna true se o número for Infinity ou -Infinity, caso contrário, retorna false.
 * @example
 * // Retorna true
 * console.log(isInfinity(Infinity));
 * // Retorna false
 * console.log(isInfinity(-5));
 */
const isInfinity = (number) => !isFinite(number);

/**
 * Verifica se um determinante dado não é igual a zero.
 * @param {number} det O valor do determinante a ser verificado.
 * @returns {boolean} Retorna true se o determinante não for zero, false caso contrário.
 */
const isDeterminantNotEqualsZero = (det) => det !== 0;

// Expressão regular para verificar o padrão da equação
const equationPattern = /^(-?\d*x)?([-+]\d*y)?([-+]\d*z)?=?(-?\d+)$/;
/**
 * Verifica se uma equação linear é válida.
 * @param {string} eq A equação linear a ser validada.
 * @returns {boolean} true se a equação for válida, false caso contrário.
 */
function isEquationValid(eq) {
  // Remove espaços em branco
  eq = eq.replace(/\s/g, "");

  // Testar se a equação corresponde ao padrão
  if (equationPattern.test(eq)) {
    return true; // A equação é válida
  } else {
    return false; // A equação é inválida
  }
}

/**
 * Gera um número aleatório dentro de um intervalo específico.
 * @param {number} min O valor mínimo do intervalo (incluído).
 * @param {number} max O valor máximo do intervalo (excluído).
 * @returns {number} Um número aleatório dentro do intervalo especificado.
 */
function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// export {
//   isMatrixNxN,
//   isNumber,
//   log,
//   writeMatrix,
//   elementExists,
//   roundToThreeDecimalPlaces,
//   isDeterminantEqualsZero,
//   isDeterminantNotEqualsZero,
//   areAllDeterminantsZero,
//   hasDeterminantsNotEqualsZero,
//   isInfinity,
//   isEquationValid,
//   generateRandomNumber,
// };
