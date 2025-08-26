// Home Controller
angular.module('gestaoSegurosApp')
    .controller('HomeController', ['$scope', '$rootScope', 'ApiService', function($scope, $rootScope, ApiService) {
        
        $scope.stats = {
            totalPropostas: 0,
            propostasAprovadas: 0,
            propostasEmAnalise: 0,
            totalContratacoes: 0
        };
        
        $scope.recentPropostas = [];
        $scope.recentContratacoes = [];
        
        // Inicializar página
        $scope.init = function() {
            $scope.carregarEstatisticas();
            $scope.carregarDadosRecentes();
        };
        
        // Carregar estatísticas do dashboard
        $scope.carregarEstatisticas = function() {
            $rootScope.showLoading();
            
            // Carregar propostas para estatísticas
            ApiService.propostas.listar()
                .then(function(propostas) {
                    $scope.stats.totalPropostas = propostas.length;
                    $scope.stats.propostasAprovadas = propostas.filter(function(p) {
                        return p.status === ApiService.StatusProposta.APROVADA;
                    }).length;
                    $scope.stats.propostasEmAnalise = propostas.filter(function(p) {
                        return p.status === ApiService.StatusProposta.EM_ANALISE;
                    }).length;
                })
                .catch(function(error) {
                    console.error('Erro ao carregar estatísticas de propostas:', error);
                });
            
            // Carregar contratações para estatísticas
            ApiService.contratacoes.listar()
                .then(function(contratacoes) {
                    $scope.stats.totalContratacoes = contratacoes.length;
                })
                .catch(function(error) {
                    console.error('Erro ao carregar estatísticas de contratações:', error);
                })
                .finally(function() {
                    $rootScope.hideLoading();
                });
        };
        
        // Carregar dados recentes para exibir no dashboard
        $scope.carregarDadosRecentes = function() {
            // Carregar propostas recentes (últimas 5)
            ApiService.propostas.listar()
                .then(function(propostas) {
                    $scope.recentPropostas = propostas
                        .sort(function(a, b) {
                            return new Date(b.dataCriacao) - new Date(a.dataCriacao);
                        })
                        .slice(0, 5);
                })
                .catch(function(error) {
                    console.error('Erro ao carregar propostas recentes:', error);
                });
            
            // Carregar contratações recentes (últimas 5)
            ApiService.contratacoes.listar()
                .then(function(contratacoes) {
                    $scope.recentContratacoes = contratacoes
                        .sort(function(a, b) {
                            return new Date(b.dataContratacao) - new Date(a.dataContratacao);
                        })
                        .slice(0, 5);
                })
                .catch(function(error) {
                    console.error('Erro ao carregar contratações recentes:', error);
                });
        };
        
        // Métodos utilitários para usar no template
        $scope.getTipoClienteLabel = function(tipo) {
            return ApiService.TipoCliente.getLabel(tipo);
        };
        
        $scope.getTipoSeguroLabel = function(tipo) {
            return ApiService.TipoSeguro.getLabel(tipo);
        };
        
        $scope.getStatusLabel = function(status) {
            return ApiService.StatusProposta.getLabel(status);
        };
        
        $scope.getStatusBadgeClass = function(status) {
            return ApiService.StatusProposta.getBadgeClass(status);
        };
        
        $scope.formatCurrency = function(value) {
            return ApiService.formatCurrency(value);
        };
        
        $scope.formatDate = function(dateString) {
            return ApiService.formatDate(dateString);
        };
        
        // Inicializar quando o controller for carregado
        $scope.init();
    }]);
