global with sharing class NavbarItemsPicklist extends VisualEditor.DynamicPickList{

    global override VisualEditor.DataRow getDefaultValue(){
        VisualEditor.DataRow defaultSite = new VisualEditor.DataRow('Car Dealership', 'cardealership');
        return defaultSite;
    }
    global override VisualEditor.DynamicPickListRows getValues() {
        VisualEditor.DataRow site = new VisualEditor.DataRow('Car Dealership', 'cardealership');
        VisualEditor.DynamicPickListRows mySites = new VisualEditor.DynamicPickListRows();
        mySites.addRow(site);
        return mySites;
    }
}
