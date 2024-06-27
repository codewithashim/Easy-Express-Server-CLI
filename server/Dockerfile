# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install app dependencies
RUN yarn install

# Bundle app source
COPY ./ .

# Expose the port on which your app runs
EXPOSE 8000

# Define the command to run your app
CMD ["yarn", "start"]
