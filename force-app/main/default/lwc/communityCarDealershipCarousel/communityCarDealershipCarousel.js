import { LightningElement, wire } from "lwc";
import getCarouselImages from "@salesforce/apex/CarDealershipGuestAccessController.getCarouselImages";

export default class CommunityCarDealershipCarousel extends LightningElement {
    carProductImages = [];
    carouselLoaded = false;

    @wire(getCarouselImages)
    getWiredCarouselImages(result) {
        const {data, error} = result;
        if (data) {
            this.carProductImages = data.map((productObj) => {
                return {
                    uniqueId: productObj.Id,
                    source: productObj.Image_URL__c,
                    header: productObj.Name,
                    altText: productObj.Name
                };
            });
            this.carouselLoaded = true;
        } else if (error) {
            this.carouselLoaded = false;
        }
    }
}