/**
 * THESE CONSTANTS SHOULD REMAIN AT THE TOP OF THE FILE!
 <-----------------Start Navbar Constants--------------------------------------------------------------------------------->
 */
const navbarConstants = {
    HOME_LABEL: "Home",
    HOME_API: "Home",
    CARS_LABEL: "Cars/Models",
    CARS_API: "cars__c",
    APPOINTMENTS_LABEL: "Appointments",
    APPOINTMENTS_API: "appointments__c",
    SIMULATOR_LABEL: "Simulator",
    SIMULATOR_API: "simulator__c",
    COMMUNITY_NAMED_PAGE_TYPE: "comm__namedPage",
    LOGIN_API: "Login",
    REGISTER_API: "Register",
    CHECK_PASSWORD_API: "Check_Password",
    FORGOT_PASSWORD_API: "Forgot_Password"
};
/**
 <-----------------End Navbar Constants--------------------------------------------------------------------------------->
 */

/**
 * Stores the navbar items for each site.
 * Site -> ShowOrHide -> Access -> Items
 <-----------------Start Navbar Items--------------------------------------------------------------------------------->
 */
const navbarItems = {
    cardealership: {
        showOnPages: {
            admin: [
                {
                    label: navbarConstants.HOME_LABEL,
                    pageAPI: navbarConstants.HOME_API,
                    uniqueId: Symbol(navbarConstants.HOME_LABEL)
                },
                {
                    label: navbarConstants.CARS_LABEL,
                    pageAPI: navbarConstants.CARS_API,
                    uniqueId: Symbol(navbarConstants.CARS_LABEL)
                }
            ],
            guest: [
                {
                    label: navbarConstants.HOME_LABEL,
                    pageAPI: navbarConstants.HOME_API,
                    uniqueId: Symbol(navbarConstants.HOME_LABEL)
                },
                {
                    label: navbarConstants.CARS_LABEL,
                    pageAPI: navbarConstants.CARS_API,
                    uniqueId: Symbol(navbarConstants.CARS_LABEL)
                },
                {
                    label: navbarConstants.APPOINTMENTS_LABEL,
                    pageAPI: navbarConstants.APPOINTMENTS_API,
                    uniqueId: Symbol(navbarConstants.APPOINTMENTS_LABEL)
                },
                {
                    label: navbarConstants.SIMULATOR_LABEL,
                    pageAPI: navbarConstants.SIMULATOR_API,
                    uniqueId: Symbol(navbarConstants.SIMULATOR_LABEL)
                }
            ]
        },
        hideOnPages: [
            navbarConstants.LOGIN_API,
            navbarConstants.REGISTER_API,
            navbarConstants.CHECK_PASSWORD_API,
            navbarConstants.FORGOT_PASSWORD_API
        ]
    }
};
/**
 <-----------------End Navbar Items--------------------------------------------------------------------------------->
 */

export { navbarItems, navbarConstants };