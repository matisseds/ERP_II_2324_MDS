sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("masterdetailgs.masterdetailgs.controller.Home", {
        onNavToStudents: function () {
            this.getOwnerComponent().getRouter().navTo("RouteStudents");
        },
        onNavToGames: function () {
            this.getOwnerComponent().getRouter().navTo("RouteGames");
        }
    });
});
