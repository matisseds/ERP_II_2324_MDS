sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("masterdetailgs.masterdetailgs.controller.Home", {
        //navigeer students
        onNavToStudents: function () {
            this.getOwnerComponent().getRouter().navTo("RouteStudents");
        },
        //navigeer game
        onNavToGames: function () {
            this.getOwnerComponent().getRouter().navTo("RouteGames");
        }
    });
});
