# 部署指南 (Deployment Guide) - Ubuntu/CentOS

由于本博客系统使用的是**本地文件存储** (`content/` 和 `data/` 目录) 来保存文章和评论，因此必须部署在拥有持久化文件系统的服务器上（如阿里云 ECS、腾讯云 CVM、AWS EC2 或任何 VPS）。**不能**直接部署在 Vercel、Netlify 等 Serverless 平台上，否则数据会丢失。

## 1. 准备工作

确保你的服务器已经安装了以下软件：
*   **Node.js** (版本 >= 18)
*   **Nginx** (用于反向代理)
*   **PM2** (用于进程管理)
*   **Git** (用于拉取代码)

### 安装 Node.js (以 Ubuntu 为例)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 安装 PM2
```bash
sudo npm install -g pm2
```

## 2. 部署步骤

### 第一步：获取代码并构建

在服务器上找一个目录（例如 `/var/www/my-blog`）：

```bash
# 1. 拉取代码 (或者通过 FTP 上传你的项目文件)
git clone <你的仓库地址> /var/www/my-blog
cd /var/www/my-blog

# 2. 安装依赖
npm install

# 3. 创建环境变量文件
cp .env.local.example .env.local
# 编辑 .env.local，填入你的管理员密码
nano .env.local
# 内容示例：ADMIN_PASSWORD=your_secure_password_here

# 4. 构建项目
npm run build
```

### 第二步：准备运行环境

由于使用了 `output: 'standalone'` 模式，Next.js 会生成一个独立的运行文件夹。我们需要做一些特殊处理来确保图片和静态文件能正常访问。

```bash
# 复制静态资源到 standalone 目录
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static

# 确保数据目录存在
mkdir -p .next/standalone/content/posts
mkdir -p .next/standalone/data/comments

# *重要*: 如果你已有文章数据，记得把 content/posts 下的文件复制进去
# cp -r content/posts/* .next/standalone/content/posts/
```

### 第三步：启动服务

使用 PM2 启动服务，确保它在后台运行并在崩溃后自动重启。

```bash
# 启动
pm2 start ecosystem.config.js

# 保存当前进程列表，以便开机自启
pm2 save
pm2 startup
```

现在，你的博客应该运行在 `http://localhost:3000` 了。

## 3. 配置 Nginx 反向代理

为了让外网通过域名访问（并配置 HTTPS），你需要设置 Nginx。

编辑 Nginx 配置：
```bash
sudo nano /etc/nginx/sites-available/my-blog
```

填入以下内容（替换 `your_domain.com` 为你的域名）：

```nginx
server {
    listen 80;
    server_name your_domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

启用配置并重启 Nginx：
```bash
sudo ln -s /etc/nginx/sites-available/my-blog /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 4. 后续维护

### 更新代码
每次更新代码后，需要重新构建并重启：

```bash
git pull
npm install
npm run build

# 重新复制静态资源
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static

# 重启服务
pm2 restart my-blog
```

### 数据备份
**非常重要**：你的文章和评论都在服务器的本地文件中。请定期备份以下两个目录：
1.  `.next/standalone/content/posts` (文章)
2.  `.next/standalone/data/comments` (评论)

建议编写一个简单的脚本定期将其备份到 S3 或 Git 私有仓库。
