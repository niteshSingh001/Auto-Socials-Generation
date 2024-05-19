FROM ghcr.io/puppeteer/puppeteer:21.7.0

ENV PUPPETEER_SKIP_DOWNLOAD =true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable \
    MONGO_URI=mongodb+srv://nstesting:nstesting@cluster0.hsxjuzl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci
COPY . .
CMD [ "node", "index.js" ]















