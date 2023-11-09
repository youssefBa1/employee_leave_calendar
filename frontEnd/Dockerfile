FROM node:alpine
WORKDIR /backend
COPY package.json .
RUN npm install
COPY . .
EXPOSE 19001

CMD ["npm","start"]