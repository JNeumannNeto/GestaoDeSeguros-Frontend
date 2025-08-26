// Propostas Controller
angular.module('gestaoSegurosApp')
    .controller('PropostasController', ['$scope', '$rootScope', 'ApiService', function($scope, $rootScope, ApiService) {
        
        $scope.propostas = [];
        $scope.novaProposta = {};
        $scope.filtros = {
            status: '',
            tipoCliente: '',
            tipoSeguro: ''
        };
        $scope.propostasFiltradas = [];
        
        // Opções para os selects
        $scope.tiposCliente = [
            { value: 0, label: 'Pessoa Física' },
            { value: 1, label: 'Pessoa Jurídica' }
        ];
        
        $scope.tiposSeguro = [];
        $scope.statusOptions = [
            { value: 0, label: 'Em Análise' },
            { value: 1, label: 'Aprovada' },
            { value: 2, label: 'Rejeitada' }
        ];
        
        // Inicializar página
        $scope.init = function() {
            $scope.carregarPropostas();
            $scope.resetarFormulario();
        };
        
        // Carregar lista de propostas
        $scope.carregarPropostas = function() {
            $rootScope.showLoading();
            
            ApiService.propostas.listar()
                .then(function(propostas) {
                    $scope.propostas = propostas;
                    $scope.aplicarFiltros();
                })
                .catch(function(error) {
                    $rootScope.showAlert(error, 'danger');
                })
                .finally(function() {
                    $rootScope.hideLoading();
                });
        };
        
        // Aplicar filtros na lista
        $scope.aplicarFiltros = function() {
            $scope.propostasFiltradas = $scope.propostas.filter(function(proposta) {
                const passaStatus = !$scope.filtros.status || proposta.status == $scope.filtros.status;
                const passaTipoCliente = !$scope.filtros.tipoCliente || proposta.tipoCliente == $scope.filtros.tipoCliente;
                const passaTipoSeguro = !$scope.filtros.tipoSeguro || proposta.tipoSeguro == $scope.filtros.tipoSeguro;
                
                return passaStatus && passaTipoCliente && passaTipoSeguro;
            });
        };
        
        // Limpar filtros
        $scope.limparFiltros = function() {
            $scope.filtros = {
                status: '',
                tipoCliente: '',
                tipoSeguro: ''
            };
            $scope.aplicarFiltros();
        };
        
        // Resetar formulário de nova proposta
        $scope.resetarFormulario = function() {
            $scope.novaProposta = {
                nomeCliente: '',
                tipoCliente: '',
                tipoSeguro: '',
                valorCobertura: '',
                valorPremio: ''
            };
            $scope.tiposSeguro = [];
        };
        
        // Atualizar tipos de seguro baseado no tipo de cliente
        $scope.onTipoClienteChange = function() {
            $scope.novaProposta.tipoSeguro = '';
            const tipoClienteNumerico = parseInt($scope.novaProposta.tipoCliente);
            $scope.tiposSeguro = ApiService.TipoSeguro.getOptionsForTipoCliente(tipoClienteNumerico);
        };
        
        // Criar nova proposta
        $scope.criarProposta = function() {
            if (!$scope.validarFormulario()) {
                return;
            }
            
            $rootScope.showLoading();
            
            const proposta = {
                nomeCliente: $scope.novaProposta.nomeCliente,
                tipoCliente: parseInt($scope.novaProposta.tipoCliente),
                tipoSeguro: parseInt($scope.novaProposta.tipoSeguro),
                valorCobertura: parseFloat($scope.novaProposta.valorCobertura),
                valorPremio: parseFloat($scope.novaProposta.valorPremio)
            };
            
            ApiService.propostas.criar(proposta)
                .then(function(novaProposta) {
                    $rootScope.showAlert('Proposta criada com sucesso!', 'success');
                    $scope.resetarFormulario();
                    $scope.carregarPropostas();
                    
                    // Fechar modal se estiver usando Bootstrap modal
                    const modal = document.getElementById('modalNovaProposta');
                    if (modal) {
                        const bsModal = bootstrap.Modal.getInstance(modal);
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
        
        // Validar formulário
        $scope.validarFormulario = function() {
            if (!$scope.novaProposta.nomeCliente) {
                $rootScope.showAlert('Nome do cliente é obrigatório', 'danger');
                return false;
            }
            
            if ($scope.novaProposta.tipoCliente === '') {
                $rootScope.showAlert('Tipo de cliente é obrigatório', 'danger');
                return false;
            }
            
            if ($scope.novaProposta.tipoSeguro === '') {
                $rootScope.showAlert('Tipo de seguro é obrigatório', 'danger');
                return false;
            }
            
            if (!$scope.novaProposta.valorCobertura || $scope.novaProposta.valorCobertura <= 0) {
                $rootScope.showAlert('Valor de cobertura deve ser maior que zero', 'danger');
                return false;
            }
            
            if (!$scope.novaProposta.valorPremio || $scope.novaProposta.valorPremio <= 0) {
                $rootScope.showAlert('Valor do prêmio deve ser maior que zero', 'danger');
                return false;
            }
            
            return true;
        };
        
        // Alterar status da proposta
        $scope.alterarStatus = function(proposta, novoStatus) {
            if (proposta.status === novoStatus) {
                return;
            }
            
            const statusLabel = ApiService.StatusProposta.getLabel(novoStatus);
            if (!confirm('Deseja alterar o status desta proposta para "' + statusLabel + '"?')) {
                return;
            }
            
            $rootScope.showLoading();
            
            ApiService.propostas.alterarStatus(proposta.id, novoStatus)
                .then(function(propostaAtualizada) {
                    $rootScope.showAlert('Status alterado com sucesso!', 'success');
                    $scope.carregarPropostas();
                })
                .catch(function(error) {
                    $rootScope.showAlert(error, 'danger');
                })
                .finally(function() {
                    $rootScope.hideLoading();
                });
        };
        
        // Contratar proposta (redireciona para o serviço de contratação)
        $scope.contratarProposta = function(proposta) {
            if (proposta.status !== ApiService.StatusProposta.APROVADA) {
                $rootScope.showAlert('Apenas propostas aprovadas podem ser contratadas', 'warning');
                return;
            }
            
            if (!confirm('Deseja contratar esta proposta?')) {
                return;
            }
            
            $rootScope.showLoading();
            
            ApiService.contratacoes.contratar(proposta.id)
                .then(function(contratacao) {
                    $rootScope.showAlert('Proposta contratada com sucesso!', 'success');
                })
                .catch(function(error) {
                    $rootScope.showAlert(error, 'danger');
                })
                .finally(function() {
                    $rootScope.hideLoading();
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
        
        $scope.podeAprovar = function(proposta) {
            return proposta.status === ApiService.StatusProposta.EM_ANALISE;
        };
        
        $scope.podeRejeitar = function(proposta) {
            return proposta.status === ApiService.StatusProposta.EM_ANALISE;
        };
        
        $scope.podeContratar = function(proposta) {
            return proposta.status === ApiService.StatusProposta.APROVADA;
        };
        
        // Inicializar quando o controller for carregado
        $scope.init();
    }]);
