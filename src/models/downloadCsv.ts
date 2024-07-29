import { DataRow, ColumName } from "./models";
export async function convertCsv(data: DataRow[], columNames: ColumName): Promise<string> {
    const csvRows = [];
    csvRows.push(columNames.join(','));

    data.forEach(rows =>{
        const values = columNames.map(column =>rows[column] || '');
        csvRows.push(values.join(''))
    })

    return csvRows.join('')
}

export async function downloadCsv(csvContent: string, fileName: string) {
    // blob
    const blob = new Blob([csvContent],{type: 'text/csv;charset=UTF-8;'})

    //Link
    const link = document.createElement('a');

    //URL
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName)

    //Añadir al HTML
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);


}