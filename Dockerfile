# Sử dụng Node.js Alpine làm base image siêu nhẹ
FROM node:20-alpine

# Đặt thư mục làm việc
WORKDIR /app

# Copy package.json và cài đặt dependencies
COPY package*.json ./
RUN npm install

# Sao chép mã nguồn vào container
COPY . .

# Mở cổng 3000
EXPOSE 3000

# Thiết lập biến môi trường
ENV PORT=3000

# Chạy server
CMD ["node", "server.js"]
