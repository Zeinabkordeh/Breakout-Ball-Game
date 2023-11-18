FROM nginx:1.15.8-alpine

copy ./nginx.conf /etc/nginx/nginx.conf

copy ./*.html /usr/share/nginx/html/
copy ./style /usr/share/nginx/html/style/
copy ./images /usr/share/nginx/html/images/
copy ./script /usr/share/nginx/html/script/
copy ./Audio /usr/share/nginx/html/Audio/
