sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast"
], function (Controller, UIComponent, JSONModel, Fragment, MessageToast) {
    "use strict";

    return Controller.extend("masterdetailgs.masterdetailgs.controller.Students", {
        onInit: function () {
            var oModel = this.getOwnerComponent().getModel();
            if (!oModel) {
                console.error("OData model is not defined");
            }
            this.getView().setModel(oModel);
        },

        // call dialog voor student aanmaken
        onAddStudent: function () {
            this._openStudentDialog("Add Student", { isEdit: false, Firstname: "", Lastname: "", Email: "" });
        },

        // edit student
        onEditStudent: function (oEvent) {
            var oItem = oEvent.getSource().getParent().getParent();
            var sPath = oItem.getBindingContext().getPath();
            var oStudent = this.getView().getModel().getProperty(sPath);

            this._openStudentDialog("Edit Student", { isEdit: true, ...oStudent });
        },

        // Verwijder Student (.remove)
        onDeleteStudent: function (oEvent) {
            var oItem = oEvent.getSource().getParent().getParent();
            var sPath = oItem.getBindingContext().getPath();
            var oModel = this.getView().getModel();
            oModel.remove(sPath, {
                success: function () {
                    sap.m.MessageToast.show("Student deleted successfully for the system!");
                },
                error: function () {
                    sap.m.MessageToast.show("Error deleting student, contact the administrator!");
                }
            });
        },

        // ga naar detail pagina van die student voor fav games + email te zien.
        onViewDetails: function (oEvent) {
            var oItem = oEvent.getSource().getParent().getParent();
            var sPath = oItem.getBindingContext().getPath();
            var sStudentId = this.getView().getModel().getProperty(sPath + "/Sid");

            var oRouter = UIComponent.getRouterFor(this);
            oRouter.navTo("RouteStudentDetails", {
                studentId: sStudentId
            });
        },

        //Dialoge (fragment) voor edit/add (overzichtelijker dan een extra view)
        _openStudentDialog: function (sTitle, oStudentData) {
            var oView = this.getView();
            if (!this._pDialog) {
                this._pDialog = Fragment.load({
                    id: oView.getId(),
                    name: "masterdetailgs.masterdetailgs.view.StudentDialog",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }
            this._pDialog.then(function (oDialog) {
                oDialog.setTitle(sTitle);
                oDialog.setModel(new JSONModel(oStudentData));
                oDialog.open();
            });
        },

        // ok -> dialog =
        onSaveStudent: function () {
            var oDialog = this.byId("studentDialog");
            var oModel = this.getView().getModel();
            var oData = oDialog.getModel().getData();

            // VW IsEdit Property (anders crash)
            var oPayload = Object.assign({}, oData);
            delete oPayload.isEdit;

            // Verwijder SID property (word in backend al gemaakt door logische bewerking via max nr)
            if (!oData.isEdit) {
                delete oPayload.Sid;
            }

            // Niks mag leeg zijn bij create / edit.
            var aFields = [
                this.byId("firstNameInput"),
                this.byId("lastNameInput"),
                this.byId("emailInput")
            ];

            var bValid = true;
            aFields.forEach(function (oField) {
                if (!oField.getValue()) {
                    oField.setValueState("Error");
                    bValid = false;
                } else {
                    oField.setValueState("None");
                }
            });

            if (!bValid) {
                sap.m.MessageToast.show("Please fill in all fields");
                return;
            }

            if (oData.isEdit) {
                var sPath = "/StudentsSet(" + oData.Sid + ")";
                // Update Student
                oModel.update(sPath, oPayload, {
                    success: function () {
                        sap.m.MessageToast.show("Student updated successfully!");
                    },
                    error: function () {
                        sap.m.MessageToast.show("Error updating student, contact the administrator!");
                    }
                });
            } else {
                // Voeg student toe
                oModel.create("/StudentsSet", oPayload, {
                    success: function () {
                        sap.m.MessageToast.show("Student added successfully to the system!");
                    },
                    error: function (oError) {
                        console.error("Error adding student:", oError);
                        sap.m.MessageToast.show("Error adding student, contact the administrator!");
                    }
                });
            }

            oDialog.close();
        },

        // Sluit dialog
        onCancelDialog: function () {
            this.byId("studentDialog").close();
        }
    });
});
