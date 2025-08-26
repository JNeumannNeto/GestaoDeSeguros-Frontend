# Docker Setup - Gestão de Seguros Frontend

Este documento explica como executar a aplicação frontend de Gestão de Seguros usando Docker.

## Pré-requisitos

- Docker instalado
- Docker Compose instalado (opcional, mas recomendado)

## Opção 1: Usando Docker Compose (Recomendado)

### Construir e executar a aplicação

```bash
docker-compose up --build
```

### Executar em background

```bash
docker-compose up -d --build
```

### Parar a aplicação

```bash
docker-compose down
```

### Ver logs

```bash
docker-compose logs -f
```

## Opção 2: Usando Docker diretamente

### Construir a imagem

```bash
docker build -t gestao-seguros-frontend .
```

### Executar o container

```bash
docker run -d -p 8080:80 --name gestao-seguros-frontend gestao-seguros-frontend
```

### Parar o container

```bash
docker stop gestao-seguros-frontend
```

### Remover o container

```bash
docker rm gestao-seguros-frontend
```

## Acessar a aplicação

Após executar qualquer uma das opções acima, a aplicação estará disponível em:

```
http://localhost:8080
```

## Integração com Backend Services

Este frontend está configurado para se comunicar com os seguintes serviços backend:

- **PropostaService**: `http://localhost:5001/api`
- **ContratacaoService**: `http://localhost:5002/api`

**Importante**: Certifique-se de que os serviços backend estejam rodando nas portas corretas antes de usar o frontend. Os serviços backend devem ter CORS configurado para aceitar requisições de `http://localhost:8080`.

## Estrutura dos arquivos Docker

- **Dockerfile**: Define como construir a imagem Docker
- **nginx.conf**: Configuração do servidor nginx para servir a aplicação AngularJS
- **docker-compose.yml**: Orquestra os serviços Docker
- **.dockerignore**: Define quais arquivos devem ser ignorados durante o build

## Características da configuração

- **Base**: nginx:alpine (imagem leve)
- **Porta**: 8080 (host) → 80 (container)
- **Roteamento**: Configurado para suportar AngularJS routing
- **Compressão**: Gzip habilitado para melhor performance
- **Cache**: Headers de cache configurados para assets estáticos
- **Segurança**: Headers de segurança básicos configurados

## Troubleshooting

### Porta já em uso
Se a porta 8080 já estiver em uso, altere no docker-compose.yml:
```yaml
ports:
  - "3000:80"  # Usar porta 3000 ao invés de 8080
```

### Problemas de permissão
No Linux/Mac, pode ser necessário usar `sudo` antes dos comandos Docker.

### Logs de erro
Para ver logs detalhados:
```bash
docker-compose logs gestao-seguros-frontend
