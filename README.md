# Tech-Challenge - Delivery System

## Sobre o Projeto

Sistema de autoatendimento de fast food que permite ao cliente selecionar e fazer seus pedidos sem precisar interagir com um atendente, com seguintes funcionalidades:

### Gerenciar Clientes

Cliente ao iniciar um pedido pode se cadastrar com nome, e-mail e cpf ou não se identificar

### Gerenciar Produtos

Os produtos podem ser cadastrados com nome, categoria, preço, descrição e imagens

As categorias dos pedidos são:

- Lanche
- Acompanhamento
- Bebida
- Sobremessa 

### Pagamento

Integração com gateway de pagamento

#### Acompanhar Pedido

Ao confirmar pagamento, o pedido é enviado para preparo. O cliente pode acompanhar o progresso do seu pedido com as seguintes etapas:

- Recebido
- Em preparação
- Pronto
- Finalizado 

## Tecnologias

- Node
- TypeScript
- Express
- MySQL
- Docker

## Domain Driven Design

https://miro.com/app/board/uXjVMKvnUGA=/?share_link_id=537199265716
![Tech Challenge FASE 01](https://p.ipic.vip/30tsa0.jpg)
![Tech Challenge FASE 01 (1)](https://github.com/fellipySaldanha/tech-challenge/assets/43252661/7e67ffe0-559b-4df0-9a19-fd97cfd867e7)

## Modelagem de Dados
![Diagrama de Entidades e Relacionamentos - Delivery System (1)](https://github.com/fellipySaldanha/tech-challenge/assets/43252661/7118b3eb-50cf-4b62-b6a3-8fdb9c5d862d)

## Iniciar Aplicação

Executar o comando: `docker compose up --build`

## Documentação de APIs

Após iniciar a aplicação, o swagger com as APIs estará disponivel em: http://localhost:3000/api-docs
![image](https://github.com/fellipySaldanha/tech-challenge/assets/43252661/ad170fee-5206-4913-950c-bfcd10fc80c9)
