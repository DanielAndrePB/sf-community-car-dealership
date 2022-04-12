import { LightningElement, track } from "lwc";
import isGuest from "@salesforce/user/isGuest";
import newCarLabel from "@salesforce/label/c.New_Car_Label";
import updateCarLabel from "@salesforce/label/c.Update_Car_Label";
import saveLabel from "@salesforce/label/c.Save_Label";
import updateLabel from "@salesforce/label/c.Update_Label";
import { CAR_DEALERSHIP_PRODUCTS as CONSTANT } from 'c/constants';

export default class CommunityCarDealershipProducts extends LightningElement {
    _showNewCarModal = false;
    modalLoading = false;
    @track filters = {};
    carRecordId;
    mode = CONSTANT.CREATE_MODE;

    get isGuestUser() {
        return isGuest;
    }

    get showNewCarModal() {
        return this._showNewCarModal;
    }

    get carModalHeader() {
        if (this.mode === CONSTANT.CREATE_MODE) {
            return newCarLabel;
        } else if (this.mode === CONSTANT.EDIT_MODE) {
            return updateCarLabel;
        }
        return "";
    }

    get confirmationButtonLabel() {
        if (this.mode === CONSTANT.CREATE_MODE) {
            return saveLabel;
        } else if (this.mode === CONSTANT.EDIT_MODE) {
            return updateLabel;
        }
        return "";
    }

    handleShowNewCarModal() {
        this._showNewCarModal = true;
    }

    handleCloseNewCarModal() {
        this._showNewCarModal = false;
    }

    handleFilterChange(event) {
        this.filters[event.target.name] = event.target.value;
    }

    handleConfirmation() {
        const form = this.template.querySelector(
            CONSTANT.CAR_FORM_SELECTOR
        );
        if (this.mode === CONSTANT.CREATE_MODE) {
            form.createNewCar();
        } else if (this.mode === CONSTANT.EDIT_MODE) {
            form.updateCar();
        }
    }

    handleModalLoading(event) {
        this.modalLoading = event.detail;
    }

    handleCreateRecord() {
        this.mode = CONSTANT.CREATE_MODE;
        this.handleShowNewCarModal();
    }

    handleEditRecord(event) {
        this.mode = CONSTANT.EDIT_MODE;
        this.carRecordId = event.detail.recordId;
        this.handleShowNewCarModal();
    }

    handleCarCreatedOrUpdated() {
        this.handleCloseNewCarModal();
        this.carRecordId = null;
        const datatable = this.template.querySelector(
            CONSTANT.PRODUCT_TABLE_SELECTOR
        );
        datatable.refreshData();
    }
}