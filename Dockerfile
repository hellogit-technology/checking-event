FROM node:17
WORKDIR /app
COPY package.json .
RUN npm install --omit=dev
RUN npm install pm2 -g
COPY . .
EXPOSE 8080
CMD ["pm2-runtime", "deploy/server.bundle.js"]