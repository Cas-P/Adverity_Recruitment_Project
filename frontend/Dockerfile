FROM node:16-alpine

WORKDIR /home/user/frontend/

COPY package*.json /home/user/frontend/
RUN npm install

COPY . /home/user/frontend/

CMD npm start