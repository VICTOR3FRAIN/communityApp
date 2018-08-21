(function (module) {
    mifosX.controllers = _.extend(module, {
        EditOfficeController: function (scope, routeParams, resourceFactory, location, dateFilter) {
            scope.formData = {};
            scope.first = {};
            scope.restrictDate = new Date();
            resourceFactory.officeResource.getAllOffices(function (data) {
                scope.parentId = data[0].id;
            });
            resourceFactory.officeTemplateResource.get(function (data) {
                scope.officeTypes = data.officeTypes;
            });
            resourceFactory.officeResource.get({officeId: routeParams.id, template: 'true'}, function (data) {
                scope.offices = data.allowedParents;
                scope.id = data.id;
                if (data.openingDate) {
                    var editDate = dateFilter(data.openingDate, scope.df);
                    scope.first.date = new Date(editDate);
                }
                scope.formData =
                {
                    name: data.name,
                    externalId: data.externalId,
                    parentId: data.parentId,
                    officeTypeId: data.officeType.id,
                    address: data.address,
                    colony: data.colony,
                    state: data.state,
                    municipality: data.municipality,
                    phone: data.phone, 
                    une: data.une,
                    postalCode: data.postalCode
                };
                scope.selectedParent = {
                    id: data.parentId
                };
            });

            scope.selectOfficeType = function(){
                if(scope.formData.officeTypeId == 1){
                    console.log('changed')
                    scope.selectedParent = {
                        id: 0
                    };
                    scope.formData.parentId = 0;
                }
            }

            scope.submit = function () {
                var reqDate = dateFilter(scope.first.date, scope.df);
                if(scope.selectedParent)
                    this.formData.parentId = scope.selectedParent.id;
                else
                    this.formData.parentId = 0;
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                this.formData.openingDate = reqDate;
                resourceFactory.officeResource.update({'officeId': routeParams.id}, this.formData, function (data) {
                    location.path('/viewoffice/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('EditOfficeController', ['$scope', '$routeParams', 'ResourceFactory', '$location', 'dateFilter', mifosX.controllers.EditOfficeController]).run(function ($log) {
        $log.info("EditOfficeController initialized");
    });
}(mifosX.controllers || {}));
