public with sharing class CarDealershipWrapper {

    public class Car {
        @AuraEnabled public String model;
        @AuraEnabled public String brand;
        @AuraEnabled public CarImage image;
        @AuraEnabled public String color;
        @AuraEnabled public Decimal price;
        @AuraEnabled public Boolean active; 
    }

    public class CarImage {
        @AuraEnabled public String filename;
        public String base64;
    }

    public class CarSearchFilter {
        public String brandFilter;
        public String modelFilter;
        public String colorFilter;
    }

}
