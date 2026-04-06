#!/bin/bash
export NVM_DIR="/home/ubuntu/.nvm"
source "$NVM_DIR/nvm.sh"
nvm use 20
cd /var/www/openclaw-marketplace/frontend
exec npm run dev
