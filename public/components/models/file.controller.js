export class FileController {
    constructor(fileContent) {
        this.fileContent = fileContent;
        this.data = [];
        this.columNames = [];
        //El parámetro es el archivo CSV, que es string
        this.processFile();
    }
    processFile() {
        //Método trim() elimina espacios
        //Método split los divide y los convierte en un array
        //
        const lines = this.fileContent.split(/[\r\n]+/).filter(line => line.trim() !== '');
        if (lines.length > 0) {
            this.columNames = lines[0].split(',');
            this.data = lines.slice(1).map(line => {
                const values = line.split(',');
                const row = {};
                this.columNames.forEach((colName, index) => {
                    row[colName] = values[index] || '';
                });
                return row;
            });
        }
    }
    getData() {
        return this.data;
    }
    getColumNames() {
        return this.columNames;
    }
}
