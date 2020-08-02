# API Users
### Api de usuários utilizando HapiJS

#### Objetivos
* Contruir uma api restful com HapiJS
* Cadastrar usuários na base de dados com Mongo
* Encriptar senhas dos usuários
* Logar usuários para recuperar dados e o token de acesso
* Utilizar JWT para autorização
* Retornar as credenciais com base no token e id do usuário
* Estipular intervalo entre requisições ao retorna credenciais

Acesse o projeto em: https://api-users-30.herokuapp.com/documentation

#### Como executar o projeto

* Instale o docker de acordo com a sua plataforma 

Acesse: https://docs.docker.com/engine/install/

* Confirme se o docker está instalado executando: 

```
docker --version
```
Obs: No linux requer o acesso como administrador então utilize `sudo docker --version`, e o mesmo vale para outros comandos no terminal.

* Execute os seguintes comandos no seu terminal, e utilize `sudo` se estiver no Linux:
O container com MongoDB será criado a partir deste comando:
```
docker run \
--name mongodb \
-p 27017:27017 \
-e MONGO_INITDB_ROOT_USERNAME=admin \
-e MONGO_INITDB_ROOT_PASSWORD=senhaadmin \
-d \
mongo:4 \
```
código irá criar um contâiner com MongoClient, para consultarmos rapidamente a base de dados:
```
docker run \
--name mongoclient \
-p 3000:3000 \
--link mongodb:mongodb \
-d \
mongoclient/mongoclient \
```
Esse criará um novo usuário para manipular a base de dados Users
```
docker exec -it mongodb \
mongo --host localhost \
-u admin -p senhaadmin \
--authenticationDatabase admin \
--eval "db.getSiblingDB('users').createUser({user:'edsonbruno',pwd:'api3007',roles:[{role: 'readWrite', db: 'users'}]})" \
```
Agora que o banco de dados está pronto, vamos clonar a aplicação com o seguinte código no terminal:
```
git clone https://github.com/edsonbruno415/users-api-restful.git
```
Entre na pasta do projeto:
```
cd users-api-restful/
```
Agora instale as dependências e execute o projeto em modo de desenvolvimento:
```
npm i && npm run dev
```
Pronto! Agora o projeto está executando localmente. :blush:
