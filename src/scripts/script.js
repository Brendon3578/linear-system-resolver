// import { MathJaxHTMLWriter } from "./classes/MathJaxHTMLWriter.js";
// import {
//   areAllDeterminantsZero,
//   generateRandomNumber,
//   hasDeterminantsNotEqualsZero,
//   isDeterminantEqualsZero,
//   isEquationValid,
//   isInfinity,
//   isNumber,
//   log,
//   roundToThreeDecimalPlaces,
//   writeMatrix,
// } from "./utils.js";

/**
 * @type { HTMLInputElement }
 */
const firstEquationEl = document.getElementById("equation1");
/**
 * @type { HTMLInputElement }
 */
const secondEquationEl = document.getElementById("equation2");
const thirdEquationEl = document.getElementById("equation3");
const statusMessageEl = document.getElementById("status-message");

const linearSystemDrawnEl = document.getElementById(
  "linear-system-illustration"
);
const matrixDrawnEl = document.getElementById("matrix-illustration");

const linearSystemSizeRadioButtonsEl = document.querySelectorAll(
  'input[name="sistema-tamanho"]'
);
const thirdEquationContainerEl = document.getElementById(
  "third-equation-label"
);

const resultListEl = document.getElementById("result-list");
const determinantListEl = document.getElementById("determinant-list");
const systemsClassificationTextEl = document.getElementById(
  "system-classification"
);

let is3x3LinearSystem = false;

const mathJaxHTMLWriter = new MathJaxHTMLWriter(
  matrixDrawnEl,
  linearSystemDrawnEl
);

function showStatusMessage(status, message) {
  statusMessageEl.classList.value = "";
  statusMessageEl.innerText = message;
  switch (status) {
    case "success":
      statusMessageEl.classList.value =
        "text-green-700 font-bold dark:text-green-400";
      break;
    case "error":
      statusMessageEl.classList.value =
        "text-red-600 font-bold dark:text-red-400";
      break;
  }
}

linearSystemSizeRadioButtonsEl.forEach((radioButtonEl) => {
  radioButtonEl.addEventListener("change", () => {
    let systemSize = radioButtonEl.value;

    if (systemSize == "2x2") {
      showThirdEquation(false);
      is3x3LinearSystem = false;
      firstEquationEl.placeholder = "Ex: 2x + 3y = 6";
      secondEquationEl.placeholder = "Ex: 4x - 2y = 8";
      mathJaxHTMLWriter.drawInitial2x2MatrixRepresentationAndLinearSystem();
    } else if (systemSize == "3x3") {
      showThirdEquation(true);
      is3x3LinearSystem = true;
      firstEquationEl.placeholder = "Ex: x + 2y + z = 2";
      secondEquationEl.placeholder = "Ex: 2x + y + 2z = 9";
      mathJaxHTMLWriter.drawInitial3x3MatrixRepresentationAndLinearSystem();
    }
  });
});

function showThirdEquation(show) {
  if (show) {
    thirdEquationContainerEl.classList.add("flex");
    thirdEquationContainerEl.classList.remove("hidden");
  } else {
    thirdEquationContainerEl.classList.remove("flex");
    thirdEquationContainerEl.classList.add("hidden");
  }
}

