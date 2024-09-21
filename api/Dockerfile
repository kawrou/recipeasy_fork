FROM node:18-alpine3.20

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production
# RUN npm install && npm prune --production && npm cache clean --force

# Rebuild native modules
# RUN npm rebuild bcrypt --build-from-source

COPY . .

EXPOSE 3000

CMD ["sh", "-c", "env && npm start" ]


