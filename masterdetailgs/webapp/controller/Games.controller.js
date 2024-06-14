sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/UIComponent"
], function (Controller, UIComponent) {
  "use strict";

  return Controller.extend("masterdetailgs.masterdetailgs.controller.Games", {
      onInit: function () {
          var oModel = this.getOwnerComponent().getModel();
          if (!oModel) {
              console.error("OData model is not defined");
          }
          this.getView().setModel(oModel);
      },
      onItemPress: function (oEvent) {
          var oItem = oEvent.getParameter("listItem") || oEvent.getSource();
          var oBindingContext = oItem.getBindingContext();

          if (!oBindingContext) {
              console.error("Binding context is undefined");
              return;
          }

          var sGameId = oBindingContext.getProperty("Id");

          if (!sGameId) {
              console.error("Game ID is undefined");
              return;
          }

          var oRouter = UIComponent.getRouterFor(this);
          oRouter.navTo("RouteGameDetails", {
              gameId: sGameId
          });
      }
  });
});

