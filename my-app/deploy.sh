#!/bin/bash

set -e

if [ ! -f "package.json" ]; then
    echo "Error: Please run this script in the my-app directory"
    exit 1
fi

echo "Vercel Deployment Script"
echo "========================"
echo ""

if ! vercel whoami &> /dev/null; then
    echo "Step 1: Login to Vercel"
    echo "------------------------"
    vercel login
fi

echo ""
echo "Step 2: Deploy to Production"
echo "-----------------------------"
vercel --prod

echo ""
echo "Deployment Complete!"
echo ""
echo "Next Steps:"
echo "1. Visit Vercel Dashboard to configure environment variables"
echo "2. Set up PostgreSQL database"
echo "3. Run database migrations"
