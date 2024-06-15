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

            // Filter studenten (nogniet werkent, backend foutje vgm)
            var oFavGamesList = this.byId("favoriteGamesList");
            var oBinding = oFavGamesList.getBinding("items");
            if (oBinding) {
                var oFilter = new sap.ui.model.Filter("Studentid", sap.ui.model.FilterOperator.EQ, sStudentId);
                oBinding.filter([oFilter]);
            }
        },

        onAddFavoriteGame: function () {
            var oView = this.getView();
            var sStudentId = oView.getBindingContext().getProperty("Sid");
            var oModel = this.getView().getModel();


                // Laad Gameset (voor combobox)
                oModel.read("/GameSet", {
                    success: function (oData) {
                        console.log("GameSet data loaded:", oData);
                        oModel.setProperty("/GameSet", oData.results);
                        this._openAddFavoriteGameDialog(sStudentId);
                    }.bind(this),
                    error: function () {
                        sap.m.MessageToast.show("Error loading games");
                    }
                });
        },

        //Popup
        _openAddFavoriteGameDialog: function (sStudentId) {
            var oView = this.getView();

            if (!this._pDialog) {
                this._pDialog = Fragment.load({
                    id: oView.getId(),
                    name: "masterdetailgs.masterdetailgs.view.AddFavoriteGameDialog",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    // geef studentid mee voor game toevoegen in fav
                    oDialog.setModel(new JSONModel({ studentId: sStudentId }), "dialogModel");
                    console.log("Dialog model data:", oDialog.getModel("dialogModel").getData());
                    return oDialog;
                }.bind(this));
            } else {
                this._pDialog.then(function (oDialog) {
                    oDialog.getModel("dialogModel").setProperty("/studentId", sStudentId);
                });
            }

            this._pDialog.then(function (oDialog) {
                oDialog.open();
                console.log("Dialog opened with data:", oDialog.getModel("dialogModel").getData());
            });
        },

        onAddFavoriteGameConfirm: function () {
            var oDialog = this.byId("addFavoriteGameDialog");
            var oModel = this.getView().getModel();
            var oDialogModel = oDialog.getModel("dialogModel");
            var oData = oDialogModel.getData();

            // gameid via combobox
            var sSelectedGameId = this.byId("gameSelect").getSelectedKey();

            if (!sSelectedGameId) {
                sap.m.MessageToast.show("Please select a game");
                return;
            }

            // Payload vr game
            var oPayload = {
                Gameid: parseInt(sSelectedGameId, 10),
                Studentid: parseInt(oData.studentId, 10)
            };

            // Nieuwe favo game toevoegen
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

        onRemoveFavoriteGame: function (oEvent) {
            var oItem = oEvent.getSource();
            var sPath = oItem.getBindingContext().getPath();
            var oModel = this.getView().getModel();

            // Druk op game om te verwijderen momenteel* later naar knop!
            oModel.remove(sPath, {
                success: function () {
                    sap.m.MessageToast.show("Favorite game removed successfully");
                },
                error: function () {
                    sap.m.MessageToast.show("Error removing favorite game");
                }
            });
        },
        //close de dialog
        onCancelDialog: function () {
            this.byId("addFavoriteGameDialog").close();
        }
    });
});




