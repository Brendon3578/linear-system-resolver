import { MathJaxHTMLWriter } from "./classes/MathJaxHTMLWriter.js";
import {
  areAllDeterminantsZero,
  hasDeterminantsNotEqualsZero,
  isDeterminantEqualsZero,
  isDeterminantNotEqualsZero,
  log,
  roundToThreeDecimalPlaces,
  writeMatrix,
} from "./utils.js";

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

const mathJaxHTMLWriter = new MathJaxHTMLWriter(
  matrixDrawnEl,
  linearSystemDrawnEl
);

function showStatusMessage(status) {
  statusMessageEl.classList.value = "";
  switch (status) {
    case "success":
      statusMessageEl.innerText = "Cálculo realizado com sucesso";
      statusMessageEl.classList.value = "text-green-700 font-bold";
      break;
    case "error":
      statusMessageEl.innerText =
        "As equações não foram digitadas corretamente.";
      statusMessageEl.classList.value = "text-red-600 font-bold";
      break;
  }
}

const linearSystemSizeRadioButtonsEl = document.querySelectorAll(
  'input[name="sistema-tamanho"]'
);
const thirdEquationContainerEl = document.getElementById(
  "third-equation-label"
);

let is3x3LinearSystem = false;

linearSystemSizeRadioButtonsEl.forEach((radioButtonEl) => {
  radioButtonEl.addEventListener("change", () => {
    let systemSize = radioButtonEl.value;

    if (systemSize == "2x2") {
      showThirdEquation(false);
      is3x3LinearSystem = false;
      firstEquationEl.placeholder = "Ex: 2x + 3y = 6";
      secondEquationEl.placeholder = "Ex: 4x - 2y = 8";
    } else if (systemSize == "3x3") {
      showThirdEquation(true);
      is3x3LinearSystem = true;
      firstEquationEl.placeholder = "Ex: x + 2y + z = 2";
      secondEquationEl.placeholder = "Ex: 2x + y + 2z = 9";
    }
  });
});

const resultListEl = document.getElementById("result-list");
const determinantListEl = document.getElementById("determinant-list");
const systemsClassificationTextEl = document.getElementById(
  "system-classification"
);

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

    let eq1 = firstEquationEl.value;
    let eq2 = secondEquationEl.value;

    const coeffs_eq1 = extractCoefficients(eq1);
    const coeffs_eq2 = extractCoefficients(eq2);

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
      const coeffs_eq3 = extractCoefficients(eq3);
      const { resolutions, determinants, classification, message } =
        solve3x3System(coeffs_eq1, coeffs_eq2, coeffs_eq3);

      equationResultOutput.resolutions = resolutions;
      equationResultOutput.determinants = determinants;
      equationResultOutput.classification = classification;
      equationResultOutput.message = message;
    }

    equationResultOutput.resolutions.forEach((solution) => {
      const result = roundToThreeDecimalPlaces(solution.value);
      const unknown = solution.unknown.toUpperCase();
      resultListEl.innerHTML += `<li title="Resultado de ${unknown} é igual a ${result}">
      ${unknown} = <b class="font-bold">${result}</b></li>`;
    });

    equationResultOutput.determinants.forEach((determinant) => {
      const result = roundToThreeDecimalPlaces(determinant.result);
      const unknown = determinant.unknown.toUpperCase();
      determinantListEl.innerHTML += `
      <li
        class="flex flex-col gap-2 items-center justify-between rounded-md shadow-lg p-2 pb-4 border border-gray-400 w-full bg-gradient-to-t from-gray-200 to-white"
        title="Resultado da determinante de ${unknown} é igual a ${result}"
      >
        <span class="text-sm font-semibold">Det. de ${unknown} = ${result}</span>
        <div>${determinant.matrixHTML}</div>
      </li>`;
    });

    let classificationTextColors = {
      SI: "text-indigo-700",
      SPD: "text-teal-700",
      SPI: "text-blue-700",
    };

    let classificationTextColor =
      classificationTextColors[equationResultOutput.classification.type];

    systemsClassificationTextEl.innerHTML = `<span class=' ${classificationTextColor} font-bold'> ${equationResultOutput.classification.message} </span>`;
    mathJaxHTMLWriter.updateMathJax();

    showStatusMessage("success");
  } catch (e) {
    console.error(e);
    showStatusMessage("error");
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

    const equationResultOutput = {
      classification: classificationOutput,
      message: messageOutput,
      resolutions: [],
      determinants: determinantsOutput,
    };
    return equationResultOutput;
  }

  const xResult = detX / detMain;
  const yResult = detY / detMain;

  // [x, y].forEach((number) => {
  //   if (isNaN(number)) throw new Error("Cálculo errado");
  // });

  const equationResultOutput = {
    classification: classificationOutput,
    message: messageOutput,
    resolutions: [
      { unknown: "x", value: xResult },
      { unknown: "y", value: yResult },
    ],
    determinants: determinantsOutput,
  };

  return equationResultOutput;
}

function solve3x3System(coeffs_eq1, coeffs_eq2, coeffs_eq3) {
  console.log(coeffs_eq1);
  console.log(coeffs_eq2);
  console.log(coeffs_eq3);
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
  let messageOutput = "Cálculo realizado com sucesso";

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
    const equationResultOutput = {
      classification: classificationOutput,
      message: messageOutput,
      resolutions: [],
      determinants: determinantsOutput,
    };
    return equationResultOutput;
  }

  const xResult = detX / detMain;
  const yResult = detY / detMain;
  const zResult = detZ / detMain;

  const equationResultOutput = {
    classification: classificationOutput,
    message: messageOutput,
    resolutions: [
      { unknown: "x", value: xResult },
      { unknown: "y", value: yResult },
      { unknown: "z", value: zResult },
    ],
    determinants: determinantsOutput,
  };

  return equationResultOutput;
}

function extractCoefficients(eq) {
  // Verifica se a equação contém a incógnita z
  const is3x3 = /z/i.test(eq);

  // Define padrão de correspondência com base no número de incógnitas
  const pattern = is3x3
    ? /(-?\d*)[xX]\s*([+-])?\s*(\d*)[yY]?\s*([+-])?\s*(\d*)[zZ]?\s*=\s*(-?\d*)/
    : /(-?\d*)[xX]\s*([+-])?\s*(\d*)[yY]?\s*=\s*(-?\d*)/;

  // Realiza correspondência com o padrão
  const matches = eq.match(pattern);
  console.log(matches);

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
  // console.log(matrix);

  const [a, b] = matrix[0];
  const [c, d] = matrix[1];
  const determinant = a * d - b * c;
  log("output", `Determinante: ${determinant}`);
  return determinant;
}

function calculateDeterminant3x3(matrix) {
  const [a, b, c] = matrix[0];
  const [d, e, f] = matrix[1];
  const [g, h, i] = matrix[2];
  return a * e * i + b * f * g + c * d * h - c * e * g - b * d * i - a * f * h;
}
