sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
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
