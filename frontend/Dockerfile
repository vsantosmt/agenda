# -------- Stage 1: Build --------
FROM node:20-alpine AS builder

WORKDIR /app

# Copia package.json
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o restante do projeto
COPY . .

# Build da aplicação Vite
RUN npm run build

# -------- Stage 2: Runtime --------
FROM nginx:alpine

# Remove config padrão do nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia build gerado pelo Vite
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia config custom do nginx com proxy para API
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe porta
EXPOSE 80

# Inicia nginx
CMD ["nginx", "-g", "daemon off;"]