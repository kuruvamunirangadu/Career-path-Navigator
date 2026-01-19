#!/bin/bash
# Railway Deployment Script
# Deploys Career Path Navigator to Railway.app

set -e

echo "🚂 Career Path Navigator - Railway Deployment"
echo "=============================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Railway CLI...${NC}"
    npm install -g @railway/cli
fi

echo -e "${BLUE}1️⃣  Logging in to Railway...${NC}"
railway login

echo -e "${BLUE}2️⃣  Linking project...${NC}"
railway link --project Career-path-Navigator

echo -e "${BLUE}3️⃣  Setting environment variables...${NC}"
railway variables set PYTHONUNBUFFERED=1
railway variables set PORT=8000

echo -e "${BLUE}4️⃣  Building and deploying...${NC}"
railway up --detach

echo ""
echo -e "${GREEN}✅ Deployment started!${NC}"
echo ""
echo -e "${BLUE}Getting live URL...${NC}"
railway domain

echo ""
echo -e "${GREEN}🎉 Career Path Navigator is now live on Railway!${NC}"
echo ""
echo "📊 Dashboard: https://railway.app/dashboard"
echo "📖 Docs: https://docs.railway.app"
echo ""
echo -e "${YELLOW}Test your deployment:${NC}"
echo "Backend: https://<your-domain>/streams?class=10"
echo "Frontend: https://<your-domain>/"
