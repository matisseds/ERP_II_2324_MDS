sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/Fragment"
], function (Controller, Fragment) {
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
          this.getView().bindElement({
              path: sPath,
              events: {
                  change: this._onBindingChange.bind(this)
              }
          });
      },

      _onBindingChange: function () {
          var oView = this.getView();
          var oElementBinding = oView.getElementBinding();

          // Woops
          if (!oElementBinding.getBoundContext()) {
              return;
          }

          var oContext = oElementBinding.getBoundContext();
          var oData = oContext.getObject();
          var sFormattedDate = this._formatDate(oData.Releasedate);
          oView.byId("gameReleaseDate").setText("Release Date: " + sFormattedDate);
      },

      _formatDate: function (sDate) {
          if (sDate) {
              var oDate = new Date(sDate);
              var oOptions = { year: 'numeric', month: 'short', day: 'numeric' };
              return oDate.toLocaleDateString("en-US", oOptions);
          }
          return sDate;
      }
  });
});
