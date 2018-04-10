FROM node:latest

RUN mkdir -p /opt/city-game/css \
             /opt/city-game/img \
             /opt/city-game/res \
             /opt/city-game/src

COPY css/* /opt/city-game/css
COPY img/* /opt/city-game/img
COPY res/* /opt/city-game/res
COPY src/* /opt/city-game/src

COPY app.js /opt/city-game
COPY index.html /opt/city-game
COPY package.json /opt/city-game

WORKDIR /opt/city-game

RUN npm install

CMD node app.js