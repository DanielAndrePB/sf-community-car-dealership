public without sharing class CarDealershipGuestAccessController {
    /**
     * Returns the last 5 products with images to display on the car dealership image carousel.
     */
    @AuraEnabled(cacheable=true)
    public static List<Product2> getCarouselImages() {
        try {
            List<Product2> lstProductImages = [
                SELECT Id, Name, Image_URL__c
                FROM Product2
                WHERE Family = :Constants.CAR_PRODUCT_FAMILY AND IsActive = TRUE
                ORDER BY CreatedDate
                LIMIT 5
            ];
            return lstProductImages;
        } catch (Exception ex) {
            AuraHandledException auraEx = new AuraHandledException(
                ex.getMessage()
            );
            auraEx.setMessage(ex.getMessage());
            throw auraEx;
        }
    }

    /**
     * Return a list of cars (products) to show on the Car Dealership list
     */
    @AuraEnabled(cacheable=true)
    public static List<Product2> getCarProducts(String filters) {
        try {
            CarDealershipWrapper.CarSearchFilter searchFilters = (CarDealershipWrapper.CarSearchFilter) JSON.deserialize(
                filters,
                CarDealershipWrapper.CarSearchFilter.class
            );
            String brandFilter = searchFilters.brandFilter != null ? '%' + String.escapeSingleQuotes(searchFilters.brandFilter) + '%' : '%%';
            String modelFilter = searchFilters.modelFilter != null ? '%' + String.escapeSingleQuotes(searchFilters.modelFilter) + '%' : '%%';
            String colorFilter = searchFilters.colorFilter != null ? '%' + String.escapeSingleQuotes(searchFilters.colorFilter) + '%' : '%%';
            String stdPricebookId = Utilities.getStdPriceBookId();
            String carFamily = Constants.CAR_PRODUCT_FAMILY;
            Boolean isGuestUser = Utilities.isGuestUser();
            String query =
                'SELECT Id, Name, Model__c, Brand__c, Image_URL__c, Color__c, IsActive, ' +
                '(SELECT UnitPrice FROM PricebookEntries WHERE Pricebook2Id = :stdPricebookId) ' +
                'FROM Product2 ' +
                'WHERE Family = :carFamily AND ' +
                'Brand__c LIKE :brandFilter AND Model__c LIKE :modelFilter AND Color__c LIKE :colorFilter';
            if (isGuestUser) {
                query += ' AND IsActive = true';
            }
            List<Product2> lstProducts = Database.query(query);
            return lstProducts;
        } catch (Exception ex) {
            AuraHandledException auraEx = new AuraHandledException(
                ex.getMessage()
            );
            auraEx.setMessage(ex.getMessage());
            throw auraEx;
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Product2> getCarDownPaymentInformation() {
        try {
            String stdPricebookId = Utilities.getStdPriceBookId();
            List<Product2> lstProducts = [
                SELECT
                    Id,
                    Name,
                    (
                        SELECT UnitPrice
                        FROM PricebookEntries
                        WHERE Pricebook2Id = :stdPricebookId
                    )
                FROM Product2
                WHERE Family = :Constants.CAR_PRODUCT_FAMILY AND IsActive = TRUE
            ];
            return lstProducts;
        } catch (Exception ex) {
            AuraHandledException auraEx = new AuraHandledException(
                ex.getMessage()
            );
            auraEx.setMessage(ex.getMessage());
            throw auraEx;
        }
    }
}
