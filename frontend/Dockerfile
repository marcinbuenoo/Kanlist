# Etapa única para desenvolvimento
FROM node:22-alpine

# Diretório de trabalho
WORKDIR /usr/src/app

# Copia o package.json
COPY package*.json ./

# Instala as dependências
RUN npm install 

# Expõe a porta 5137
EXPOSE 5137

# Comando final é definido no docker-compose (npm run dev -- --host)