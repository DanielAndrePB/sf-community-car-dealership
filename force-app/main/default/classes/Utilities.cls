public without sharing class Utilities {

    /* -------------------------------------------------------------------------- */
    /*                        Standard Pricebook Singleton                        */
    /* -------------------------------------------------------------------------- */
    private static Pricebook2 stdPriceBook;

    public static Id getStdPriceBookId() {
        if (Test.isRunningTest()){
            return Test.getStandardPricebookId();
        }
        return getStdPricebook().Id;
    }

    public static Pricebook2 getStdPriceBook() {
        if (stdPriceBook == null){
            stdPriceBook = [SELECT Id from Pricebook2 WHERE isStandard = true LIMIT 1];
        }
        return stdPriceBook;    
    }

    /* -------------------------------------------------------------------------- */
    /*                              Guest User Check                              */
    /* -------------------------------------------------------------------------- */
    public static Boolean isGuestUser() { 
        return Auth.CommunitiesUtil.isGuestUser();
    }
}
