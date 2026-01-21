# Docker 部署指南 (Ubuntu 22.04 LTS)

本指南将帮助你在 Ubuntu 22.04 LTS 服务器上使用 Docker 和 Docker Compose 部署博客。

## 1. 安装 Docker 和 Docker Compose

如果你还没有安装 Docker，请运行以下命令：

```bash
# 更新 apt 包索引
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg

# 添加 Docker 官方 GPG key
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# 设置仓库
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 安装 Docker Engine
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 验证安装
sudo docker run hello-world
```

## 2. 部署步骤

### 第一步：获取代码

在服务器上找一个目录（例如 `/opt/my-blog`）：

```bash
# 克隆代码
git clone <你的仓库地址> /opt/my-blog
cd /opt/my-blog
```

### 第二步：配置环境变量

复制示例环境文件并设置密码：

```bash
cp .env.local.example .env.local
nano .env.local
# 确保里面有: ADMIN_PASSWORD=your_secure_password
```

### 第三步：设置权限 (非常重要!)

由于容器内使用非 root 用户 (UID 1001) 运行，我们需要确保宿主机上的数据目录对该用户可写，否则你将无法创建文章或评论。

```bash
# 创建数据目录
mkdir -p content/posts
mkdir -p data/comments

# 修改所有者为 1001 (容器内的 nextjs 用户)
# 如果不想用 chown，也可以 chmod 777 (不推荐用于生产环境，但简单有效)
sudo chown -R 1001:1001 content
sudo chown -R 1001:1001 data
```

### 第四步：启动服务

使用 Docker Compose 构建并启动：

```bash
# 构建并后台运行
sudo docker compose up -d --build
```

查看日志确保一切正常：
```bash
sudo docker compose logs -f
```

现在博客应该运行在 `http://localhost:3000` (或服务器 IP:3000)。

## 3. 配置 Nginx (HTTPS)

虽然 Docker 暴露了 3000 端口，但建议使用 Nginx 作为反向代理来处理 HTTPS。

### 安装 Nginx
```bash
sudo apt install nginx
```

### 配置站点
```bash
sudo nano /etc/nginx/sites-available/my-blog
```

填入以下内容：

```nginx
server {
    listen 80;
    server_name your_domain.com; # 替换为你的域名

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

### 启用并重启
```bash
sudo ln -s /etc/nginx/sites-available/my-blog /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 获取 SSL 证书 (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your_domain.com
```

## 4. 更新与维护

### 更新代码
```bash
git pull
sudo docker compose up -d --build
```

### 备份数据
你的数据都在宿主机的以下目录，直接备份这些文件夹即可：
*   `/opt/my-blog/content/posts`
*   `/opt/my-blog/data/comments`
