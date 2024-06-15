sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/Fragment",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator"
], function (Controller, Fragment, Filter, FilterOperator) {
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

          //  fetch en toon favgame/nummer based op gameid
          this._fetchFavoriteCount(iGameId);
      },

      _onBindingChange: function () {
          var oView = this.getView();
          var oElementBinding = oView.getElementBinding();

          if (!oElementBinding.getBoundContext()) {
              return;
          }

          var oContext = oElementBinding.getBoundContext();
          var oData = oContext.getObject();
          var sFormattedDate = this._formatDate(oData.Releasedate);
          oView.byId("gameReleaseDate").setText("Release Date: " + sFormattedDate);
      },

      // voor datum mooier te maken
      _formatDate: function (sDate) {
          if (sDate) {
              var oDate = new Date(sDate);
              var oOptions = { year: 'numeric', month: 'short', day: 'numeric' };
              return oDate.toLocaleDateString("en-US", oOptions);
          }
          return sDate;
      },

      // ivm aantal favorieten.
      _fetchFavoriteCount: function (iGameId) {
          var oModel = this.getView().getModel();

          oModel.read("/FavGamesSet", {
              success: function (oData) {
                  // Filter op gameid
                  var iFavoriteCount = oData.results.filter(function (game) {
                      return game.Gameid === iGameId;
                  }).length;

                  // Zet title volgens :
                  this.getView().byId("favoritesTitle").setText("Favorited by students: " + iFavoriteCount);
              }.bind(this),
              error: function (oError) {
                  console.error("Error fetching favorite count:", oError);
                  this.getView().byId("favoritesTitle").setText("Favorited by students: Error fetching data");
              }.bind(this)
          });
      }
  });
});