function solveSystem() {
  try {
    resultListEl.innerHTML = "";
    determinantListEl.innerHTML = "";
    systemsClassificationTextEl.innerHTML = "";

    const eq1 = firstEquationEl.value;
    const eq2 = secondEquationEl.value;

    const coeffs_eq1 = extractCoefficients(eq1, firstEquationEl);
    const coeffs_eq2 = extractCoefficients(eq2, secondEquationEl);

    let equationResultOutput = {
      classification: { type: "", message: "" },
      message: "",
      resolutions: [],
      determinants: [],
    };

    if (!is3x3LinearSystem) {
      const { resolutions, determinants, classification, message } =
        solve2x2System(coeffs_eq1, coeffs_eq2);

      equationResultOutput.resolutions = resolutions;
      equationResultOutput.determinants = determinants;
      equationResultOutput.classification = classification;
      equationResultOutput.message = message;
    } else {
      let eq3 = thirdEquationEl.value;
      const coeffs_eq3 = extractCoefficients(eq3, thirdEquationEl);
      const { resolutions, determinants, classification, message } =
        solve3x3System(coeffs_eq1, coeffs_eq2, coeffs_eq3);

      equationResultOutput.resolutions = resolutions;
      equationResultOutput.determinants = determinants;
      equationResultOutput.classification = classification;
      equationResultOutput.message = message;
    }

    equationResultOutput.resolutions.forEach((solution) => {
      let result = isNumber(solution.value)
        ? roundToThreeDecimalPlaces(solution.value)
        : solution.value;

      if (isInfinity(result) && !isNaN(result)) {
        // console.log(result);
        result = result.toString().replace("Infinity", "&infin;");
      } else if (isNaN(result)) {
        result = "Indeterminado";
      }

      const unknown = solution.unknown.toUpperCase();
      const determinantCalc = solution.determinantCalc;
      resultListEl.innerHTML += `<li title="Resultado de ${unknown} é igual a ${solution.value}">
      ${unknown} = <b class="font-bold">${result}</b> (${determinantCalc})</li>`;
    });

    equationResultOutput.determinants.forEach((determinant) => {
      const result = roundToThreeDecimalPlaces(determinant.result);
      const unknown = determinant.unknown.toUpperCase();
      determinantListEl.innerHTML += `
      <li
        class="flex flex-col gap-2 items-center justify-between rounded-md shadow-lg p-2 pb-4 border border-gray-400 w-full bg-gradient-to-t from-gray-200 to-white max-w-min dark:border-slate-700 dark:from-slate-900 dark:to-slate-800"
        title="Resultado da determinante de ${unknown} é igual a ${determinant.result}"
      >
        <span class="text-sm font-semibold whitespace-nowrap">Det. de ${unknown} = ${result}</span>
        <div>${determinant.matrixHTML}</div>
      </li>`;
    });

    let classificationTextColors = {
      SI: "text-violet-700 dark:text-violet-400",
      SPD: "text-teal-700 dark:text-teal-400",
      SPI: "text-blue-700 dark:text-blue-400",
    };

    let classificationTextColor =
      classificationTextColors[equationResultOutput.classification.type];

    systemsClassificationTextEl.innerHTML = `<span class=' ${classificationTextColor} font-bold'> ${equationResultOutput.classification.message} </span>`;
    mathJaxHTMLWriter.updateMathJax();

    showStatusMessage("success", equationResultOutput.message);
  } catch (e) {
    console.error(e.message);
    showStatusMessage(
      "error",
      e.message || "Não foi possível realizar o cálculo."
    );

    if (!is3x3LinearSystem)
      mathJaxHTMLWriter.drawInitial2x2MatrixRepresentationAndLinearSystem();
    else mathJaxHTMLWriter.drawInitial3x3MatrixRepresentationAndLinearSystem();
  }
}

const resolveSystemsButtonEl = document.getElementById("solve-system");
resolveSystemsButtonEl.addEventListener("click", solveSystem);

