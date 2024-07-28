var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function convertCsv(data, columNames) {
    return __awaiter(this, void 0, void 0, function* () {
        const csvRows = [];
        csvRows.push(columNames.join(','));
        data.forEach(rows => {
            const values = columNames.map(column => rows[column] || '');
            csvRows.push(values.join(''));
        });
        return csvRows.join('');
    });
}
export function downloadCsv(csvContent, fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        // blob
        const blob = new Blob([csvContent], { type: 'text/csv;charset=UTF-8;' });
        //Link
        const link = document.createElement('a');
        //URL
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        //Añadir al HTML
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}
