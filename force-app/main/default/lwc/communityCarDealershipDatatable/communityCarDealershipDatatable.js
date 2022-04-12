import LightningDatatable from 'lightning/datatable';
import imageDataType from './imageDataType.html';

export default class CommunityCarDealershipDatatable extends LightningDatatable {
    static customTypes = {
        image: {
            template: imageDataType,
            typeAttributes: ['src', 'altText']
        }
    };
}