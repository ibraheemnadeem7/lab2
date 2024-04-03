# Makefile for web deployment
# Must first:
# mkdir /var/www/html/lab2
# sudo chown ubuntu /var/www/html/lab2

all: PutHTML

PutHTML:
	cp main.html /var/www/html/lab2/
	cp styles.css /var/www/html/lab2/
	cp script.js /var/www/html/lab2/

	echo "Current contents of your HTML directory: "
	ls -l /var/www/html/lab2/
