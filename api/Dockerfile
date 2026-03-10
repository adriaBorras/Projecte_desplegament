FROM node:18.16-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package.json yarn.lock ./

# Install dependencies
#RUN npm install

#RUN yarn install --frozen-lockfile
RUN yarn install

# Copy all backend files
COPY . .

# Expose port
EXPOSE 8800

# Start server
CMD ["node", "index.js"]