import { HTML_TAG, TABLE_STYLE } from "c/constants";

export function isNullOrUndefined(value) {
    return value === null || value === undefined;
}

export function isTruthy(value) {
    return !!value;
}

export function convertTableDataToCSVFormat(data) {
    let rowEnd = "\n";
    let csvString = "";
    let rowSet = new Set();
    data.forEach(function (record) {
        Object.keys(record).forEach(function (key) {
            if (key !== "keyField") {
                rowSet.add(key);
            }
        });
    });
    const rowData = Array.from(rowSet);
    csvString += rowData.join(",");
    csvString += rowEnd;
    for (let i = 0; i < data.length; i++) {
        let colValue = 0;
        for (let key in rowData) {
            if (rowData.hasOwnProperty(key)) {
                let rowKey = rowData[key];
                if (colValue > 0) {
                    csvString += ",";
                }
                let value =
                    data[i][rowKey] === undefined ? "" : data[i][rowKey];
                csvString += '"' + value + '"';
                colValue++;
            }
        }
        csvString += rowEnd;
    }
    return csvString;
}

export function convertTableDataToPDFFormat(title, headers, data) {
    const body = createHTMLTable(headers, data);
    return createHTMLDoc(title, TABLE_STYLE.BORDER_COLLAPSE, body);
}

function createHTMLDoc(title, style, body) {
    let doc = "";
    doc += HTML_TAG.HTML_START;
    doc += HTML_TAG.HEAD_START;
    doc += HTML_TAG.TITLE_START;
    doc += title;
    doc += HTML_TAG.TITLE_END;
    doc += HTML_TAG.STYLE_START;
    doc += style;
    doc += HTML_TAG.STYLE_END;
    doc += HTML_TAG.HEAD_END;
    doc += HTML_TAG.BODY_START;
    doc += body;
    doc += HTML_TAG.BODY_END;
    doc += HTML_TAG.HTML_END;
    return doc;
}

function createHTMLTable(headers, data) {
    let table = "";
    table += HTML_TAG.TBL_START;
    table += HTML_TAG.TBL_HEADER_START;
    table += HTML_TAG.TBL_ROW_START;
    headers.forEach((header) => {
        table +=
            HTML_TAG.TBL_HEADER_CELL_START +
            header +
            HTML_TAG.TBL_HEADER_CELL_END;
    });
    table += HTML_TAG.TBL_ROW_END;
    table += HTML_TAG.TBL_HEADER_END;
    table += HTML_TAG.TBL_BODY_START;
    data.forEach((row) => {
        table += HTML_TAG.TBL_ROW_START;
        Object.keys(row).forEach((column) => {
            if (row.hasOwnProperty(column) && column !== "keyField") {
                table += HTML_TAG.TBL_STD_CELL_START;
                table += row[column];
                table += HTML_TAG.TBL_STD_CELL_END;
            }
        });
        table += HTML_TAG.TBL_ROW_END;
    });
    table += HTML_TAG.TBL_BODY_END;
    table += HTML_TAG.TBL_END;
    return table;
}