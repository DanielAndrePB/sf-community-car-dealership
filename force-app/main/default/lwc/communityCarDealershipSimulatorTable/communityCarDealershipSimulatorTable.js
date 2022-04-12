import { LightningElement, api } from "lwc";
import interest from "@salesforce/label/c.Car_Interest_Percentage";
import { convertTableDataToCSVFormat } from "c/utilities";
import {
    CAR_DEALERSHIP_SIMULATOR_TABLE as CONSTANT,
    PUNCTUATION
} from "c/constants";

const INTEREST = Number(interest) / 100;
const CELL_CENTERED = { alignment: "center" };
const CURRENCY_ATTRIBUTES = {
    maximumFractionDigits: "2"
};
const COLUMNS = [
    {
        label: "Month",
        type: "number",
        fieldName: "month",
        cellAttributes: CELL_CENTERED
    },
    {
        label: "Balance",
        type: "currency",
        fieldName: "balance",
        typeAttributes: CURRENCY_ATTRIBUTES
    },
    {
        label: "Monthly Payment",
        type: "currency",
        fieldName: "monthlyPayment",
        typeAttributes: CURRENCY_ATTRIBUTES
    },
    {
        label: "Interest Payment",
        type: "currency",
        fieldName: "interestPayment",
        typeAttributes: CURRENCY_ATTRIBUTES
    },
    {
        label: "Total Payment",
        type: "currency",
        fieldName: "totalPayment",
        typeAttributes: CURRENCY_ATTRIBUTES
    }
];

export default class CommunityCarDealershipSimulatorTable extends LightningElement {
    rendered = false;
    @api downPayment;
    @api terms;
    @api price;
    payments = [];
    columns = COLUMNS;
    uniqueTableIdCounter = 0;

    get uniqueTableId() {
        return "id" + this.uniqueTableIdCounter++;
    }

    get startingBalance() {
        return this.price - this.downPayment;
    }
    get monthlyInterest() {
        return INTEREST / 12;
    }
    get monthlyPayment() {
        return this.startingBalance / this.terms;
    }
    get pdfTableData() {
        return this.payments.map(({ keyField, ...tableFields }) => tableFields);
    }

    renderedCallback() {
        if (!this.rendered) {
            this.rendered = true;
            this.dispatchEvent(new CustomEvent("tablerendered"));
        }
    }

    @api calculate() {
        this.payments = this.calculatePayments();
    }

    calculatePayments() {
        const paymentRows = [];
        const startingMonth = 1;
        for (let month = startingMonth; month <= this.terms; month++) {
            const previousIndex = paymentRows.length - 1;
            let balance;
            if (month !== startingMonth) {
                balance =
                    paymentRows[previousIndex].balance -
                    paymentRows[previousIndex].monthlyPayment;
            } else {
                balance = this.startingBalance;
            }
            let interestPayment = balance * this.monthlyInterest;
            paymentRows.push({
                keyField: this.uniqueTableId,
                month: month,
                balance: balance.toFixed(2),
                monthlyPayment: this.monthlyPayment.toFixed(2),
                interestPayment: interestPayment.toFixed(2),
                totalPayment: (this.monthlyPayment + interestPayment).toFixed(2)
            });
        }
        return paymentRows;
    }

    @api downloadAsPDF() {
        window.print();
    }

    @api downloadAsCSV() {
        const table = convertTableDataToCSVFormat(this.payments);
        const element =
            CONSTANT.ANCHOR_DOWNLOAD_DATA +
            CONSTANT.CSV_MIME_TYPE +
            PUNCTUATION.COMMA +
            encodeURI(table);
        const downloadElement = document.createElement(CONSTANT.ANCHOR_TAG);
        downloadElement.href = element;
        downloadElement.target = CONSTANT.ANCHOR_TARGET_SELF;
        downloadElement.download =
            CONSTANT.CSV_FILENAME + CONSTANT.CSV_EXTENSION;
        downloadElement.click();
    }
}