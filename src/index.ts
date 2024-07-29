import { FileController } from "./models/file.controller.js";
import { renderTable } from "./controllers/table.js";
import { filterData } from "./controllers/filter.js";
import { ColumName, DataRow } from "./models/models.js";
import { convertCsv, downloadCsv } from "./models/downloadCsv.js";


const csvForm = document.getElementById("csvForm") as HTMLFormElement;
const csvFile = document.getElementById("csvFile") as HTMLInputElement;
const searchInput = document.getElementById("searchInput") as HTMLInputElement;
const downloadButton = document.getElementById("downloadCSV") as HTMLButtonElement;
const displayArea = document.getElementById("displayArea") as HTMLDivElement;
const paginationHTML = document.getElementById("paginationControls");


const recordsPerPage = 15;
let currentPage = 1;
let finalValues:DataRow[] = []
let columnNames: ColumName = [];

//-----------------Paginación-------------
function pagination(totalRecords: number, currentPage: number, recordsPerPage: number): string {
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
document.addEventListener('DOMContentLoaded', ()=>{
    csvForm.addEventListener('submit', async(e: Event)=>{
        e.preventDefault();

        const csvReader = new FileReader();

        const input = csvFile.files![0];
        const fileName = input.name;
        const fileExtension = fileName.split('.').pop()?.toLowerCase();

        if (fileExtension !== 'csv' && fileExtension !== 'txt') {
            alert('Selecciona un archivo .csv o .txt');
            return
        }

        csvReader.onload = async function(Evt){
            const text = Evt.target?.result as string;
            const fileController = new FileController(text);
            finalValues = fileController.getData();
            columnNames = fileController.getColumNames();
            await renderTableControls();
        }

        csvReader.readAsText(input)
    });

    downloadButton.addEventListener('click', async (e:Event) =>{
        e.preventDefault();
        const filteredValues = filterData(finalValues, searchInput.value);
        const csvData = await convertCsv(filteredValues, columnNames);
        await downloadCsv(csvData, 'filtered_data.csv')
    });

    searchInput.addEventListener('input', async() =>{
        await renderTableControls()
    })
})

async function renderTableControls(){
    const searchTerm = searchInput.value;
    const filteredValues = filterData(finalValues, searchTerm);

    const tableHTML = await renderTable(filteredValues, currentPage, recordsPerPage);
    displayArea.innerHTML = tableHTML;

    const paginationControls = pagination(filteredValues.length, currentPage, recordsPerPage);
    if (paginationHTML) {
        paginationHTML.innerHTML = paginationControls;
    }


    document.querySelectorAll('.page-link').forEach(button =>{
        button.addEventListener('click', (e) =>{
            const targetPage = Number((e.target as HTMLElement).dataset.page)
            if (targetPage) {
                currentPage = targetPage;
                renderTableControls();
            }
        })
    })
}



