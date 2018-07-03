(function (module) {
    mifosX.controllers = _.extend(module, {
        BanksController: function (scope, resourceFactory, location, $uibModal) {

            scope.banks = [];

            scope.BanksPerPage = 15;
            var loadBanks = function () {
                resourceFactory.bankCatalogueResource.getAllBanks(function (data) {
                    scope.banks = data;
                });   
            }
            var loadBankOptions = function () {
                resourceFactory.bankCatalogueOptionsResource.get(function (data) {
                    scope.options = data;
                });   
            }
            loadBanks();
            loadBankOptions();
            scope.openDialog = function(ev) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'editbank.html',
                    controller: BankEditCtrl,
                    resolve: {
                        bankId: function () {
                            return undefined;
                        },
                        resourceFactory: function(){
                            return resourceFactory;
                        },
                        bankOptions: function(){
                            return scope.options;
                        }
                    }
                });
                modalInstance.result.then(function(updateList) {
                    if(updateList)
                        loadBanks();
                });
            }

            scope.routeToBankAccounts = function(bankId) {
                location.path('/bank/' + bankId + '/accounts');
            }

            scope.editBank = function(bankId) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'editbank.html',
                    controller: BankEditCtrl,
                    resolve: {
                        bankId: function () {
                            return bankId;
                        },
                        resourceFactory: function(){
                            return resourceFactory;
                        },
                        bankOptions: function(){
                            return scope.options;
                        }
                    }
                });
                modalInstance.result.then(function(updateList) {
                    if(updateList)
                        loadBanks();
                });
            }

            scope.deleteBank = function(bank) {
                $uibModal.open({
                    templateUrl: 'deletetemplate.html',
                    controller: function ($scope, $uibModalInstance, updateList, bank) {
                        $scope.bank = bank;
                        $scope.delete = function () {
                            resourceFactory.bankCatalogueResource.delete({bankId: bank.id}, function (data) {
                                updateList();
                                $uibModalInstance.close();    
                            });
                        };
                      
                        $scope.cancel = function () {
                          $uibModalInstance.dismiss('cancel');
                        };
                    },
                    resolve: {
                        updateList: function(){
                            return loadBanks;
                        },
                        bank: function(){
                            return bank;
                        }
                    }
                });
            }

            var BankEditCtrl = function ($scope, $uibModalInstance, bankId, bankOptions) {
                $scope.formData = {};
                $scope.bankOptions = bankOptions;
                if(bankId)
                    resourceFactory.bankCatalogueResource.get({bankId: bankId}, function (data) {
                        $scope.formData = data;
                        $scope.formData.bankStatusId = $scope.formData.status.id; 
                        $scope.formData.bankTypeId = $scope.formData.type.id;
                    });
                $scope.save = function () {
                    if($scope.formData.id)
                        resourceFactory.bankCatalogueResource.update({bankId: bankId}, $scope.formData, function (data) {
                            $uibModalInstance.close(true);
                        });
                    else
                        resourceFactory.bankCatalogueResource.save($scope.formData, function (data) {
                            $uibModalInstance.close(true);
                        });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };

            scope.deepCopy = function (obj) {
                if (Object.prototype.toString.call(obj) === '[object Array]') {
                    var out = [], i = 0, len = obj.length;
                    for (; i < len; i++) {
                        out[i] = arguments.callee(obj[i]);
                    }
                    return out;
                }
                if (typeof obj === 'object') {
                    var out = {}, i;
                    for (i in obj) {
                        out[i] = arguments.callee(obj[i]);
                    }
                    return out;
                }
                return obj;
            }



        }
    });
    mifosX.ng.application.controller('BanksController', ['$scope', 'ResourceFactory', '$location', '$uibModal', mifosX.controllers.BanksController]).run(function ($log) {
        $log.info("BanksController initialized");
    });
}(mifosX.controllers || {}));
