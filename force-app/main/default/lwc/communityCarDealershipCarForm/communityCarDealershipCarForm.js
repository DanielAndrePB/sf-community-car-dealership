import { LightningElement, api, wire, track } from "lwc";
import { refreshApex } from "@salesforce/apex";
import createCar from "@salesforce/apex/CarDealershipController.createCar";
import retrieveCarData from "@salesforce/apex/CarDealershipController.retrieveCarData";
import updateCar from "@salesforce/apex/CarDealershipController.updateCar";
import { CAR_DEALERSHIP_NEW_CAR_FORM as CONSTANT } from 'c/constants';

export default class CommunityCarDealershipCarForm extends LightningElement {
    @track inputValues = {};
    loading = false;
    @api carRecordId;
    imageFileUploaded = false;
    wiredCarData;

    showLoadingSpinner(loading) {
        this.loading = loading;
        this.dispatchEvent(
            new CustomEvent("loading", { detail: this.loading })
        );
    }

    get carInfoJSON() {
        return JSON.stringify(this.inputValues);
    }

    get imageFilename() {
        if (this.imageFileUploaded) {
            return this.inputValues.image.filename;
        }
        return "";
    }

    handleInputChange(event) {
        const inputName = event.target.name;
        switch (event.target.type) {
            case CONSTANT.CHECKBOX_INPUT_TYPE:
                this.inputValues[inputName] = event.target.checked;
                break;
            case CONSTANT.FILE_INPUT_TYPE:
                this.handleFileUpload(event.target.files[0], inputName);
                break;
            default:
                this.inputValues[inputName] = event.target.value;
        }
    }

    handleFileUpload(file, inputName) {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result.split(",")[1];
            this.inputValues[inputName] = {
                filename: file.name,
                base64: base64
            };
            this.imageFileUploaded = true;
        };
        reader.onerror = () => {
            this.imageFileUploaded = false;
        };
        reader.readAsDataURL(file);
    }

    handleRemoveImage() {
        this.imageFileUploaded = false;
        delete this.inputValues.image;
    }

    @api createNewCar() {
        this.showLoadingSpinner(true);
        createCar({ carInfoJSON: this.carInfoJSON })
            .then(() => {
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                this.showLoadingSpinner(false);
                this.recordCreatedOrUpdated();
            });
    }

    @api updateCar() {
        this.showLoadingSpinner(true);
        updateCar({ recordId: this.carRecordId, carInfoJSON: this.carInfoJSON })
            .then(() => {
                refreshApex(this.wiredCarData);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                this.showLoadingSpinner(false);
                this.recordCreatedOrUpdated();
            });
    }

    @wire(retrieveCarData, { recordId: "$carRecordId" })
    getWiredCarData(result) {
        this.wiredCarData = result; 
        const { data, error } = result;
        if (data) {
            this.inputValues = JSON.parse(JSON.stringify(data));
            if(this.inputValues.image?.filename){
                this.imageFileUploaded = true;
            }
        } else if (error) {
            console.error(error);
        }
    }

    recordCreatedOrUpdated() {
        this.dispatchEvent(new CustomEvent("createdorupdated"));
    }
}