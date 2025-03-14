FROM httpd:latest

# Copiar archivos de configuración personalizados
COPY httpd.conf /usr/local/apache2/conf/httpd.conf
COPY httpd-ssl.conf /usr/local/apache2/conf/extra/httpd-ssl.conf

# Copiar certificados SSL
COPY ssl/fullchain.pem /usr/local/apache2/conf/server.crt
COPY ssl/privkey.pem /usr/local/apache2/conf/server.key

# Copiar archivos del frontend
COPY html /usr/local/apache2/htdocs/
COPY css /usr/local/apache2/htdocs/css/
COPY js /usr/local/apache2/htdocs/js/

# Exponer puertos HTTP y HTTPS
EXPOSE 80 443

CMD ["httpd", "-D", "FOREGROUND"]

