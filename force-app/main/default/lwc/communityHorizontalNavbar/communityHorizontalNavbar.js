import { LightningElement, api, wire } from 'lwc';
import { NavigationMixin, CurrentPageReference } from 'lightning/navigation';
import isGuest from '@salesforce/user/isGuest';
import {navbarItems, navbarConstants} from './navbarItems';
export default class CommunityHorizontalNavbar extends NavigationMixin(LightningElement) {
    @api communitySite = '';
    _hideNavbar = false;
    _navItems = [];

    get isGuestUser(){
        return isGuest;
    }


    get navItems() {
        if(this.isGuestUser){
            this._navItems = navbarItems[this.communitySite]?.showOnPages.guest;
        }else{
            this._navItems = navbarItems[this.communitySite]?.showOnPages.admin;
        }
        return this._navItems;
    }

    get hideNavbar(){
        return this._hideNavbar;
    }

    @wire(CurrentPageReference)
    getWiredPageRef(result){
        if(result){
            const pageName = result.attributes?.name;
            this._hideNavbar = navbarItems[this.communitySite]?.hideOnPages.includes(pageName);
        }
    }

    getPageReference(apiName){
        return {
            type: navbarConstants.COMMUNITY_NAMED_PAGE_TYPE,
            attributes: {
                name: apiName
            }
        };
    }

    handleNavigation(event){
        const pageReference = this.getPageReference(event.currentTarget.dataset.page);
        this[NavigationMixin.Navigate](pageReference);
    }
}