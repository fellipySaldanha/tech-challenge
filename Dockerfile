FROM node:18.16.0

# Download do script "wait-for-it.sh" - Usado para a api aguardar a subida do banco de dados
RUN wget -O /usr/local/bin/wait-for-it.sh \
    https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh && \
    chmod +x /usr/local/bin/wait-for-it.sh

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia o arquivo package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos do projeto
COPY . .

# Compila o código TypeScript
RUN npm run build

# Expõe a porta em que a aplicação está ouvindo
EXPOSE 3000

# Define o comando para iniciar a aplicação quando o contêiner for executado
CMD /usr/local/bin/wait-for-it.sh db:3306 -t 60 -- npm start
