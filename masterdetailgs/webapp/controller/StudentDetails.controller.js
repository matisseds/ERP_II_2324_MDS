sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment"
], function (Controller, JSONModel, Fragment) {
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

        // Fav games binden
        _bindFavoriteGamesList: function () {
            var oFavGamesList = this.byId("favoriteGamesList");
            var oBinding = oFavGamesList.getBinding("items");
            if (oBinding && this.sStudentId) {
                var oFilter = new sap.ui.model.Filter("Studentid", sap.ui.model.FilterOperator.EQ, this.sStudentId);
                oBinding.filter([oFilter]);
            } else {
                console.warn("Binding or StudentId not available.");
            }
        },

        // dialog openen fav games toevoegen
        onAddFavoriteGame: function () {
            var oView = this.getView();
            var sStudentId = oView.getBindingContext().getProperty("Sid");

            this._openAddFavoriteGameDialog(sStudentId);
        },

        // dialog logica
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

        // fav game toevoegen via dialog
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

            oModel.create("/FavGamesSet", oPayload, {
                success: function () {
                    sap.m.MessageToast.show("Favorite game added successfully");
                },
                error: function () {
                    sap.m.MessageToast.show("You already added this game to favorites");
                }
            });

            oDialog.close();
        },

        // fav game vw met knop delete
        onRemoveFavoriteGame: function (oEvent) {
            var oItem = oEvent.getSource().getParent();
            var sPath = oItem.getBindingContext().getPath();
            var oModel = this.getView().getModel();

            oModel.remove(sPath, {
                success: function () {
                    sap.m.MessageToast.show("Favorite game removed successfully");
                },
                error: function () {
                    sap.m.MessageToast.show("Error removing favorite game");
                }
            });
        },

        // dialog cancellen
        onCancelDialog: function () {
            this.byId("addFavoriteGameDialog").close();
        },

        formatGameName: function (sGameId) {
            var oModel = this.getView().getModel();
            var sPath = "/GameSet(" + sGameId + ")";

            return new Promise(function (resolve, reject) {
                oModel.read(sPath, {
                    success: function (oData) {
                        resolve(oData.Name);
                    },
                    error: function (error) {
                        resolve(sGameId); // toont gwn id als namen niet op te halen zijn (safe)
                    }
                });
            });
        },

        // nav naar gamedetails van die fav game.
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
