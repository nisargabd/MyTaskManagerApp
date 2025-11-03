# Step 1: create image
FROM node:18-alpine

# Step 2: create app directory
WORKDIR /app

# step 3 : copy package.json and package-lock.json
COPY package*.json ./

# step 4 : install dependencies
RUN npm install

# step 5 : copy all project files
COPY . .

# step 6 : expose port
EXPOSE 5000

# step 7 : start the app
CMD ["npm", "start"]

