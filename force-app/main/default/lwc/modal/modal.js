import { LightningElement, api } from 'lwc';

export default class Modal extends LightningElement {
    @api header;

    @api loading = false;

    cancelAndCloseModal(){
        const closeEvent = new CustomEvent('closemodal');
        this.dispatchEvent(closeEvent);
    }
    
}