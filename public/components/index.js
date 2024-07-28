var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { FileController } from "./models/file.controller.js";
import { renderTable } from "./controllers/table.js";
import { filterData } from "./controllers/filter.js";
import { convertCsv, downloadCsv } from "./models/downloadCsv.js";
const csvForm = document.getElementById("csvForm");
const csvFile = document.getElementById("csvFile");
const searchInput = document.getElementById("searchInput");
const downloadButton = document.getElementById("downloadCSV");
const displayArea = document.getElementById("displayArea");
const paginationHTML = document.getElementById("paginationControls");
const recordsPerPage = 15;
let currentPage = 1;
let finalValues = [];
let columnNames = [];
//-----------------Paginación-------------
function pagination(totalRecords, currentPage, recordsPerPage) {
    const totalPages = Math.ceil(totalRecords / recordsPerPage);
    const maxButtons = 10;
    let paginationHTML = '<ul class="pagination">';
    // Start button
    if (currentPage > 1) {
        paginationHTML += `<li class="page-item"><a class="page-link" data-page="1" href="#">Start</a></li>`;
    }
    // Page buttons
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, currentPage + Math.floor(maxButtons / 2));
    if (endPage - startPage + 1 < maxButtons) {
        if (startPage > 1) {
            startPage = Math.max(1, endPage - maxButtons + 1);
        }
        if (endPage < totalPages) {
            endPage = Math.min(totalPages, startPage + maxButtons - 1);
        }
    }
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" data-page="${i}" href="#">${i}</a>
            </li>
        `;
    }
    // Next button
    if (currentPage < totalPages) {
        paginationHTML += `<li class="page-item"><a class="page-link" data-page="${totalPages}" href="#">End</a></li>`;
    }
    paginationHTML += '</ul>';
    return paginationHTML;
}
//Renderizar la tabla
document.addEventListener('DOMContentLoaded', () => {
    csvForm.addEventListener('submit', (e) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        e.preventDefault();
        const csvReader = new FileReader();
        const input = csvFile.files[0];
        const fileName = input.name;
        const fileExtension = (_a = fileName.split('.').pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        if (fileExtension !== 'csv' && fileExtension !== 'txt') {
            alert('Selecciona un archivo .csv o .txt');
            return;
        }
        csvReader.onload = function (Evt) {
            return __awaiter(this, void 0, void 0, function* () {
                var _a;
                const text = (_a = Evt.target) === null || _a === void 0 ? void 0 : _a.result;
                const fileController = new FileController(text);
                finalValues = fileController.getData();
                columnNames = fileController.getColumNames();
                yield renderTableControls();
            });
        };
        csvReader.readAsText(input);
    }));
    downloadButton.addEventListener('click', (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        const filteredValues = filterData(finalValues, searchInput.value);
        const csvData = yield convertCsv(filteredValues, columnNames);
        yield downloadCsv(csvData, 'filtered_data.csv');
    }));
    searchInput.addEventListener('input', () => __awaiter(void 0, void 0, void 0, function* () {
        yield renderTableControls();
    }));
});
function renderTableControls() {
    return __awaiter(this, void 0, void 0, function* () {
        const searchTerm = searchInput.value;
        const filteredValues = filterData(finalValues, searchTerm);
        const tableHTML = yield renderTable(filteredValues, currentPage, recordsPerPage);
        displayArea.innerHTML = tableHTML;
        const paginationControls = pagination(filteredValues.length, currentPage, recordsPerPage);
        if (paginationHTML) {
            paginationHTML.innerHTML = paginationControls;
        }
        document.querySelectorAll('.page-link').forEach(button => {
            button.addEventListener('click', (e) => {
                const targetPage = Number(e.target.dataset.page);
                if (targetPage) {
                    currentPage = targetPage;
                    renderTableControls();
                }
            });
        });
    });
}
