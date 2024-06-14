sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/UIComponent",
  "sap/ui/model/json/JSONModel"
], function (Controller, UIComponent, JSONModel) {
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

          var sGameId = oBindingContext.getProperty("Id");
          var oRouter = UIComponent.getRouterFor(this);
          oRouter.navTo("RouteGameDetails", {
              gameId: sGameId
          });
      },
      formatDate: function (sDate) {
          if (sDate) {
              var oDate = new Date(sDate);
              var oOptions = { year: 'numeric', month: 'short', day: 'numeric' };
              return oDate.toLocaleDateString("en-US", oOptions);
          }
          return sDate;
      }
  });
});

