# FROM nginx:1.13

# # COPY nginx.conf /etc/nginx/conf.d/default.conf

# COPY nginx_proxy_params.conf /etc/nginx/proxy_params
# 
# COPY ./build /usr/share/nginx/html/

FROM node:20 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run deploy


FROM nginx:1.13

COPY --from=builder /app/build /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx_proxy_params.conf /etc/nginx/proxy_params