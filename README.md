# Projeto de uma api para armazenamento de anotações

Api de Notas

![technology Node](https://img.shields.io/badge/techonolgy-Node-green)
![techonolgy Nest](https://img.shields.io/badge/techonolgy-Nest-red)
![techonolgy MongoDB](https://img.shields.io/badge/techonolgy-MongoDB-darkgreen)
![technology Docker](https://img.shields.io/badge/techonolgy-Docker-blue)

## Getting Started

## Pré-requisitos

- Docker
- Node

## Executando a aplicação

crie a network do container usando o seguinte comando:

```
    docker network create nest-note-api-net
```


inicie a aplicação

```
    docker-compose up --build
```

## Debug via Docker

1. usar o comando `yarn run start:debug:container` no arquivo `star.sh`

2. no VSCode usar a seguinte configuração de running:

```
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Attach to NestJS Docker",
            "type": "node",
            "request": "attach",
            "address": "localhost",
            "port": 9229,
            "restart": true,
            "timeout": 10000,
            "localRoot": "${workspaceFolder}",
            "remoteRoot": "/nest-note-api",
            "sourceMaps": true,
        }
    ]
}
```

3. executar a aplicação via docker como explicado anteriormente

4. executar o running configurado no VSCode, a partir desse ponto já é possível colocar os breakpoints e começar o debug.