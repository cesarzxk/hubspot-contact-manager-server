## 🖼️ Screenshot

<p align="center"> 
<img src="https://res.cloudinary.com/da91uwz7j/image/upload/v1652199175/hubspot-contact-create/ezgif.com-gif-maker_2_xucjmh.gif" width="600px">
</p>

## 🖥️ Technologies

Tecnologias usadas na resoluçao desse desafio.

- [NodeJS](https://nodejs.org/en/)
- [TypeScript](https://www.typescriptlang.org/)
- [Hubspot-api-nodejs](https://github.com/HubSpot/hubspot-api-nodejs)
- [ExpressJs](https://expressjs.com/)

## 🚀 Getting started

Para começar, primeiramente com a instação das dependências necessárias para inicialização dos proximos passos.

- [NodeJS](https://nodejs.org/en/)
- [Yarn](https://classic.yarnpkg.com/) or [npm](https://www.npmjs.com/)

Acessando a pasta 'back-end' utilizando os seguintes comando para proceguir a instalação:

```bash
$ yarn
```

Em seguida um comando para iniciar o servidor em modo desenvolvimento:

```bash
$ yarn dev
```

## 🖥️ End-points

O back-end é composto por 3 end points:

```
-----> authorization------>GET retorna token


-----> schemas------------>GET retorna a resposta da criação, erro ou se já existe


-----> contacts-----------> GET obtém todos os contatos e retorna

              |-----------> GET:email retorna um contato através do seu email.

              |-----------> PUT atualiza um contato e retorna uma resposta de criação

              |-----------> POST cria um contato e retorna uma resposta de criação
```
