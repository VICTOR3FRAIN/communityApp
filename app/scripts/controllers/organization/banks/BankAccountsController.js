(function (module) {
    mifosX.controllers = _.extend(module, {
        BankAccountsController: function (scope, routeParams, resourceFactory, location, $uibModal) {

            scope.accounts = [];
            scope.glAccountsData = [];

            scope.AccountsPerPage = 15;
            var loadAccounts = function () {
                resourceFactory.bankAccountsResource.getAllAccounts({bankId: routeParams.bankId},function (data) {
                    scope.accounts = data;
                });   
            }
            var loadBankAccountOptions = function () {
                resourceFactory.bankAccountOptionsResource.get({bankId: routeParams.bankId}, function (data) {
                    scope.options = data;
                });   
            }
            var loadGlAccounts = function(){
                resourceFactory.accountCoaResource.getAllAccountCoas({usage: 1}, function (data) {
                    scope.glAccounts = data;
                    scope.glAccounts.forEach(element => {
                        element.autocompleteLabel = element.glCode + " " + element.name;
                    });
                });
            }
            loadAccounts();
            loadBankAccountOptions();
            loadGlAccounts();

            scope.openDialog = function(ev) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'editaccount.html',
                    controller: BankAccountEditCtrl,
                    resolve: {
                        bankId: function () {
                            return routeParams.bankId;
                        },
                        bankAccountId: function () {
                            return undefined;
                        },
                        resourceFactory: function(){
                            return resourceFactory;
                        },
                        bankOptions: function(){
                            return scope.options;
                        },
                        glAccounts: function(){
                            return scope.glAccounts;
                        }
                    }
                });
                modalInstance.result.then(function(updateList) {
                    if(updateList)
                        loadAccounts();
                });
            }

            scope.editBankAccount = function(bankAccountId) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'editaccount.html',
                    controller: BankAccountEditCtrl,
                    resolve: {
                        bankId: function () {
                            return routeParams.bankId;
                        },
                        bankAccountId: function () {
                            return bankAccountId;
                        },
                        resourceFactory: function(){
                            return resourceFactory;
                        },
                        bankOptions: function(){
                            return scope.options;
                        },
                        glAccounts: function(){
                            return scope.glAccounts;
                        }
                    }
                });
                modalInstance.result.then(function(updateList) {
                    if(updateList)
                        loadAccounts();
                });
            }

            scope.deleteBankAccount = function(bankAccount) {
                $uibModal.open({
                    templateUrl: 'deletetemplate.html',
                    controller: function ($scope, $uibModalInstance, updateList, bankAccount) {
                        $scope.account = bankAccount;
                        $scope.delete = function () {
                            resourceFactory.bankAccountsResource.delete({bankId: routeParams.bankId, accountId: bankAccount.id}, function (data) {
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
                            return loadAccounts;
                        },
                        bankAccount: function(){
                            return bankAccount;
                        }
                    }
                });
            }

            var BankAccountEditCtrl = function ($scope, $uibModalInstance, bankAccountId, bankId, bankOptions, glAccounts) {
                $scope.formData = {};
                $scope.bankOptions = bankOptions;
                $scope.glAccounts = glAccounts;
                $scope.exists = false;
                if(bankAccountId){
                    resourceFactory.bankAccountsResource.get({bankId: bankId, accountId: bankAccountId}, function (data) {
                        $scope.formData = data;
                        $scope.formData.glAccountId = data.glAccount.id;
                        $scope.formData.glAccountGL = data.glAccount.glCode;
                        $scope.formData.bankUseId = data.accUse.id;
                        $scope.formData.bankAccountStatusId = data.status.id;
                        $scope.exists = true;
                    });
                }
                $scope.save = function () {
                    if($scope.exists)
                        resourceFactory.bankAccountsResource.update({bankId: bankId, accountId: bankAccountId}, $scope.formData, function (data) {
                            $uibModalInstance.close(true);
                        });
                    else
                        resourceFactory.bankAccountsResource.save({bankId: bankId}, $scope.formData, function (data) {
                            $uibModalInstance.close(true);
                        });
                };

                $scope.selectGlAccount = function(){
                    $scope.formData.glAccountId = $scope.formData.glAccountGL.id;
                    $scope.formData.glAccountGL = $scope.formData.glAccountGL.glCode;
                }
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
    mifosX.ng.application.controller('BankAccountsController', ['$scope', '$routeParams','ResourceFactory', '$location', '$uibModal', mifosX.controllers.BankAccountsController]).run(function ($log) {
        $log.info("BankAccountsController initialized");
    });
}(mifosX.controllers || {}));
