// Gestão de Seguros AngularJS App
angular.module('gestaoSegurosApp', ['ngRoute'])
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/home.html',
                controller: 'HomeController'
            })
            .when('/propostas', {
                templateUrl: 'views/propostas.html',
                controller: 'PropostasController'
            })
            .when('/contratacoes', {
                templateUrl: 'views/contratacoes.html',
                controller: 'ContratacoesController'
            })
            .otherwise({
                redirectTo: '/'
            });
    }])
    .run(['$rootScope', function($rootScope) {
        $rootScope.loading = false;
        
        $rootScope.showLoading = function() {
            $rootScope.loading = true;
        };
        
        $rootScope.hideLoading = function() {
            $rootScope.loading = false;
        };
        
        $rootScope.showAlert = function(message, type) {
            $rootScope.alert = {
                message: message,
                type: type || 'info',
                show: true
            };
            
            setTimeout(function() {
                $rootScope.alert.show = false;
                $rootScope.$apply();
            }, 5000);
        };
        
        $rootScope.hideAlert = function() {
            $rootScope.alert.show = false;
        };
    }])
    .constant('API_CONFIG', {
        PROPOSTA_SERVICE: 'http://localhost:5001/api',
        CONTRATACAO_SERVICE: 'http://localhost:5002/api'
    })
    .filter('range', function() {
        return function(input, start, end) {
            var result = [];
            for (var i = start; i <= end; i++) {
                result.push(i);
            }
            return result;
        };
    });
