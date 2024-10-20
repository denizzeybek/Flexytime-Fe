# Base image
FROM node:18

# Bundle app source
COPY . /usr/src/app

# Create app directory
WORKDIR /usr/src/app

# Package 
RUN yarn && yarn build 

RUN yarn global add http-server

# Expose port
EXPOSE 8080

# Start the server using the production build
CMD ["yarn", "preview","--host","0.0.0.0","--port","8080"]