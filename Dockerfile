FROM nginx:1.13

# COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx_proxy_params.conf /etc/nginx/proxy_params
COPY ./build/ /usr/share/nginx/html/
