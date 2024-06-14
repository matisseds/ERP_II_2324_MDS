sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "masterdetailgs/masterdetailgs/model/models",
    "sap/ui/model/odata/v2/ODataModel"
], function (UIComponent, Device, models, ODataModel) {
    "use strict";

    return UIComponent.extend("masterdetailgs.masterdetailgs.Component", {
        metadata: {
            manifest: "json"
        },

        init: function () {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the OData model
            var oModel = new ODataModel("/sap/opu/odata/sap/ZAS_61_GAMES_GW_SRV/");
            this.setModel(oModel);

            // enable routing
            this.getRouter().initialize();

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

             // include custom CSS
             jQuery.sap.includeStyleSheet("css/style.css");
        }
    });
});


