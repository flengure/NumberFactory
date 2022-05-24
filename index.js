//import our NumberFactory object
import { NumberFactory } from "/src/number_factory.js";

const convertBtn = document.querySelector("#convertBtn");
const resultDiv = document.getElementById("results");

const createResultTable = () => {
  // Create the table itself
  let resultTable = document.createElement("table");
  resultTable.className = "resultTable";
  let tableHeaders = ["property", "result"];

  // Create the table header group element
  let resultTableHead = document.createElement("thead");
  resultTableHead.className = "resultTableHead";

  // Create the row that will contain the headers
  let resultTableHeaderRow = document.createElement("tr");
  resultTableHeaderRow.className = "resultTableHeaderRow";

  // Will iterate over all the strings in the tableHeader array and will append the header cells to the table header row
  tableHeaders.forEach((header) => {
    // Create the current header cell during a specific iteration
    let resultHeader = document.createElement("th");
    resultHeader.className = "resultHeader";
    resultHeader.innerText = header;
    // Append the current header cell to the header row
    resultTableHeaderRow.append(resultHeader);
  });

  // Append the header row to the table header group element
  resultTableHead.append(resultTableHeaderRow);
  resultTable.append(resultTableHead);

  // Create the table body group element
  let resultTableBody = document.createElement("tbody");
  resultTableBody.className = "resultTable-Body";

  // Append the table body group element to the table
  resultTable.append(resultTableBody);

  // Append the table to the result div
  resultDiv.append(resultTable);
};

const appendResult = (col1, col2, col3) => {
    const resultTable = document.querySelector(".resultTable");
    let resultTableBodyRow = document.createElement("tr"); // Create the current table row
    resultTableBodyRow.className = "resultTableBodyRow";
    if (col1) {
        let resultCol1 = document.createElement("td");
        resultCol1.className = "resultCol1";
        resultCol1.innerText = col1;
        resultTableBodyRow.append(resultCol1);
        if (col2) {
            let resultCol2 = document.createElement("td");
            resultCol2.className = "resultCol2";
            resultCol2.innerHTML = col2;
            resultTableBodyRow.append(resultCol2);
            if (col3) {
                let resultCol3 = document.createElement("td");
                resultCol3.className = "resultCol3";
                resultCol3.innerText = col3;
                resultTableBodyRow.append(resultCol3);
            }
        }
    
    }
  resultTable.append(resultTableBodyRow); // Append the current row to the scoreboard table body
};

// this function is called when the user clicks the button
const runNumberFactory = () => {
  // Get what the user typed in the user input, note that when we created the box in the
  // html above we assigned it an id of "userInput" so we can identify it here
  const userInput = document.getElementById("userInput").value;

  // remove all children from the resultdiv if any
  while (resultDiv.firstChild) resultDiv.removeChild(resultDiv.firstChild);

  createResultTable();


  // Here we create our NumberFactory object
  const o = new NumberFactory(userInput);

  // Here we just get three methods defined in the object
  appendResult('inputString', o.inputString);
  appendResult('isNegative',o.isNegative);
  appendResult('rawString', o.rawString);
  appendResult('lang',o.lang);
  appendResult('seperator.group',o.seperator.group);
  appendResult('seperator.decimal',o.seperator.decimal);
  appendResult('integerString',o.integerString);
  appendResult('decimalString',o.decimalString);
  appendResult('integerPrecision',o.integerPrecision);
  appendResult('scale',o.scale);
  appendResult('precision',o.precision);
  appendResult('integerWords',o.integerWords);
  appendResult('decimalWords',o.decimalWords);
  appendResult('formatedNumber',o.formatedNumber);
  appendResult('scientificNotation',o.scientificNotation);
  appendResult('words',o.words);
  appendResult('conjunction',o.conjunction);
  appendResult('negativePrefix',o.negativePrefix);
  appendResult('decimalPrefix',o.decimalPrefix);
  appendResult('wordList',o.wordList);

}


convertBtn.addEventListener("click", runNumberFactory);
