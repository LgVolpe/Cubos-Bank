# Cubos Bank

# API de Sistema Bancário

Este projeto consiste em uma API para um sistema bancário que permite criar contas, consultar saldos, realizar transferências e gerenciar extratos.

## Tecnologias Utilizadas

- Node.js
- Express.js
- JavaScript

## Pré-requisitos

- Node.js instalado 
- Express.js instalado
- Git (opcional)

## Instale as dependências:

- npm install
- npm install express

## Inicie o servidor:

- npm run dev

## Acesse a API:

A API estará disponível em http://localhost:3000 por padrão. Você pode usar ferramentas como o Postman ou Imnsomina para testar as rotas da API.

Rotas da API:

- router.get '/contas'
- router.post '/contas'
- router.put '/contas/:numeroConta/usuario'
- router.delete '/contas/:numeroConta'
- router.post '/transacoes/depositar'
- router.post '/transacoes/sacar'
- router.post '/transacoes/transferir/'
- router.get '/contas/saldo'
- router.get '/contas/extrato'

Contribuição:
Sinta-se à vontade para contribuir com melhorias neste projeto. Abra um problema ou envie uma solicitação de recebimento.
