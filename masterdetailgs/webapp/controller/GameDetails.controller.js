sap.ui.define([
  "sap/ui/core/mvc/Controller"
], function (Controller) {
  "use strict";

  return Controller.extend("masterdetailgs.masterdetailgs.controller.GameDetails", {
      onInit: function () {
          var oRouter = this.getOwnerComponent().getRouter();
          oRouter.getRoute("RouteGameDetails").attachPatternMatched(this._onObjectMatched, this);
      },

      _onObjectMatched: function (oEvent) {
          var sGameId = oEvent.getParameter("arguments").gameId;
          var iGameId = parseInt(sGameId, 10); // Voor int parse
          var sPath = "/GameSet(" + iGameId + ")";
          this.getView().bindElement(sPath);
      }
  });
});
