import { DataTable } from "../models/models.js";

export async function renderTable(arrayTable: DataTable, currentPage: number, recordsPerPage: number): Promise<string> {
    // Calcular el índice de inicio y el índice final para la página actual
    const startIndex = (currentPage - 1) * recordsPerPage;
    const finalIndex = startIndex + recordsPerPage;

    // Obtener los datos paginados
    const paginatedData = arrayTable.slice(startIndex, finalIndex);

    // Obtener los nombres de las columnas desde la primera fila
    const columNames = arrayTable.length > 0 ? Object.keys(arrayTable[0]) : [];

    // Generar el HTML de la tabla
    return `
        <table class="table table-striped">
            <thead>
                <tr>
                    ${columNames.map(colName => `
                        <th scope="col">${colName}</th>
                    `).join('')}
                </tr>
            </thead>
            <tbody>
                ${paginatedData.map(row => `
                    <tr>
                        ${columNames.map(colName => `
                            <td>
                                ${row[colName] || ''}
                            </td>
                        `).join('')}
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}
