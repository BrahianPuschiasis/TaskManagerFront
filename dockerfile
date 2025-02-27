# Usa una imagen oficial de Node.js como base
FROM node:22 AS build

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el package.json y package-lock.json (o yarn.lock) al contenedor
COPY package*.json ./

# Instala las dependencias de la aplicación
RUN npm install

# Copia todo el código fuente de tu proyecto al contenedor
COPY . .

# Construye el proyecto (esto asume que usas Vite)
RUN npm run build

# Usa una imagen ligera para servir la aplicación construida
FROM nginx:alpine

# Copia los archivos generados por Vite al contenedor de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expone el puerto 80 para servir la aplicación
EXPOSE 80

# Comando para ejecutar Nginx
CMD ["nginx", "-g", "daemon off;"]