function solve2x2System(coeffs_eq1, coeffs_eq2) {
  log("determinant", "Será calculada a determinante da matriz A:");

  const [a, b] = coeffs_eq1.slice(0, 2);
  const [c, d] = coeffs_eq2.slice(0, 2);

  const x = coeffs_eq1[2];
  const y = coeffs_eq2[2];

  const determinantMainMatrix = [
    [a, b],
    [c, d],
  ];
  const detMain = calculateDeterminant2x2(determinantMainMatrix);

  const coefficientMatrix = determinantMainMatrix;
  const constantMatrix = [x, y];

  mathJaxHTMLWriter.drawn2x2MatrixRepresentation(
    coefficientMatrix,
    constantMatrix
  );
  mathJaxHTMLWriter.drawn2x2LinearSystem(coefficientMatrix, constantMatrix);

  const determinantXMatrix = [
    [x, b],
    [y, d],
  ];
  const determinantYMatrix = [
    [a, x],
    [c, y],
  ];

  // Verificar se deu erro no cálculo
  [a, b, c, d, x, y].forEach((number) => {
    if (!isNumber(number)) {
      throw new Error("As equações não foram digitadas corretamente!");
    }
  });

  log("determinant", "Será calculada a determinante da matriz X:");
  const detX = calculateDeterminant2x2(determinantXMatrix);

  log("determinant", "Será calculada a determinante da matriz Y:");
  const detY = calculateDeterminant2x2(determinantYMatrix);

  let determinantsOutput = [
    {
      unknown: "A",
      matrixHTML: mathJaxHTMLWriter.write2x2Matrix(determinantMainMatrix),
      result: detMain,
    },
    {
      unknown: "x",
      matrixHTML: mathJaxHTMLWriter.write2x2Matrix(determinantXMatrix),
      result: detX,
    },
    {
      unknown: "y",
      matrixHTML: mathJaxHTMLWriter.write2x2Matrix(determinantYMatrix),
      result: detY,
    },
  ];

  let classificationOutput = {
    type: "SPD",
    message: "Sistema Possível Determinado (SPD) - O sistema uma solução",
  };
  let messageOutput = "Cálculo realizado com sucesso";

  if (isDeterminantEqualsZero(detMain)) {
    if (areAllDeterminantsZero([detX, detY])) {
      classificationOutput.type = "SPI";
      classificationOutput.message =
        "Sistema Possível Indeterminado (SPI) - O sistema tem infinitas soluções";
    } else if (hasDeterminantsNotEqualsZero([detX, detY])) {
      classificationOutput.type = "SI";
      classificationOutput.message =
        "Sistema Impossível (SI) - O sistema não tem solução";
    }
  }

  const xResult = detX / detMain;
  const yResult = detY / detMain;

  log("output", `Resultado de X = ${xResult}`);
  log("output", `Resultado de Y = ${yResult}`);

  const equationResultOutput = {
    classification: classificationOutput,
    message: messageOutput,
    resolutions: [
      { unknown: "x", value: xResult, determinantCalc: `${detX} / ${detMain}` },
      { unknown: "y", value: yResult, determinantCalc: `${detY} / ${detMain}` },
    ],
    determinants: determinantsOutput,
  };

  return equationResultOutput;
}

function solve3x3System(coeffs_eq1, coeffs_eq2, coeffs_eq3) {
  const [a, b, c] = coeffs_eq1.slice(0, 3);
  const [d, e, f] = coeffs_eq2.slice(0, 3);
  const [g, h, i] = coeffs_eq3.slice(0, 3);

  const x = coeffs_eq1[3];
  const y = coeffs_eq2[3];
  const z = coeffs_eq3[3];

  const determinantMainMatrix = [
    [a, b, c],
    [d, e, f],
    [g, h, i],
  ];

  // Verificar se deu erro no cálculo
  [a, b, c, d, e, f, g, h, i, x, y, z].forEach((number) => {
    if (!isNumber(number)) {
      throw new Error("As equações não foram digitadas corretamente!");
    }
  });

  log("determinant", "Será calculada a determinante da matriz A:");
  const detMain = calculateDeterminant3x3(determinantMainMatrix);

  const coefficientMatrix = determinantMainMatrix;
  const constantMatrix = [x, y, z];

  mathJaxHTMLWriter.drawn3x3MatrixRepresentation(
    coefficientMatrix,
    constantMatrix
  );
  mathJaxHTMLWriter.drawn3x3LinearSystem(coefficientMatrix, constantMatrix);

  const determinantXMatrix = [
    [x, b, c],
    [y, e, f],
    [z, h, i],
  ];
  const determinantYMatrix = [
    [a, x, c],
    [d, y, f],
    [g, z, i],
  ];
  const determinantZMatrix = [
    [a, b, x],
    [d, e, y],
    [g, h, z],
  ];
  log("determinant", "Será calculada a determinante da matriz X:");
  const detX = calculateDeterminant3x3(determinantXMatrix);

  log("determinant", "Será calculada a determinante da matriz Y:");
  const detY = calculateDeterminant3x3(determinantYMatrix);

  log("determinant", "Será calculada a determinante da matriz Z:");
  const detZ = calculateDeterminant3x3(determinantZMatrix);

  let determinantsOutput = [
    {
      unknown: "a",
      matrixHTML: mathJaxHTMLWriter.write3x3Matrix(determinantMainMatrix),
      result: detMain,
    },
    {
      unknown: "x",
      matrixHTML: mathJaxHTMLWriter.write3x3Matrix(determinantXMatrix),
      result: detX,
    },
    {
      unknown: "y",
      matrixHTML: mathJaxHTMLWriter.write3x3Matrix(determinantYMatrix),
      result: detY,
    },
    {
      unknown: "z",
      matrixHTML: mathJaxHTMLWriter.write3x3Matrix(determinantZMatrix),
      result: detZ,
    },
  ];

  let classificationOutput = {
    type: "SPD",
    message: "Sistema Possível Determinado (SPD) - O sistema uma solução",
  };
  let messageOutput = "Cálculo realizado com sucesso.";

  if (isDeterminantEqualsZero(detMain)) {
    if (areAllDeterminantsZero([detX, detY, detZ])) {
      classificationOutput.type = "SPI";
      classificationOutput.message =
        "Sistema Possível Indeterminado (SPI) - O sistema tem infinitas soluções";
    } else if (hasDeterminantsNotEqualsZero([detX, detY, detZ])) {
      classificationOutput.type = "SI";
      classificationOutput.message =
        "Sistema Impossível (SI) - O sistema não tem solução";
    }
  }

  const xResult = detX / detMain;
  const yResult = detY / detMain;
  const zResult = detZ / detMain;

  log("output", `Resultado de X = ${xResult}`);
  log("output", `Resultado de Y = ${yResult}`);
  log("output", `Resultado de Z = ${zResult}`);

  const equationResultOutput = {
    classification: classificationOutput,
    message: messageOutput,
    resolutions: [
      { unknown: "x", value: xResult, determinantCalc: `${detX} / ${detMain}` },
      { unknown: "y", value: yResult, determinantCalc: `${detY} / ${detMain}` },
      { unknown: "z", value: zResult, determinantCalc: `${detZ} / ${detMain}` },
    ],
    determinants: determinantsOutput,
  };

  return equationResultOutput;
}

