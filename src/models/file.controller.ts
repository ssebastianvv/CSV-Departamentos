import { DataRow, DataTable, ColumName } from "./models"; //Importamos los models

export class FileController { // controlador del archivo que se procesa.
    private data : DataTable = [];
    private columNames : ColumName = [];

    constructor (private fileContent : string) {
        //El parámetro es el archivo CSV, que es string
        this.processFile();
    }

    private processFile() {
        //Método trim() elimina espacios
        //Método split los divide y los convierte en un array
        //
        const lines: string[] = this.fileContent.split(/[\r\n]+/).filter(line => line.trim()!=='');
        if (lines.length > 0) {
            this.columNames = lines[0].split(',');
            this.data = lines.slice(1).map(line => {
                const values = line.split(',');
                const row : DataRow = {};
                this.columNames.forEach((colName, index) => {
                    row[colName] = values[index] || '';
                });
                return row;
            });
        }
    }

    getData() : DataTable {
        return this.data
    }

    getColumNames() : ColumName {
        return this.columNames
    }
}