#!/bin/bash

# Deployment Script for Manasa Portfolio
# This script helps deploy the application to various hosting services

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Main menu
show_menu() {
    print_header "Manasa Portfolio Deployment Script"
    echo "Select deployment option:"
    echo ""
    echo "Backend Deployment:"
    echo "  1) Deploy to Railway"
    echo "  2) Deploy to Render"
    echo "  3) Deploy to Heroku"
    echo ""
    echo "Frontend Deployment:"
    echo "  4) Deploy to Vercel"
    echo "  5) Deploy to Netlify"
    echo ""
    echo "Other Options:"
    echo "  6) Build locally"
    echo "  7) Verify deployment"
    echo "  8) Generate secrets"
    echo "  9) Exit"
    echo ""
    read -p "Enter your choice [1-9]: " choice
}

# Deploy to Railway
deploy_railway() {
    print_header "Deploying Backend to Railway"
    
    if ! command_exists railway; then
        print_error "Railway CLI not found. Installing..."
        npm install -g @railway/cli
    fi
    
    print_info "Logging in to Railway..."
    railway login
    
    print_info "Deploying to Railway..."
    cd server
    railway up
    
    print_success "Backend deployed to Railway!"
    print_info "Get your deployment URL with: railway domain"
}

# Deploy to Render
deploy_render() {
    print_header "Deploying Backend to Render"
    
    print_info "Render deployment is done through the dashboard."
    print_info "Please follow these steps:"
    echo ""
    echo "1. Go to https://dashboard.render.com/"
    echo "2. Click 'New +' > 'Web Service'"
    echo "3. Connect your repository"
    echo "4. Select 'server' directory as root"
    echo "5. Configure:"
    echo "   - Build Command: npm install"
    echo "   - Start Command: npm start"
    echo "6. Add environment variables from server/.env.production.example"
    echo "7. Click 'Create Web Service'"
    echo ""
    print_warning "Press Enter when done..."
    read
}

# Deploy to Heroku
deploy_heroku() {
    print_header "Deploying Backend to Heroku"
    
    if ! command_exists heroku; then
        print_error "Heroku CLI not found. Please install from https://devcenter.heroku.com/articles/heroku-cli"
        return 1
    fi
    
    print_info "Logging in to Heroku..."
    heroku login
    
    print_info "Creating Heroku app..."
    read -p "Enter app name (e.g., manasa-portfolio-api): " app_name
    heroku create "$app_name"
    
    print_info "Setting environment variables..."
    print_warning "You'll need to set environment variables manually:"
    echo "heroku config:set NODE_ENV=production --app $app_name"
    echo "heroku config:set MONGODB_URI=<your-uri> --app $app_name"
    echo "# ... set other variables"
    
    print_info "Deploying to Heroku..."
    cd server
    git subtree push --prefix server heroku main || git push heroku \`git subtree split --prefix server main\`:main --force
    
    print_success "Backend deployed to Heroku!"
    print_info "View your app: heroku open --app $app_name"
}

# Deploy to Vercel
deploy_vercel() {
    print_header "Deploying Frontend to Vercel"
    
    if ! command_exists vercel; then
        print_error "Vercel CLI not found. Installing..."
        npm install -g vercel
    fi
    
    print_info "Logging in to Vercel..."
    vercel login
    
    print_info "Deploying to Vercel..."
    cd client
    
    print_warning "Make sure to set environment variables in Vercel dashboard:"
    echo "  VITE_API_URL=<your-backend-url>"
    echo "  VITE_SITE_URL=<your-frontend-url>"
    echo "  VITE_APP_NAME=Manasa Gali Portfolio"
    echo ""
    read -p "Press Enter to continue..."
    
    vercel --prod
    
    print_success "Frontend deployed to Vercel!"
}

# Deploy to Netlify
deploy_netlify() {
    print_header "Deploying Frontend to Netlify"
    
    if ! command_exists netlify; then
        print_error "Netlify CLI not found. Installing..."
        npm install -g netlify-cli
    fi
    
    print_info "Logging in to Netlify..."
    netlify login
    
    print_info "Initializing Netlify site..."
    cd client
    netlify init
    
    print_info "Setting environment variables..."
    read -p "Enter your backend API URL: " api_url
    read -p "Enter your frontend URL: " site_url
    
    netlify env:set VITE_API_URL "$api_url"
    netlify env:set VITE_SITE_URL "$site_url"
    netlify env:set VITE_APP_NAME "Manasa Gali Portfolio"
    
    print_info "Deploying to Netlify..."
    netlify deploy --prod
    
    print_success "Frontend deployed to Netlify!"
}

# Build locally
build_local() {
    print_header "Building Application Locally"
    
    print_info "Installing dependencies..."
    npm run install:all
    
    print_info "Building frontend..."
    cd client
    npm run build
    cd ..
    
    print_success "Build completed successfully!"
    print_info "Frontend build output: client/dist"
}

# Verify deployment
verify_deployment() {
    print_header "Verifying Deployment"
    
    read -p "Enter your backend API URL: " api_url
    read -p "Enter your frontend URL: " frontend_url
    
    export API_URL="$api_url"
    export FRONTEND_URL="$frontend_url"
    
    print_info "Running verification tests..."
    node scripts/verify-deployment.js
}

# Generate secrets
generate_secrets() {
    print_header "Generating Secrets"
    
    print_info "Generating JWT Secret..."
    jwt_secret=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
    echo -e "JWT_SECRET=${GREEN}$jwt_secret${NC}"
    
    print_info "Generating JWT Refresh Secret..."
    jwt_refresh=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
    echo -e "JWT_REFRESH_SECRET=${GREEN}$jwt_refresh${NC}"
    
    print_info "Generating Encryption Key..."
    cd server
    encryption_key=$(node scripts/encryptData.js --generate-key 2>&1 | grep -o '[0-9a-f]\{64\}' | head -1)
    cd ..
    echo -e "ENCRYPTION_KEY=${GREEN}$encryption_key${NC}"
    
    print_warning "Save these secrets securely!"
    print_info "Add them to your hosting service's environment variables."
}

# Main execution
main() {
    while true; do
        show_menu
        
        case $choice in
            1)
                deploy_railway
                ;;
            2)
                deploy_render
                ;;
            3)
                deploy_heroku
                ;;
            4)
                deploy_vercel
                ;;
            5)
                deploy_netlify
                ;;
            6)
                build_local
                ;;
            7)
                verify_deployment
                ;;
            8)
                generate_secrets
                ;;
            9)
                print_info "Exiting..."
                exit 0
                ;;
            *)
                print_error "Invalid option. Please try again."
                ;;
        esac
        
        echo ""
        read -p "Press Enter to continue..."
    done
}

# Run main function
main
