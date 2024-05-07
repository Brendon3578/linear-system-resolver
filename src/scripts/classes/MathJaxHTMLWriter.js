// import { elementExists, isNumber } from "../utils.js";

/**
 * Classe para escrever representações HTML de sistemas lineares usando MathJax.
 */
class MathJaxHTMLWriter {
  #matrixIllustrationEl;
  #linearSystemIllustrationEl;
  #isMathJaxConnected = true;

  /**
   * Cria uma instância de MathJaxHTMLWriter.
   * @param {HTMLElement} matrixIllustrationEl - O elemento HTML onde a representação da matriz será desenhada.
   * @param {HTMLElement} linearSystemIllustrationEl - O elemento HTML onde a representação do sistema linear será desenhada.
   * @throws {Error} Se os elementos fornecidos não existirem.
   */
  constructor(matrixIllustrationEl, linearSystemIllustrationEl) {
    if (
      (elementExists(matrixIllustrationEl) &&
        elementExists(linearSystemIllustrationEl)) == false
    ) {
      throw new Error(
        "Elementos do MathJaxHTMLWriter não foram definidos corretamente!"
      );
    }
    this.#matrixIllustrationEl = matrixIllustrationEl;
    this.#linearSystemIllustrationEl = linearSystemIllustrationEl;

    this.drawInitial2x2MatrixRepresentationAndLinearSystem();
  }

  /**
   * Atualiza o display engine MathJax no HTML.
   * @returns {Promise<void>} Uma promessa que é resolvida quando a renderização é concluída.
   */
  async updateMathJax() {
    try {
      await MathJax.typesetPromise();
      this.#isMathJaxConnected = true;
    } catch (e) {
      if (this.#isMathJaxConnected) {
        window.alert(
          [
            "É necessário estar conectado à internet para que seja utilizado a biblioteca MathJax",
            "Ela é necessária para poder escrever as matrizes e os sistemas lineares",
          ].join("\n")
        );
        this.#linearSystemIllustrationEl.innerHTML = "";
        this.#matrixIllustrationEl.innerHTML = "";
      }
      console.log(e);
      this.#isMathJaxConnected = false;
    }
  }

