# Frontend - Sistema de Gestão de Seguros

Interface web desenvolvida em AngularJS para o Sistema de Gestão de Seguros, permitindo que usuários gerenciem propostas de seguro e contratações de forma intuitiva.

## Tecnologias Utilizadas

- **AngularJS 1.8.2** - Framework JavaScript
- **Bootstrap 5.1.3** - Framework CSS para interface responsiva
- **Font Awesome** - Ícones
- **HTML5/CSS3** - Estrutura e estilização

## Funcionalidades

### 🏠 Dashboard (Home)
- Visão geral com estatísticas do sistema
- Cards com totais de propostas, aprovações e contratações
- Lista das propostas e contratações mais recentes
- Ações rápidas para navegação

### 📋 Gestão de Propostas
- **Listar propostas** com filtros por status, tipo de cliente e tipo de seguro
- **Criar nova proposta** com validações de negócio
- **Alterar status** (Aprovar/Rejeitar propostas em análise)
- **Contratar proposta** (apenas propostas aprovadas)
- Interface responsiva com tabelas e modais

### 🤝 Gestão de Contratações
- **Listar contratações** com filtros por cliente e período
- **Nova contratação** a partir de propostas aprovadas
- **Estatísticas** de valores e quantidades
- **Exportação de dados** (simulada)
- Visualização detalhada das informações

## Estrutura do Projeto

```
GestaoDeSeguros-Frontend/
│
├── index.html                 # Página principal
├── css/
│   └── styles.css            # Estilos customizados
├── js/
│   ├── app.js               # Configuração principal do AngularJS
│   ├── services/
│   │   └── apiService.js    # Serviço para comunicação com APIs
│   └── controllers/
│       ├── homeController.js        # Controller da página inicial
│       ├── propostasController.js   # Controller de propostas
│       └── contratacoesController.js # Controller de contratações
├── views/
│   ├── home.html            # Template da página inicial
│   ├── propostas.html       # Template de gestão de propostas
│   └── contratacoes.html    # Template de gestão de contratações
└── README.md
```

## Como Executar

### Pré-requisitos
- Servidor web (pode ser um servidor local simples)
- Os microserviços backend rodando:
  - PropostaService na porta 5001 (HTTP) ou 7001 (HTTPS)
  - ContratacaoService na porta 5002 (HTTP) ou 7002 (HTTPS)

## Configuração das APIs

As URLs das APIs estão configuradas no arquivo `js/app.js`:

```javascript
.constant('API_CONFIG', {
    PROPOSTA_SERVICE: 'http://localhost:5001/api',
    CONTRATACAO_SERVICE: 'http://localhost:5002/api'
});
```

**Nota:** O frontend está configurado para usar HTTP nas portas 5001 e 5002. Se você quiser usar HTTPS, altere as URLs no arquivo `js/app.js` para:
- `https://localhost:7001/api` (PropostaService)
- `https://localhost:7002/api` (ContratacaoService)

Certifique-se de que os microserviços backend estejam rodando nas portas corretas.

## Funcionalidades Detalhadas

### Dashboard
- **Estatísticas em tempo real**: Total de propostas, aprovadas, em análise e contratações
- **Dados recentes**: Últimas 5 propostas e contratações
- **Ações rápidas**: Links diretos para criar propostas e gerenciar dados

### Propostas
- **Filtros avançados**: Por status, tipo de cliente e tipo de seguro
- **Validações**: Tipos de seguro compatíveis com tipo de cliente
- **Ações contextuais**: Aprovar, rejeitar e contratar baseado no status
- **Interface responsiva**: Adaptável a diferentes tamanhos de tela

### Contratações
- **Estatísticas financeiras**: Valores totais de cobertura e prêmios
- **Filtros por período**: Data de início e fim
- **Busca por cliente**: Filtro por nome
- **Propostas disponíveis**: Lista apenas propostas aprovadas não contratadas

## Validações e Regras de Negócio

### Propostas
- Nome do cliente obrigatório
- Valores de cobertura e prêmio devem ser maiores que zero
- Tipos de seguro filtrados por tipo de cliente:
  - **Pessoa Física**: Vida, Saúde, Automóvel, Residencial
  - **Pessoa Jurídica**: Empresarial, Cargas, Frota, Condomínio, Vida Empresarial

### Contratações
- Apenas propostas com status "Aprovada" podem ser contratadas
- Uma proposta não pode ser contratada mais de uma vez
- Validação de comunicação com o backend

## Interface e UX

### Design
- **Tema moderno** com gradientes e sombras
- **Cores consistentes** seguindo paleta azul/verde
- **Ícones intuitivos** do Font Awesome
- **Animações suaves** com CSS transitions

### Responsividade
- **Mobile-first** design
- **Breakpoints** para tablet e desktop
- **Tabelas responsivas** com scroll horizontal
- **Cards adaptáveis** em diferentes resoluções

### Feedback ao Usuário
- **Alertas contextuais** para sucesso, erro e informação
- **Loading spinner** durante requisições
- **Confirmações** para ações críticas
- **Estados vazios** com orientações

## Tratamento de Erros

- **Conexão com API**: Mensagens claras quando serviços estão indisponíveis
- **Validação de formulários**: Feedback imediato para campos inválidos
- **Timeouts**: Tratamento de requisições que demoram muito
- **Estados de erro**: Interfaces específicas para diferentes tipos de erro
