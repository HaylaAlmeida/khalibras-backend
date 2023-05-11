# khalibras-backend

Essa aplicação foi gerada utilizando [LoopBack 4 CLI](https://loopback.io/doc/en/lb4/Command-line-interface.html) com
[initial project layout](https://loopback.io/doc/en/lb4/Loopback-application-layout.html).

## Para conectar com o MongoDB

- Crie um arquivo .env
- Digite:
```
DATABASE_URL = [link_para_o_database]
```
Exemplo de link:
```
mongodb+srv://hayla:<password>@khalibras.mongodb.net/test
```

## Instalar dependências

Por padrão, dependências são instaladas onde essa aplicação é gerada. Quando as dependências em `package.json` forem alteradas, rode o comando a seguir:

```sh
npm install
```

Para instalar apenas dependências resolvidas em `package-lock.json`:

```sh
npm ci
```

## Rodar a aplicação

```sh
npm start
```

Você também pode rodar `node .` para pular o processo de build.

Abra http://127.0.0.1:3000 no seu navegador.

## "Rebuildar" o projeto

Para incrementalmente "buildar" o projeto:

```sh
npm run build
```

Para forçar um build total limpando os artefatos em cache:

```sh
npm run rebuild
```

## Para consertar o estilo de código e problemas de formatação:

```sh
npm run lint
```

Para corrigir automaticamente esses problemas:

```sh
npm run lint:fix
```

## Outros comandos úteis

- `npm run migrate`: Migrar esquemas de banco de dados para modelos
- `npm run openapi-spec`: Gerar especificação OpenAPI em um arquivo
- `npm run docker:build`: Criar uma imagem do Docker para este aplicativo
- `npm run docker:run`: Executar este aplicativo dentro de um contêiner do Docke

## Testes

```sh
npm test
```

## What's next

Please check out [LoopBack 4 documentation](https://loopback.io/doc/en/lb4/) to
understand how you can continue to add features to this application.

[![LoopBack](https://github.com/loopbackio/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png)](http://loopback.io/)

 
