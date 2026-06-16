# Imagem única rodando em TS nativamente via ts-node
FROM node:25-alpine

WORKDIR /usr/src/app

# Copia o package.json e instala as dependências
COPY package*.json ./
RUN npm install

# Copia o restante dos arquivos
COPY . .

# Expõe a porta 3000
EXPOSE 3000

# Comando para incialização
CMD ["npm", "start"]