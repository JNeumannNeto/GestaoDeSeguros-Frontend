// Contratações Controller
angular.module('gestaoSegurosApp')
    .controller('ContratacoesController', ['$scope', '$rootScope', 'ApiService', function($scope, $rootScope, ApiService) {
        
        $scope.contratacoes = [];
        $scope.propostas = [];
        $scope.propostasAprovadas = [];
        $scope.filtros = {
            nomeCliente: '',
            dataInicio: '',
            dataFim: ''
        };
        $scope.contratacoesFiltradas = [];
        $scope.paginacao = {
            pageNumber: 1,
            pageSize: 20,
            totalCount: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: false
        };
        
        // Inicializar página
        $scope.init = function() {
            $scope.carregarContratacoes();
            $scope.carregarPropostasAprovadas();
        };
        
        // Carregar lista de contratações
        $scope.carregarContratacoes = function(pageNumber) {
            $rootScope.showLoading();
            
            pageNumber = pageNumber || $scope.paginacao.pageNumber;
            
            ApiService.contratacoes.listar(pageNumber, $scope.paginacao.pageSize)
                .then(function(result) {
                    if (result.items) {
                        // Resposta paginada do backend
                        $scope.contratacoes = result.items;
                        $scope.paginacao = {
                            pageNumber: result.pageNumber,
                            pageSize: result.pageSize,
                            totalCount: result.totalCount,
                            totalPages: result.totalPages,
                            hasNextPage: result.hasNextPage,
                            hasPreviousPage: result.hasPreviousPage
                        };
                    } else {
                        // Fallback para resposta não paginada (compatibilidade)
                        $scope.contratacoes = result;
                        $scope.paginacao.totalCount = result.length;
                        $scope.paginacao.totalPages = 1;
                    }
                    $scope.aplicarFiltros();
                })
                .catch(function(error) {
                    $rootScope.showAlert(error, 'danger');
                })
                .finally(function() {
                    $rootScope.hideLoading();
                });
        };
        
        // Carregar propostas aprovadas para contratação
        $scope.carregarPropostasAprovadas = function() {
            ApiService.propostas.listar()
                .then(function(propostas) {
                    $scope.propostas = propostas;
                    $scope.propostasAprovadas = propostas.filter(function(proposta) {
                        return proposta.status === ApiService.StatusProposta.APROVADA;
                    });
                    
                    // Filtrar propostas que já foram contratadas
                    $scope.filtrarPropostasDisponiveis();
                })
                .catch(function(error) {
                    console.error('Erro ao carregar propostas:', error);
                });
        };
        
        // Filtrar propostas que ainda não foram contratadas
        $scope.filtrarPropostasDisponiveis = function() {
            var idsContratados = $scope.contratacoes.map(function(c) { return c.propostaId; });
            
            $scope.propostasAprovadas = $scope.propostasAprovadas.filter(function(proposta) {
                return idsContratados.indexOf(proposta.id) === -1;
            });
        };
        
        // Aplicar filtros na lista
        $scope.aplicarFiltros = function() {
            $scope.contratacoesFiltradas = $scope.contratacoes.filter(function(contratacao) {
                var passaNome = !$scope.filtros.nomeCliente || 
                    contratacao.nomeCliente.toLowerCase().includes($scope.filtros.nomeCliente.toLowerCase());
                
                var passaDataInicio = !$scope.filtros.dataInicio || 
                    new Date(contratacao.dataContratacao) >= new Date($scope.filtros.dataInicio);
                
                var passaDataFim = !$scope.filtros.dataFim || 
                    new Date(contratacao.dataContratacao) <= new Date($scope.filtros.dataFim);
                
                return passaNome && passaDataInicio && passaDataFim;
            });
        };
        
        // Limpar filtros
        $scope.limparFiltros = function() {
            $scope.filtros = {
                nomeCliente: '',
                dataInicio: '',
                dataFim: ''
            };
            $scope.aplicarFiltros();
        };
        
        // Contratar proposta
        $scope.contratarProposta = function(propostaId) {
            if (!propostaId) {
                $rootScope.showAlert('Selecione uma proposta para contratar', 'warning');
                return;
            }
            
            var proposta = $scope.propostas.find(function(p) { return p.id === propostaId; });
            if (!proposta) {
                $rootScope.showAlert('Proposta não encontrada', 'danger');
                return;
            }
            
            if (!confirm('Deseja contratar a proposta de ' + proposta.nomeCliente + '?')) {
                return;
            }
            
            $rootScope.showLoading();
            
            ApiService.contratacoes.contratar(propostaId)
                .then(function(contratacao) {
                    $rootScope.showAlert('Proposta contratada com sucesso!', 'success');
                    $scope.carregarContratacoes();
                    $scope.carregarPropostasAprovadas();
                    
                    // Fechar modal se estiver usando Bootstrap modal
                    var modal = document.getElementById('modalNovaContratacao');
                    if (modal) {
                        var bsModal = bootstrap.Modal.getInstance(modal);
                        if (bsModal) {
                            bsModal.hide();
                        }
                    }
                })
                .catch(function(error) {
                    $rootScope.showAlert(error, 'danger');
                })
                .finally(function() {
                    $rootScope.hideLoading();
                });
        };
        
        // Obter detalhes da proposta original
        $scope.obterDetalhesProposta = function(propostaId) {
            return $scope.propostas.find(function(p) { return p.id === propostaId; });
        };
        
        // Calcular estatísticas
        $scope.calcularEstatisticas = function() {
            var stats = {
                totalContratacoes: $scope.contratacoesFiltradas.length,
                valorTotalCobertura: 0,
                valorTotalPremios: 0,
                contratosMesAtual: 0
            };
            
            var mesAtual = new Date().getMonth();
            var anoAtual = new Date().getFullYear();
            
            $scope.contratacoesFiltradas.forEach(function(contratacao) {
                stats.valorTotalCobertura += contratacao.valorCobertura;
                stats.valorTotalPremios += contratacao.valorPremio;
                
                var dataContratacao = new Date(contratacao.dataContratacao);
                if (dataContratacao.getMonth() === mesAtual && dataContratacao.getFullYear() === anoAtual) {
                    stats.contratosMesAtual++;
                }
            });
            
            return stats;
        };
        
        // Exportar dados (simulação)
        $scope.exportarDados = function() {
            var dados = $scope.contratacoesFiltradas.map(function(contratacao) {
                return {
                    'ID': contratacao.id,
                    'Cliente': contratacao.nomeCliente,
                    'Data Contratação': $scope.formatDate(contratacao.dataContratacao),
                    'Valor Cobertura': contratacao.valorCobertura,
                    'Valor Prêmio': contratacao.valorPremio
                };
            });
            
            console.log('Dados para exportação:', dados);
            $rootScope.showAlert('Funcionalidade de exportação seria implementada aqui', 'info');
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
        
        $scope.formatDateOnly = function(dateString) {
            if (!dateString) return '';
            var date = new Date(dateString);
            return date.toLocaleDateString('pt-BR');
        };
        
        // Métodos de paginação
        $scope.irParaPagina = function(pageNumber) {
            if (pageNumber >= 1 && pageNumber <= $scope.paginacao.totalPages) {
                $scope.paginacao.pageNumber = pageNumber;
                $scope.carregarContratacoes(pageNumber);
            }
        };
        
        $scope.paginaAnterior = function() {
            if ($scope.paginacao.hasPreviousPage) {
                $scope.irParaPagina($scope.paginacao.pageNumber - 1);
            }
        };
        
        $scope.proximaPagina = function() {
            if ($scope.paginacao.hasNextPage) {
                $scope.irParaPagina($scope.paginacao.pageNumber + 1);
            }
        };
        
        $scope.primeiraPagina = function() {
            $scope.irParaPagina(1);
        };
        
        $scope.ultimaPagina = function() {
            $scope.irParaPagina($scope.paginacao.totalPages);
        };
        
        // Inicializar quando o controller for carregado
        $scope.init();
    }]);
