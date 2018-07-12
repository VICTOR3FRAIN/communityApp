(function (module) {
    mifosX.controllers = _.extend(module, {
        LoanBonusConfigurationController: function (scope, resourceFactory, location) {

            var loadConfig = function () {
                resourceFactory.loanBonusConfigResource.get(function (data) {
                    scope.loanBonusFormData = data;
                    scope.loanBonusFormData.glAccountToDebit = scope.loanBonusFormData.glAccountToDebit.glCode;
                    scope.loanBonusFormData.glAccountToCredit = scope.loanBonusFormData.glAccountToCredit.glCode;
                });   
            }
            loadConfig();
            var loadGlAccounts = function(){
                resourceFactory.accountCoaResource.getAllAccountCoas({type: 1}, function (data) {
                    scope.glAccounts = data;
                    scope.glAccounts.forEach(element => {
                        element.autocompleteLabel = element.glCode + " " + element.name;
                    });
                });
            }
            loadGlAccounts();

            scope.addCycle = function(){
                scope.showErrorCycle = false;
                angular.forEach(scope.loanbonusform.$$controls, function (field) {
                    field.$validate();
                });
                if(scope.loanbonusform.cycleToValue.$valid &&
                    scope.loanbonusform.cycleFromValue.$valid &&
                    scope.loanbonusform.cyclePercentValue.$valid 
                    && scope.newcycle.fromValue && scope.newcycle.toValue && scope.newcycle.percentValue){
                    if(!scope.loanBonusFormData.cycles)
                        scope.loanBonusFormData.cycles = [];
                    var conflict = false;
                    for (let index = 0; index < scope.loanBonusFormData.cycles.length; index++) {
                        const element = scope.loanBonusFormData.cycles[index];
                        if(scope.newcycle.fromValue >= element.fromValue && scope.newcycle.fromValue <= element.toValue)
                            conflict = true;
                        if(scope.newcycle.toValue >= element.fromValue && scope.newcycle.toValue <= element.toValue)
                            conflict = true;
                    }
                    if(conflict){
                        scope.showErrorCycle = true;
                        scope.errorMsgCycle = 'label.rangealreadyincluded';
                    }
                    if(!conflict){
                        scope.loanBonusFormData.cycles.push(scope.deepCopy(scope.newcycle));
                        scope.newcycle = {};
                    }
                } else {
                }
            }

            scope.removeCycle = function(index){
                scope.loanBonusFormData.cycles.splice(index, 1);
            }

            scope.save = function(){
                if(scope.loanBonusFormData.id)
                    resourceFactory.loanBonusConfigResource.update({configId: scope.loanBonusFormData.id}, scope.loanBonusFormData, function (data) {
                        scope.showSuccess = true;
                        loadConfig();
                    });
                else
                    resourceFactory.loanBonusConfigResource.save(scope.loanBonusFormData, function (data) {
                        scope.showSuccess = true;
                        loadConfig();
                    });
            }

            scope.selectGlAccountDebit = function(){
                scope.loanBonusFormData.glAccountToDebitId = scope.loanBonusFormData.glAccountToDebit.id;
                scope.loanBonusFormData.glAccountToDebit = scope.loanBonusFormData.glAccountToDebit.glCode;
            }

            scope.selectGlAccountCredit = function(){
                scope.loanBonusFormData.glAccountToCreditId = scope.loanBonusFormData.glAccountToCredit.id;
                scope.loanBonusFormData.glAccountToCredit = scope.loanBonusFormData.glAccountToCredit.glCode;
            }

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
    mifosX.ng.application.controller('LoanBonusConfigurationController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.LoanBonusConfigurationController]).run(function ($log) {
        $log.info("LoanBonusConfigurationController initialized");
    });
}(mifosX.controllers || {}));
