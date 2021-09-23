FROM ubuntu:18.04

WORKDIR /app

RUN 	apt update &&\
		apt install -y curl &&\
		curl -sL https://deb.nodesource.com/setup_12.x -o nodesource_setup.sh &&\
		bash nodesource_setup.sh &&\
		apt install -y nodejs &&\
		npm install npx

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install -g nodemon --silent
RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent

# add app
COPY . ./

# start app
CMD ["npm", "start"]
