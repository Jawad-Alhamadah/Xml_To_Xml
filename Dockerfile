FROM node:14.15.5

WORKDIR C:\Users\moon2\Documents\Proje

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]
 

 