sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("masterdetailgs.masterdetailgs.controller.StudentDetails", {
        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("RouteStudentDetails").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {
            var sStudentId = oEvent.getParameter("arguments").studentId;
            var sPath = "/StudentsSet(" + sStudentId + ")";
            this.getView().bindElement(sPath);

            // Apply filter to favorite games list based on Studentid
            var oFavGamesList = this.byId("favoriteGamesList");
            var oBinding = oFavGamesList.getBinding("items");
            if (oBinding) {
                var oFilter = new Filter("Studentid", FilterOperator.EQ, sStudentId);
                oBinding.filter([oFilter]);
            }
        },

        onAddFavoriteGame: function () {
            // Implement the logic to add a favorite game for the student
            // For example, open a dialog to select and add a favorite game
        },

        onRemoveFavoriteGame: function (oEvent) {
            var oItem = oEvent.getSource();
            var sPath = oItem.getBindingContext().getPath();
            var oModel = this.getView().getModel();

            // Implement the logic to remove a favorite game
            // For example, send a DELETE request to the OData service
            oModel.remove(sPath, {
                success: function () {
                    sap.m.MessageToast.show("Favorite game removed successfully");
                },
                error: function () {
                    sap.m.MessageToast.show("Error removing favorite game");
                }
            });
        }
    });
});
