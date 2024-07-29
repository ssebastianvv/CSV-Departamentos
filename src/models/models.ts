export interface DataRow { // interface para interpretar el archivo .csv. Registro de una fila.
    [key : string] : string // arreglo de strings (key -> nombre de la columna).
}

export type DataTable = DataRow[]; // conjunto de todas las filas -> todos los registros. (Es más flexible el trabajar con tipos).

export type ColumName = string[]; // toda la información perteneciente a una columna en un registro. Están divididos por comas en el archivo .csv