public with sharing class CarDealershipController {
    @AuraEnabled(cacheable=true)
    public static CarDealershipWrapper.Car retrieveCarData(String recordId) {
        try {
            CarDealershipWrapper.Car carProduct = new CarDealershipWrapper.Car();
            String stdPricebookId = Utilities.getStdPriceBookId();
            Product2 product = [
                SELECT
                    Id,
                    Name,
                    Model__c,
                    Brand__c,
                    Image_URL__c,
                    Color__c,
                    IsActive,
                    Car_Image_Id__c,
                    (
                        SELECT UnitPrice
                        FROM PricebookEntries
                        WHERE Pricebook2Id = :stdPricebookId
                    )
                FROM Product2
                WHERE Id = :recordId
                LIMIT 1
            ];
            carProduct.image = new CarDealershipWrapper.CarImage();
            carProduct.image.filename = getImageCar(product.Car_Image_Id__c).Name;
            carProduct.model = product.Model__c;
            carProduct.brand = product.Brand__c;
            carProduct.color = product.Color__c;
            carProduct.price = product.PricebookEntries[0].UnitPrice;
            carProduct.active = product.IsActive;
            return carProduct;
        } catch (Exception ex) {
            AuraHandledException auraEx = new AuraHandledException(
                ex.getMessage()
            );
            auraEx.setMessage(ex.getMessage());
            throw auraEx;
        }
    }

    private static ContentDistribution getImageCar(String recordId) {
        try {
            ContentDistribution cDist = [
                SELECT Id, Name
                FROM ContentDistribution
                WHERE Id = :recordId
                LIMIT 1
            ];
            return cDist;
        } catch (Exception ex) {
            AuraHandledException auraEx = new AuraHandledException(
                ex.getMessage()
            );
            auraEx.setMessage(ex.getMessage());
            throw auraEx;
        }
    }

    @AuraEnabled
    public static void createCar(String carInfoJSON) {
        Savepoint savepoint = Database.setSavepoint();
        try {
            Id stdPriceBookId = Utilities.getStdPriceBookId();
            CarDealershipWrapper.Car wrapper = (CarDealershipWrapper.Car) JSON.deserialize(
                carInfoJSON,
                CarDealershipWrapper.Car.class
            );

            Product2 product = new Product2();
            product.Name = wrapper.brand + ' - ' + wrapper.model;
            product.Model__c = wrapper.model;
            product.Brand__c = wrapper.brand;
            product.Color__c = wrapper.color;
            product.IsActive = wrapper.active;
            product.Family = Constants.CAR_PRODUCT_FAMILY;
            insert product;

            PricebookEntry pbEntry = new PricebookEntry();
            pbEntry.Pricebook2Id = stdPriceBookId;
            pbEntry.Product2Id = product.Id;
            pbEntry.UnitPrice = wrapper.price;
            pbEntry.IsActive = wrapper.active;
            insert pbEntry;

            ContentDistribution cDist = uploadImageFile(
                wrapper.image,
                product.Id
            );
            product.Car_Image_Id__c = cDist.Id;
            product.Image_URL__c = cDist.ContentDownloadUrl;
            update product;
        } catch (Exception ex) {
            Database.rollback(savepoint);
            AuraHandledException auraEx = new AuraHandledException(
                ex.getMessage()
            );
            auraEx.setMessage(ex.getMessage());
            throw auraEx;
        }
    }

    @AuraEnabled
    public static void updateCar(String recordId, String carInfoJSON) {
        try {
            Id stdPriceBookId = Utilities.getStdPriceBookId();
            CarDealershipWrapper.Car wrapper = (CarDealershipWrapper.Car) JSON.deserialize(
                carInfoJSON,
                CarDealershipWrapper.Car.class
            );

            Product2 product = new Product2(Id = recordId);
            product.Name = wrapper.brand + ' - ' + wrapper.model;
            product.Model__c = wrapper.model;
            product.Brand__c = wrapper.brand;
            product.Color__c = wrapper.color;
            product.IsActive = wrapper.active;
            if (
                wrapper.image != null &&
                String.isNotBlank(wrapper.image.filename) &&
                String.isNotBlank(wrapper.image.base64)
            ) {
                ContentDistribution cDist = uploadImageFile(wrapper.image, recordId);
                product.Car_Image_Id__c = cDist.Id;
                product.Image_URL__c = cDist.ContentDownloadUrl;
            }
            update product;

            PricebookEntry pbEntry = [
                SELECT UnitPrice, IsActive
                FROM PricebookEntry
                WHERE Pricebook2Id = :stdPriceBookId AND Product2Id = :recordId
                LIMIT 1
            ];
            pbEntry.UnitPrice = wrapper.price;
            pbEntry.IsActive = wrapper.active;
            update pbEntry;
        } catch (Exception ex) {
            AuraHandledException auraEx = new AuraHandledException(
                ex.getMessage()
            );
            auraEx.setMessage(ex.getMessage());
            throw auraEx;
        }
    }

    private static ContentDistribution uploadImageFile(
        CarDealershipWrapper.CarImage image,
        String productId
    ) {
        ContentVersion cv = createContentVersion(image.base64, image.filename);
        ContentDocumentLink cdLink = createContentLink(cv.Id, productId);
        ContentDistribution cDist = createContentDistribution(cv.Id, cv.Title);
        return cDist;
    }

    private static ContentVersion createContentVersion(
        String base64,
        String filename
    ) {
        try {
            ContentVersion cv = new ContentVersion();
            cv.VersionData = EncodingUtil.base64Decode(base64);
            cv.Title = filename;
            cv.PathOnClient = filename;
            insert cv;
            return cv;
        } catch (DMLException ex) {
            AuraHandledException auraEx = new AuraHandledException(
                ex.getMessage()
            );
            auraEx.setMessage(ex.getMessage());
            throw auraEx;
        }
    }

    private static ContentDocumentLink createContentLink(
        String contentVersionId,
        String recordId
    ) {
        try {
            ContentVersion contentVersion = [
                SELECT ContentDocumentId
                FROM ContentVersion
                WHERE Id = :contentVersionId
                LIMIT 1
            ];
            ContentDocumentLink cdLink = new ContentDocumentLink();
            cdLink.ContentDocumentId = contentVersion.ContentDocumentId;
            cdLink.LinkedEntityId = recordId;
            cdLink.ShareType = Constants.VIEWER_SHARE_TYPE;
            cdLink.Visibility = Constants.ALL_USERS_VISIBILITY;
            insert cdLink;
            return cdLink;
        } catch (DMLException ex) {
            AuraHandledException auraEx = new AuraHandledException(
                ex.getMessage()
            );
            auraEx.setMessage(ex.getMessage());
            throw auraEx;
        }
    }

    private static ContentDistribution createContentDistribution(
        String contentVersionId,
        String filename
    ) {
        try {
            ContentDistribution cd = new ContentDistribution();
            cd.ContentVersionId = contentVersionId;
            cd.Name = filename;
            insert cd;
            ContentDistribution cDist = [
                SELECT Id, ContentDownloadUrl
                FROM ContentDistribution
                WHERE ContentVersionId = :contentVersionId
                LIMIT 1
            ];
            return cDist;
        } catch (Exception ex) {
            AuraHandledException auraEx = new AuraHandledException(
                ex.getMessage()
            );
            auraEx.setMessage(ex.getMessage());
            throw auraEx;
        }
    }
}