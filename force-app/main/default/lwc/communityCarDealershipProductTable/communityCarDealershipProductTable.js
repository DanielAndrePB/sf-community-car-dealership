import { LightningElement, api, wire, track } from "lwc";
import isGuest from "@salesforce/user/isGuest";
import { refreshApex } from "@salesforce/apex";
import getCarProducts from "@salesforce/apex/CarDealershipGuestAccessController.getCarProducts";
import noCarsFound from "@salesforce/label/c.No_Cars_Found";
import { CAR_DEALERSHIP_PRODUCT_TABLE as CONSTANT } from 'c/constants';

const ACTIONS = [{ label: "Edit", name: CONSTANT.EDIT_ACTION }];

const COLUMNS = [
    { label: "Model", type: "text", fieldName: "Model" },
    { label: "Brand", type: "text", fieldName: "Brand" },
    {
        label: "Image",
        type: "image",
        typeAttributes: {
            src: { fieldName: "ImageURL" },
            altTex: { fieldName: "Name" }
        },
        cellAttributes: {
            class: "slds-align_absolute-center"
        }
    },
    { label: "Color", type: "text", fieldName: "Color" },
    { label: "Price", type: "currency", fieldName: "Price" }
];

const ADMIN_COLUMNS = [
    { label: "Active", type: "boolean", fieldName: "Active" },
    {
        type: "action",
        typeAttributes: {
            rowActions: ACTIONS,
            menuAlignment: "right"
        }
    }
];

export default class CommunityCarDealershipProductTable extends LightningElement {
    _columns = [];
    @track data = [];
    noDataMessage = noCarsFound;
    wiredResult;
    _showNoData = false;
    @api brandFilter;
    @api modelFilter;
    @api colorFilter;

    get carFilters() {
        return JSON.stringify({
            brandFilter: this.brandFilter,
            modelFilter: this.modelFilter,
            colorFilter: this.colorFilter
        });
    }

    get isGuestUser() {
        return isGuest;
    }

    get columns() {
        if (this.isGuestUser) {
            this._columns = COLUMNS;
        } else {
            this._columns = COLUMNS.concat(ADMIN_COLUMNS);
        }
        return this._columns;
    }

    get showNoData() {
        return this.data.length === 0;
    }

    @wire(getCarProducts, { filters: "$carFilters" })
    getWiredCarsData(result) {
        this.wiredResult = result;
        const { data, error } = result;
        if (data) {
            this.data = data.map((carProduct) => {
                return {
                    Id: carProduct.Id,
                    Model: carProduct.Model__c,
                    Brand: carProduct.Brand__c,
                    ImageURL: carProduct.Image_URL__c,
                    Color: carProduct.Color__c,
                    Price: carProduct.PricebookEntries[0].UnitPrice,
                    Active: carProduct.IsActive
                };
            });
        } else if (error) {
            console.error(error.body.message);
        }
    }

    @api refreshData() {
        refreshApex(this.wiredResult);
    }

    handleRowActions(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        if (actionName === CONSTANT.EDIT_ACTION) {
            this.dispatchEvent(
                new CustomEvent("editrecord", { detail: { recordId: row.Id } })
            );
        }
    }
}