  /**
   * Desenha a representação inicial de uma matriz 2x2 e um sistema linear.
   */
  drawInitial2x2MatrixRepresentationAndLinearSystem() {
    if (!this.#isMathJaxConnected) return;

    const initialCoefficientMatrix = [
      ["a", "b"],
      ["c", "d"],
    ];

    const initialConstantMatrix = ["1", "2"];

    this.drawn2x2MatrixRepresentation(
      initialCoefficientMatrix,
      initialConstantMatrix
    );
    this.drawn2x2LinearSystem(initialCoefficientMatrix, initialConstantMatrix);
  }

  /**
   * Desenha a representação inicial de uma matriz 3x3 e um sistema linear.
   */
  drawInitial3x3MatrixRepresentationAndLinearSystem() {
    if (!this.#isMathJaxConnected) return;

    const initialCoefficientMatrix = [
      ["a", "b", "c"],
      ["d", "e", "f"],
      ["g", "h", "i"],
    ];

    const initialConstantMatrix = ["1", "2", "3"];

    this.drawn3x3MatrixRepresentation(
      initialCoefficientMatrix,
      initialConstantMatrix
    );
    this.drawn3x3LinearSystem(initialCoefficientMatrix, initialConstantMatrix);
  }

  /**
   * Converte os elementos de uma matriz em strings e formata para a exibição, dependendo da posição do valor de cada elemento.
   * @param {Array<Array<number|string>>} matrix - A matriz a ser processada.
   * @returns {Array<Array<string>>} Uma nova matriz onde cada elemento é uma representação em forma de string dos elementos da matriz original.
   */
  #stringifyMatrixElements(matrix) {
    const modifiedMatrix = matrix.map((array, rowIndex) => {
      return array.map((value, columnIndex) => {
        // Se for o primeiro elemento da linha, converte para string e retorna
        if (columnIndex === 0) {
          // não mostrar 1x, mas sim apenas a incógnita x
          // console.log(value);
          if (value == -1 || value == 1) {
            if (value.toString() == "1") return " ";
            if (value.toString() == "-1") return "-";
          }
          return `${value}`;
        }

        // Verifica se o valor do elemento em questão da matrix é um número
        if (isNumber(value)) {
          // não mostrar 1x, mas sim apenas a incógnita x
          if (value == 1) return "+ ";
          if (value == -1) return "-";
          // Se for um número, verifica se é menor que 0, se for retorna o valor em string,
          // caso contrário retorna o valor em string junto com o símbolo de '+' pré-fixado
          return value < 0 ? `${value}` : `+ ${value}`;
        } else {
          // Se for uma string, verifica se a string contêm o sinal de '-', se tiver apenas retorna o valor,
          // caso contrário retorna o valor junto com o símbolo de '+' pré-fixado
          return value.includes("-") ? `${value}` : `+ ${value}`;
        }
      });
    });

    return modifiedMatrix;
  }

  /**
   * Desenha a representação matricial de uma matriz 2x2.
   * @param {Array<Array<number|string>>} coefficientMatrix - A matriz de coeficientes.
   * @param {Array<string>} constantMatrix - A matriz de constantes.
   */
  drawn2x2MatrixRepresentation(coefficientMatrix, constantMatrix) {
    if (!this.#isMathJaxConnected) return;

    const [a, b] = coefficientMatrix[0];
    const [c, d] = coefficientMatrix[1];
    const [x, y] = constantMatrix;
    this.#matrixIllustrationEl.innerHTML = `
    \\( \\begin{bmatrix} ${a} & ${b}\\\\ ${c} & ${d}\
      \\end{bmatrix}\\times\\begin{bmatrix} x\\\\ y
      \\end{bmatrix}=\\begin{bmatrix} ${x}\\\\${y} \\end{bmatrix} \\)
    `;
  }

  /**
   * Escreve a representação de uma matriz 2x2.
   * @param {Array<Array<number|string>>} matrix - A matriz a ser representada.
   * @returns {string} A representação escrita em MathJax da matriz.
   */
  write2x2Matrix(matrix) {
    if (!this.#isMathJaxConnected) return;

    const [a, b] = matrix[0];
    const [c, d] = matrix[1];
    return `
    \\( \\begin{bmatrix} ${a} & ${b}\\\\ ${c} & ${d}\
      \\end{bmatrix} \\)`;
  }

  /**
   * Escreve a representação de uma matriz 3x3.
   * @param {Array<Array<number|string>>} matrix - A matriz a ser representada.
   * @returns {string} A representação escrita em MatJax da matriz.
   */
  write3x3Matrix(matrix) {
    if (!this.#isMathJaxConnected) return;

    const [a, b, c] = matrix[0];
    const [d, e, f] = matrix[1];
    const [g, h, i] = matrix[2];
    return `
    \\( \\begin{bmatrix} ${a} & ${b} & ${c}\\\\ ${d} & ${e} & ${f}\\\\ ${g} & ${h} & ${i}\
      \\end{bmatrix} \\)`;
  }

  /**
   * Desenha a representação de uma matriz 3x3.
   * @param {Array<Array<number|string>>} coefficientMatrix - A matriz de coeficientes.
   * @param {Array<string>} constantMatrix - A matriz de constantes.
   */
  drawn3x3MatrixRepresentation(coefficientMatrix, constantMatrix) {
    if (!this.#isMathJaxConnected) return;

    const [a, b, c] = coefficientMatrix[0];
    const [d, e, f] = coefficientMatrix[1];
    const [g, h, i] = coefficientMatrix[2];
    const [x, y, z] = constantMatrix;
    this.#matrixIllustrationEl.innerHTML = `
    \\( \\begin{bmatrix} ${a} & ${b} & ${c}\\\\ ${d} & ${e} & ${f}\\\\ ${g} & ${h} & ${i}\
      \\end{bmatrix}\\times\\begin{bmatrix} x\\\\ y\\\\ z
      \\end{bmatrix}=\\begin{bmatrix} ${x}\\\\${y}\\\\${z} \\end{bmatrix} \\)
    `;
  }

  /**
   * Desenha a representação de um sistema linear 2x2.
   * @param {Array<Array<number|string>>} coefficientMatrix - A matriz de coeficientes.
   * @param {Array<string>} constantMatrix - A matriz de constantes.
   */
  drawn2x2LinearSystem(coefficientMatrix, constantMatrix) {
    if (!this.#isMathJaxConnected) return;

    const matrix = this.#stringifyMatrixElements(coefficientMatrix.slice());

    let [a, b] = matrix[0];
    let [c, d] = matrix[1];
    let [x, y] = constantMatrix;

    this.#linearSystemIllustrationEl.innerHTML = `
    \\( \\left\\{\\begin{matrix} ${a}x ${b}y & = ${x} \\\\ ${c}x ${d}y & = ${y}
      \\end{matrix}\\right. \\)
    `;
    this.updateMathJax();
  }

  /**
   * Desenha a representação de um sistema linear 3x3.
   * @param {Array<Array<number|string>>} coefficientMatrix - A matriz de coeficientes.
   * @param {Array<string>} constantMatrix - A matriz de constantes.
   */
  drawn3x3LinearSystem(coefficientMatrix, constantMatrix) {
    if (!this.#isMathJaxConnected) return;

    const matrix = this.#stringifyMatrixElements(coefficientMatrix.slice());

    const [a, b, c] = matrix[0];
    const [d, e, f] = matrix[1];
    const [g, h, i] = matrix[2];
    const [x, y, z] = constantMatrix;

    this.#linearSystemIllustrationEl.innerHTML = `
    \\( \\left\\{\\begin{matrix} ${a}x ${b}y ${c}z & = ${x} \\\\ ${d}x ${e}y ${f}z & = ${y} \\\\ ${g}x ${h}y ${i}z & = ${z}
      \\end{matrix}\\right. \\)
    `;

    this.updateMathJax();
  }
}

// export { MathJaxHTMLWriter };
