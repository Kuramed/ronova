FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
# O --host é essencial para acessar o React de fora do contêiner
CMD ["npm", "run", "dev", "--", "--host"]