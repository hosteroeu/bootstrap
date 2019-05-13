FROM ubuntu:16.04

RUN apt-get update && apt-get install -y linuxbrew-wrapper clang wget software-properties-common ruby-dev make gcc libc-dev
RUN curl -sL https://deb.nodesource.com/setup_8.x -o nodesource_setup.sh
RUN bash nodesource_setup.sh
RUN apt-get install -y nodejs

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ADD . /usr/src/app

RUN gem update --system --no-document && gem install compass --no-document
RUN npm install
RUN npm install -g bower
RUN npm install -g grunt-cli
RUN bower install --allow-root
RUN grunt build

CMD [ "node", "server" ]