/**
 * Extrai os coeficientes de uma equação linear.
 * @param {string} eq - A equação linear a ser analisada.
 * @param {HTMLElement} [elementToFocusIfError] - O elemento HTML para focar se houver um erro, no qual será focado.
 * @returns {Array<number>} Um array contendo os coeficientes da equação.
 * @throws {Error} Se houver um erro durante a extração dos coeficientes ou se a equação não estiver formatada corretamente.
 */
function extractCoefficients(eq, elementToFocusIfError) {
  let unknowns = ["x", "y"];
  if (is3x3LinearSystem) unknowns.push("z");

  let missingUnknown = ""; // Variável para armazenar a incógnita ausente, inicializada como uma string vazia

  const hasAllUnknowns = unknowns.every((unknown) => {
    if (!eq.includes(unknown)) {
      missingUnknown = unknown; // Armazena a incógnita ausente
      return false; // Retorna false para parar a iteração
    }
    return true; // Retorna true se a incógnita estiver presente
  });

  if (!hasAllUnknowns) {
    elementToFocusIfError.focus();
    throw new Error(
      `A incógnita "${missingUnknown.toUpperCase()}" está faltando em uma das equações!`
    );
  }

  // Verifica se a equação contém a incógnita z
  const is3x3 = /z/i.test(eq);

  // Define padrão de correspondência com base no número de incógnitas
  const pattern = is3x3
    ? /(-?\d*)[xX]\s*([+-])?\s*(\d*)[yY]?\s*([+-])?\s*(\d*)[zZ]?\s*=\s*(-?\d*)/
    : /(-?\d*)[xX]\s*([+-])?\s*(\d*)[yY]?\s*=\s*(-?\d*)/;

  // Realiza correspondência com o padrão
  const matches = eq.match(pattern);
  if (matches == null || !isEquationValid(eq)) {
    throw new Error("As equações não foram digitadas corretamente!");
  }

  // Extrai os coeficientes com base no número de incógnitas
  let coefficientX = parseInt(matches[1] || "1");
  // lidar com casos de quando o valor de x é -x
  if (matches[1] == "-") {
    coefficientX = -1;
  }
  const coefficientY = parseInt((matches[2] || "") + (matches[3] || "1"));
  const coefficientZ = is3x3
    ? parseInt((matches[4] || "") + (matches[5] || "1"))
    : undefined;
  const constant = parseInt(matches[is3x3 ? 6 : 4]);

  // Retorna os coeficientes conforme apropriado para sistemas 2x2 ou 3x3
  return is3x3
    ? [coefficientX, coefficientY, coefficientZ, constant]
    : [coefficientX, coefficientY, constant];
}

