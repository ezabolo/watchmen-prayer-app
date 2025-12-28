#!/bin/bash

# AWS Lightsail Deployment Script for Prayer Watchman
# Run this script on your Lightsail instance after uploading files

set -e

echo "🚀 Starting Prayer Watchman deployment on AWS Lightsail..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
echo "📦 Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
echo "📦 Installing PM2 process manager..."
sudo npm install -g pm2

# Install Nginx
echo "📦 Installing Nginx..."
sudo apt install nginx -y

# Create application directory
echo "📁 Setting up application directory..."
APP_DIR="/home/ubuntu/prayer-watchman"
mkdir -p $APP_DIR
cd $APP_DIR

# Install dependencies
echo "📦 Installing Node.js dependencies..."
npm install --production

# Create PM2 ecosystem file
echo "⚙️  Creating PM2 configuration..."
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'prayer-watchman',
    script: 'dist/index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    }
  }]
}
EOF

# Create Nginx configuration
echo "⚙️  Configuring Nginx..."
sudo tee /etc/nginx/sites-available/prayer-watchman > /dev/null << EOF
server {
    listen 80;
    server_name _;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Serve static files
    location /assets/ {
        alias $APP_DIR/dist/public/assets/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Proxy API and app requests to Node.js
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Security: deny access to sensitive files
    location ~ /\\.(?!well-known).* {
        deny all;
    }
}
EOF

# Enable Nginx site
echo "⚙️  Enabling Nginx site..."
sudo ln -sf /etc/nginx/sites-available/prayer-watchman /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx

# Configure firewall
echo "🔒 Configuring firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# Start application with PM2
echo "🚀 Starting Prayer Watchman application..."
pm2 start ecosystem.config.js
pm2 startup
pm2 save

# Create backup script
echo "💾 Creating backup script..."
sudo tee /usr/local/bin/backup-prayer-watchman.sh > /dev/null << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/ubuntu/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup application files
tar -czf $BACKUP_DIR/app-$DATE.tar.gz /home/ubuntu/prayer-watchman

# Keep only last 7 backups
find $BACKUP_DIR -name "app-*.tar.gz" -type f -mtime +7 -delete

echo "Backup completed: $BACKUP_DIR/app-$DATE.tar.gz"
EOF

sudo chmod +x /usr/local/bin/backup-prayer-watchman.sh

# Setup daily backup cron job
echo "⏰ Setting up daily backups..."
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/backup-prayer-watchman.sh") | crontab -

echo "✅ Deployment completed successfully!"
echo ""
echo "🌐 Your Prayer Watchman app should now be running at:"
echo "   http://$(curl -s ifconfig.me)"
echo ""
echo "📊 Monitor your application:"
echo "   pm2 status"
echo "   pm2 logs prayer-watchman"
echo "   sudo systemctl status nginx"
echo ""
echo "🔒 Next steps:"
echo "   1. Configure your domain DNS to point to this server"
echo "   2. Set up SSL certificate with: sudo certbot --nginx"
echo "   3. Update environment variables in .env file"
echo "   4. Test all functionality including payments"
echo ""
echo "🛡️  For OWASP testing, use the public IP or domain name"
EOF