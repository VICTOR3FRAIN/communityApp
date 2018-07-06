(function (module) {
    mifosX.controllers = _.extend(module, {
        LoanBonusConfigurationController: function (scope, resourceFactory, location) {

            var loadConfig = function () {
                resourceFactory.loanBonusConfigResource.get(function (data) {
                    scope.formData = data;
                    scope.formData.glAccountToDebit = scope.formData.glAccountToDebit.glCode;
                    scope.formData.glAccountToCredit = scope.formData.glAccountToCredit.glCode;
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
                if(scope.loanbonusform.cycleToValue.$valid &&
                    scope.loanbonusform.cycleFromValue.$valid &&
                    scope.loanbonusform.cyclePercentValue.$valid){
                    if(!scope.formData.cycles)
                        scope.formData.cycles = [];
                    var conflict = false;
                    for (let index = 0; index < scope.formData.cycles.length; index++) {
                        const element = scope.formData.cycles[index];
                        if(scope.newcycle.fromValue > element.fromValue && scope.newcycle.fromValue < element.toValue)
                            conflict = true;
                        if(scope.newcycle.toValue > element.fromValue && scope.newcycle.toValue < element.toValue)
                            conflict = true;
                    }
                    if(!conflict){
                        scope.formData.cycles.push(scope.deepCopy(scope.newcycle));
                        scope.newcycle = {};
                    }
                }
            }

            scope.removeCycle = function(index){
                scope.formData.cycles.splice(index, 1);
            }

            scope.save = function(){
                if(scope.formData.id)
                    resourceFactory.loanBonusConfigResource.update({configId: scope.formData.id}, scope.formData, function (data) {
                        loadConfig();
                    });
                else
                    resourceFactory.loanBonusConfigResource.save(scope.formData, function (data) {
                        loadConfig();
                    });
            }

            scope.selectGlAccountDebit = function(){
                scope.formData.glAccountToDebitId = scope.formData.glAccountToDebit.id;
                scope.formData.glAccountToDebit = scope.formData.glAccountToDebit.glCode;
            }

            scope.selectGlAccountCredit = function(){
                scope.formData.glAccountToCreditId = scope.formData.glAccountToCredit.id;
                scope.formData.glAccountToCredit = scope.formData.glAccountToCredit.glCode;
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
