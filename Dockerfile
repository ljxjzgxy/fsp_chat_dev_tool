FROM node:18.13.0-slim AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm i

COPY . .
RUN npm run build

FROM nginx:1.23.2
WORKDIR /app
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder ./app/build ./

# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]