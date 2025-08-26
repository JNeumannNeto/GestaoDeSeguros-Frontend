// API Service for communication with backend microservices
angular.module('gestaoSegurosApp')
    .service('ApiService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
        
        // Configuração padrão para requisições HTTP
        $http.defaults.headers.common['Content-Type'] = 'application/json';
        
        // Enums para facilitar o uso no frontend
        this.TipoCliente = {
            PESSOA_FISICA: 0,
            PESSOA_JURIDICA: 1,
            getLabel: function(value) {
                switch(value) {
                    case 0: return 'Pessoa Física';
                    case 1: return 'Pessoa Jurídica';
                    default: return 'Desconhecido';
                }
            }
        };
        
        this.TipoSeguro = {
            VIDA: 0,
            SAUDE: 1,
            AUTOMOVEL: 2,
            RESIDENCIAL: 3,
            EMPRESARIAL: 4,
            CARGAS: 5,
            FROTA: 6,
            CONDOMINIO: 7,
            VIDA_EMPRESARIAL: 8,
            getLabel: function(value) {
                switch(value) {
                    case 0: return 'Vida';
                    case 1: return 'Saúde';
                    case 2: return 'Automóvel';
                    case 3: return 'Residencial';
                    case 4: return 'Empresarial';
                    case 5: return 'Cargas';
                    case 6: return 'Frota';
                    case 7: return 'Condomínio';
                    case 8: return 'Vida Empresarial';
                    default: return 'Desconhecido';
                }
            },
            getOptionsForTipoCliente: function(tipoCliente) {
                if (tipoCliente === 0) { // Pessoa Física
                    return [
                        { value: 0, label: 'Vida' },
                        { value: 1, label: 'Saúde' },
                        { value: 2, label: 'Automóvel' },
                        { value: 3, label: 'Residencial' }
                    ];
                } else if (tipoCliente === 1) { // Pessoa Jurídica
                    return [
                        { value: 4, label: 'Empresarial' },
                        { value: 5, label: 'Cargas' },
                        { value: 6, label: 'Frota' },
                        { value: 7, label: 'Condomínio' },
                        { value: 8, label: 'Vida Empresarial' }
                    ];
                }
                return [];
            }
        };
        
        this.StatusProposta = {
            EM_ANALISE: 0,
            APROVADA: 1,
            REJEITADA: 2,
            getLabel: function(value) {
                switch(value) {
                    case 0: return 'Em Análise';
                    case 1: return 'Aprovada';
                    case 2: return 'Rejeitada';
                    default: return 'Desconhecido';
                }
            },
            getBadgeClass: function(value) {
                switch(value) {
                    case 0: return 'bg-warning';
                    case 1: return 'bg-success';
                    case 2: return 'bg-danger';
                    default: return 'bg-secondary';
                }
            }
        };
        
        // Métodos para Propostas
        this.propostas = {
            listar: function() {
                const deferred = $q.defer();
                
                $http.get(API_CONFIG.PROPOSTA_SERVICE + '/propostas')
                    .then(function(response) {
                        console.log('Resposta completa da API:', response);
                        console.log('Status:', response.status);
                        console.log('Data:', response.data);
                        console.log('Headers:', response.headers());
                        
                        deferred.resolve(response.data);
                    })
                    .catch(function(error) {
                        console.error('Erro completo:', error);
                        console.error('Status:', error.status);
                        console.error('Data:', error.data);
                        console.error('XHR Status:', error.xhrStatus);
                        console.error('Config:', error.config);
                        
                        if (error.status === -1 || error.status === 0) {
                            if (error.xhrStatus === 'error') {
                                deferred.reject('Erro de CORS ou conexão. Verifique:\n' +
                                              '1. Se a API está rodando na porta correta\n' +
                                              '2. Se há configuração de CORS no servidor\n' +
                                              '3. Tente acessar diretamente: ' + API_CONFIG.PROPOSTA_SERVICE + '/propostas');
                            } else {
                                deferred.reject('Erro de conexão. Verifique se o serviço está rodando.');
                            }
                        } else if (error.data && Array.isArray(error.data)) {
                            console.log('Dados recebidos no erro (pode ser válido):', error.data);
                            deferred.resolve(error.data);
                        } else if (error.status >= 400 && error.status < 500) {
                            deferred.reject('Erro na requisição: ' + (error.data?.message || error.statusText));
                        } else if (error.status >= 500) {
                            deferred.reject('Erro interno do servidor: ' + (error.data?.message || error.statusText));
                        } else {
                            deferred.reject('Erro ao carregar propostas: ' + (error.statusText || 'Erro desconhecido'));
                        }
                    });
                
                return deferred.promise;
            },
            
            obterPorId: function(id) {
                const deferred = $q.defer();
                
                $http.get(API_CONFIG.PROPOSTA_SERVICE + '/propostas/' + id)
                    .then(function(response) {
                        deferred.resolve(response.data);
                    })
                    .catch(function(error) {
                        console.error('Erro ao obter proposta:', error);
                        deferred.reject('Erro ao carregar proposta.');
                    });
                
                return deferred.promise;
            },
            
            criar: function(proposta) {
                const deferred = $q.defer();
                
                $http.post(API_CONFIG.PROPOSTA_SERVICE + '/propostas', proposta)
                    .then(function(response) {
                        deferred.resolve(response.data);
                    })
                    .catch(function(error) {
                        console.error('Erro ao criar proposta:', error);
                        let message = 'Erro ao criar proposta.';
                        if (error.data?.message) {
                            message = error.data.message;
                        } else if (typeof error.data === 'string') {
                            message = error.data;
                        }
                        deferred.reject(message);
                    });
                
                return deferred.promise;
            },
            
            alterarStatus: function(id, novoStatus) {
                const deferred = $q.defer();
                
                $http.put(API_CONFIG.PROPOSTA_SERVICE + '/propostas/' + id + '/status', {
                    novoStatus: novoStatus
                })
                    .then(function(response) {
                        deferred.resolve(response.data);
                    })
                    .catch(function(error) {
                        console.error('Erro ao alterar status:', error);
                        deferred.reject('Erro ao alterar status da proposta.');
                    });
                
                return deferred.promise;
            }
        };
        
        // Métodos para Contratações
        this.contratacoes = {
            listar: function(pageNumber, pageSize) {
                const deferred = $q.defer();
                
                pageNumber = pageNumber || 1;
                pageSize = pageSize || 50;
                
                const params = {
                    pageNumber: pageNumber,
                    pageSize: pageSize
                };
                
                $http.get(API_CONFIG.CONTRATACAO_SERVICE + '/contratacoes', { params: params })
                    .then(function(response) {
                        // A API retorna um PagedResult com a propriedade Items contendo o array
                        const pagedResult = response.data;
                        if (pagedResult && pagedResult.Items) {
                            deferred.resolve(pagedResult.Items);
                        } else if (pagedResult && pagedResult.items) {
                            deferred.resolve(pagedResult.items);
                        } else {
                            // Fallback para compatibilidade
                            deferred.resolve(pagedResult || []);
                        }
                    })
                    .catch(function(error) {
                        console.error('Erro ao listar contratações:', error);
                        let message = 'Erro ao carregar contratações. Verifique se o serviço está rodando.';
                        if (error.data && error.data.message) {
                            message = error.data.message;
                        }
                        deferred.reject(message);
                    });
                
                return deferred.promise;
            },
            
            obterPorId: function(id) {
                const deferred = $q.defer();
                
                $http.get(API_CONFIG.CONTRATACAO_SERVICE + '/contratacoes/' + id)
                    .then(function(response) {
                        deferred.resolve(response.data);
                    })
                    .catch(function(error) {
                        console.error('Erro ao obter contratação:', error);
                        deferred.reject('Erro ao carregar contratação.');
                    });
                
                return deferred.promise;
            },
            
            contratar: function(propostaId) {
                const deferred = $q.defer();
                
                $http.post(API_CONFIG.CONTRATACAO_SERVICE + '/contratacoes', {
                    propostaId: propostaId
                })
                    .then(function(response) {
                        deferred.resolve(response.data);
                    })
                    .catch(function(error) {
                        console.error('Erro ao contratar proposta:', error);
                        let message = 'Erro ao contratar proposta.';
                        if (error.data && error.data.message) {
                            message = error.data.message;
                        } else if (error.data && error.data.errorCode) {
                            message = `Erro ${error.data.errorCode}: ${error.data.message || 'Erro desconhecido'}`;
                        } else if (typeof error.data === 'string') {
                            message = error.data;
                        }
                        deferred.reject(message);
                    });
                
                return deferred.promise;
            }
        };
        
        // Método utilitário para formatar moeda
        this.formatCurrency = function(value) {
            if (!value) return 'R$ 0,00';
            return 'R$ ' + parseFloat(value).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        };
        
        // Método utilitário para formatar data
        this.formatDate = function(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR');
        };
    }]);
