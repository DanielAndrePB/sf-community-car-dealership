import { LightningElement, wire, track } from "lwc";
import { isNullOrUndefined, isTruthy } from "c/utilities";
import getCarInfo from "@salesforce/apex/CarDealershipGuestAccessController.getCarDownPaymentInformation";
import { CAR_DEALERSHIP_SIMULATOR as CONSTANT } from "c/constants";

const TERM_OPTIONS = [
    { label: "12 Months", value: 12 },
    { label: "18 Months", value: 18 },
    { label: "24 Months", value: 24 },
    { label: "48 Months", value: 48 }
];

export default class CommunityCarDealershipSimulator extends LightningElement {
    @track carOptions = [];
    @track carPrices = {};
    termOptions = TERM_OPTIONS;
    @track termSelected = {
        label: CONSTANT.TERM_SELECTED_PLACEHOLDERS.label,
        value: CONSTANT.TERM_SELECTED_PLACEHOLDERS.value
    };
    downPayment;
    @track carSelected = {
        name: CONSTANT.CAR_SELECTED_PLACEHOLDERS.name,
        price: CONSTANT.CAR_SELECTED_PLACEHOLDERS.price
    };
    showSimulationTable = false;
    simulationTableRendered = false;

    get downPaymentSelected() {
        return Number(this.downPayment);
    }

    @wire(getCarInfo)
    getWiredCarInfo(result) {
        const { data, error } = result;
        if (data) {
            let carOptions = [];
            let carPrices = {};
            data.forEach((carProduct) => {
                carOptions.push({
                    label: carProduct.Name,
                    value: carProduct.Name
                });
                carPrices[carProduct.Name] =
                    carProduct.PricebookEntries[0].UnitPrice;
            });
            this.carOptions = carOptions;
            this.carPrices = carPrices;
        } else if (error) {
            console.error(error.body.message);
        }
    }

    handleCarSelection(event) {
        const carSelection = event.detail.value;
        this.carSelected.name = carSelection;
        this.carSelected.price = this.carPrices[carSelection];
    }

    handleDownPaymentSelection(event) {
        this.downPayment = event.detail.value;
    }

    handleTermSelection(event) {
        this.termSelected.value = Number(event.detail.value);
        this.termSelected.label = event.target.options.find(
            (option) => Number(option.value) === this.termSelected.value
        ).label;
    }

    handleCalculateSimulation() {
        const dataIsValid = this.validateFields();
        if (dataIsValid) {
            if (this.simulationTableRendered) {
                this.calculateSimulation();
            } else {
                this.showSimulationTable = true;
            }
        }
    }

    validateFields() {
        const termIsValid =
            !isNullOrUndefined(this.termSelected) &&
            isTruthy(this.termSelected.value);
        const downPaymentIsValid =
            isTruthy(this.downPayment) && this.downPayment >= 1;
        const carIsValid =
            !isNullOrUndefined(this.carSelected) &&
            isTruthy(this.carSelected.name) &&
            isTruthy(this.carSelected.price);
        return termIsValid && downPaymentIsValid && carIsValid;
    }

    handleTableRendered() {
        this.simulationTableRendered = true;
        this.calculateSimulation();
    }

    querySimulatorTable() {
        return this.template.querySelector(
            CONSTANT.SIMULATOR_TABLE_SELECTOR
        );
    }

    calculateSimulation() {
        const table = this.querySimulatorTable();
        table.calculate();
    }

    downloadPDF() {
        const table = this.querySimulatorTable();
        table.downloadAsPDF();
    }

    downloadCSV() {
        const table = this.querySimulatorTable();
        table.downloadAsCSV();
    }
}