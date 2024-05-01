# 使用官方 Node.js 基础镜像
FROM node:16

# 创建并设置工作目录
WORKDIR /usr/src/app

# 复制 package.json 和 package-lock.json (如果有)
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 复制项目的其他文件到工作目录
COPY . .

# 开放容器内的端口号
EXPOSE 8080

# 定义容器启动时执行的命令
CMD ["node", "main.js"]
