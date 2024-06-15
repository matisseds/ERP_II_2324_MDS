sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, JSONModel, Fragment, Filter, FilterOperator) {
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

            this.sStudentId = sStudentId;
            this._bindFavoriteGamesList();
        },

        _bindFavoriteGamesList: function () {
            var oFavGamesList = this.byId("favoriteGamesList");
            var oBinding = oFavGamesList.getBinding("items");
            if (oBinding && this.sStudentId) {
                // Check of sid een int4 is.
                var iStudentId = parseInt(this.sStudentId, 10);
                if (!isNaN(iStudentId)) {
                    // Pak alle favgames eerst
                    var oModel = this.getView().getModel();
                    oModel.read("/FavGamesSet", {
                        success: function (oData) {
                            // Filter het op basis van de studentid (favgames waar studentid = x)
                            var aFilteredGames = oData.results.filter(function (game) {
                                return game.Studentid === iStudentId;
                            });

                            // Gefilterde data naar de lijst.
                            var oFavGamesModel = new JSONModel(aFilteredGames);
                            oFavGamesList.setModel(oFavGamesModel);
                            oFavGamesList.bindItems({
                                path: "/",
                                template: oFavGamesList.getBindingInfo("items").template
                            });
                        }.bind(this),
                        error: function (oError) {
                            console.error("Error fetching favorite games:", oError);
                        }
                    });
                } else {
                    console.error("Invalid Student ID");
                }
            } else {
                console.warn("Binding or StudentId not available.");
            }
        },

        // call dialog toevoegen
        onAddFavoriteGame: function () {
            var oView = this.getView();
            var sStudentId = oView.getBindingContext().getProperty("Sid");

            this._openAddFavoriteGameDialog(sStudentId);
        },

        // dialog stuff (niet belangrijk, mooi voor frontend)
        _openAddFavoriteGameDialog: function (sStudentId) {
            var oView = this.getView();

            if (!this._pDialog) {
                this._pDialog = Fragment.load({
                    id: oView.getId(),
                    name: "masterdetailgs.masterdetailgs.view.AddFavoriteGameDialog",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    oDialog.setModel(new JSONModel({ studentId: sStudentId }), "dialogModel");
                    return oDialog;
                }.bind(this));
            } else {
                this._pDialog.then(function (oDialog) {
                    oDialog.getModel("dialogModel").setProperty("/studentId", sStudentId);
                });
            }

            this._pDialog.then(function (oDialog) {
                oDialog.open();
            });
        },

        // toevoeging aan fav process
        onAddFavoriteGameConfirm: function () {
            var oDialog = this.byId("addFavoriteGameDialog");
            var oModel = this.getView().getModel();
            var oDialogModel = oDialog.getModel("dialogModel");
            var oData = oDialogModel.getData();

            var sSelectedGameId = this.byId("gameSelect").getSelectedKey();

            if (!sSelectedGameId) {
                sap.m.MessageToast.show("Please select a game");
                return;
            }

            var oPayload = {
                Gameid: parseInt(sSelectedGameId, 10),
                Studentid: parseInt(oData.studentId, 10)
            };

            // voegt game toe aan favorieten.
            oModel.create("/FavGamesSet", oPayload, {
                success: function () {
                    sap.m.MessageToast.show("Favorite game added successfully");
                    // refreshed de lijst (anders moest je pagina reloaden)
                    this._bindFavoriteGamesList();
                }.bind(this),
                error: function () {
                    sap.m.MessageToast.show("You already added this game to favorites");
                }
            });

            oDialog.close();
        },

        onRemoveFavoriteGame: function (oEvent) {
            var oItem = oEvent.getSource().getParent();
            var oBindingContext = oItem.getBindingContext();
            var sGameId = oBindingContext.getProperty("Gameid");
            var sStudentId = oBindingContext.getProperty("Studentid");
            var oModel = this.getView().getModel();
        
            // Debug stuff (werkte eerst niet)
            console.log("Gameid:", sGameId);
            console.log("Studentid:", sStudentId);
        
            // check of sGameId en sStudentId niet leeg zijn
            if (sGameId && sStudentId) {
                // Pad (apart van de item aangezien dat niet het pad is waar de favgame moet vw worden)
                var sFullPath = "/FavGamesSet(Gameid=" + sGameId + ",Studentid=" + sStudentId + ")";
        
                oModel.remove(sFullPath, {
                    success: function () {
                        sap.m.MessageToast.show("Game has been succesfully removed from favorites!");
                        // refreshed de lijst (anders moest je pagina reloaden)
                        this._bindFavoriteGamesList();
                    }.bind(this),
                    error: function (oError) {
                        sap.m.MessageToast.show("You don't have this game in your favorites anymore, please reload!");
                        console.error("Error removing favorite game:", oError);
                    }
                });
            } else {
                console.error("Invalid Gameid or Studentid:", sGameId, sStudentId);
                sap.m.MessageToast.show("Invalid Game ID or Student ID");
            }
        }
        ,

        // sluit dialog (niks gebeurd met gegevens)
        onCancelDialog: function () {
            this.byId("addFavoriteGameDialog").close();
        },

        formatGameName: function (sGameId) {
            if (!sGameId) {
                return ""; // Geef niks terug (anders error console, makkelijkst zo oplossen)
            }
            
            var oModel = this.getView().getModel();
            var sPath = "/GameSet(" + sGameId + ")";
        
            return new Promise(function (resolve, reject) {
                oModel.read(sPath, {
                    success: function (oData) {
                        resolve(oData.Name);
                    },
                    error: function (error) {
                        resolve(sGameId); // Geef id als namen niet werken (zou normaal niet mogen maar als zzekerheid)
                    }
                });
            });
        },
        

        // navigeer naar game details als er op de naam vd favgame word gedrukt.
        onNavToGameDetails: function (oEvent) {
            var oItem = oEvent.getSource();
            var sGameId = oItem.getBindingContext().getProperty("Gameid");
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteGameDetails", {
                gameId: sGameId
            });
        }
    });
});