function calculateDeterminant2x2(matrix) {
  console.log(writeMatrix(matrix));

  const [a, b] = matrix[0];
  const [c, d] = matrix[1];
  const determinant = a * d - b * c;
  log("output", `Determinante: ${determinant}`);
  return determinant;
}

function calculateDeterminant3x3(matrix) {
  console.log(writeMatrix(matrix));

  const [a, b, c] = matrix[0];
  const [d, e, f] = matrix[1];
  const [g, h, i] = matrix[2];
  const determinant =
    a * e * i + b * f * g + c * d * h - c * e * g - b * d * i - a * f * h;
  log("output", `Determinante: ${determinant}`);
  return determinant;
}

function generateRandomEquation(numVariables) {
  let equation = "";
  for (let i = 0; i < numVariables; i++) {
    if (i > 0) equation += " + ";
    equation += `${generateRandomNumber(0, 10)}${String.fromCharCode(120 + i)}`;
  }
  equation += ` = ${generateRandomNumber(0, 10)}`;
  return equation;
}

// Gerar uma equação 2x2:
function generate2x2RandomEquation() {
  return generateRandomEquation(2);
}

// Gerar uma equação 3x3:
function generate3x3RandomEquation() {
  return generateRandomEquation(3);
}

const sample2x2Equations = [
  { first: "2x + 3y = 7", second: "4x + 6y = 10" },
  { first: "2x + 3y = 8", second: "4x + 2y = 10" },
  { first: "2x + 3y = 6", second: "4x + 6y = 12" },
  {
    first: generate2x2RandomEquation(),
    second: generate2x2RandomEquation(),
  },
];

const sample3x3Equations = [
  {
    first: "x + 2y +z = 4",
    second: "2x + 4y + 2z = 8",
    three: "3x + 6y + 3z = 12",
  },
  {
    first: "x + 2y +z = 4",
    second: "2x + 3y + 4z = 10",
    three: "3x + 4y + 5z = 16",
  },
  {
    first: "x + y +z = 3",
    second: "2x + 2y + 2z = 8",
    three: "3x + 3y + 7z = 12",
  },
  {
    first: generate3x3RandomEquation(),
    second: generate3x3RandomEquation(),
    three: generate3x3RandomEquation(),
  },
];

let beforeRandomIndex = -1;

function fillEquationsWithExample() {
  if (!is3x3LinearSystem) {
    let randomIndex = Math.floor(Math.random() * sample2x2Equations.length);
    // log("info", `Index selecionado: ${randomIndex}`);
    while (randomIndex == beforeRandomIndex) {
      randomIndex = Math.floor(Math.random() * sample2x2Equations.length);
      // log("info", `Selecionado novo index: ${randomIndex}`);
    }
    beforeRandomIndex = randomIndex;

    let sampleEquation = sample2x2Equations[randomIndex];
    firstEquationEl.value = sampleEquation.first;
    secondEquationEl.value = sampleEquation.second;
  } else {
    let randomIndex = Math.floor(Math.random() * sample3x3Equations.length);
    // log("info", `Index selecionado: ${randomIndex}`);
    while (randomIndex == beforeRandomIndex) {
      // log("info", `Selecionado novo index: ${randomIndex}`);
      randomIndex = Math.floor(Math.random() * sample2x2Equations.length);
    }
    beforeRandomIndex = randomIndex;

    let sampleEquation = sample3x3Equations[randomIndex];
    firstEquationEl.value = sampleEquation.first;
    secondEquationEl.value = sampleEquation.second;
    thirdEquationEl.value = sampleEquation.three;
  }
  solveSystem();
}
const fillWithExampleButtonEl = document.getElementById(
  "fill-with-example-btn"
);

fillWithExampleButtonEl.addEventListener("click", fillEquationsWithExample);

function clearEquations() {
  firstEquationEl.value = "";
  secondEquationEl.value = "";
  if (is3x3LinearSystem) thirdEquationEl.value = "";
}

const clearEquationsBtnEl = document.getElementById("clear-btn");
clearEquationsBtnEl.addEventListener("click", clearEquations);
