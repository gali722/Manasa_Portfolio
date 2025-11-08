#!/bin/bash

# Lighthouse Audit Script
# Runs Lighthouse performance audit on deployed site

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
FRONTEND_URL="${FRONTEND_URL:-http://localhost:5173}"
OUTPUT_DIR="lighthouse-reports"

# Functions
print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check if Lighthouse is installed
check_lighthouse() {
    if ! command -v lighthouse &> /dev/null; then
        print_error "Lighthouse CLI not found"
        print_info "Installing Lighthouse..."
        npm install -g lighthouse
    else
        print_success "Lighthouse CLI found"
    fi
}

# Run Lighthouse audit
run_audit() {
    local url=$1
    local name=$2
    
    print_header "Running Lighthouse Audit: $name"
    print_info "URL: $url"
    
    # Create output directory
    mkdir -p "$OUTPUT_DIR"
    
    # Run Lighthouse
    lighthouse "$url" \
        --output html \
        --output json \
        --output-path "$OUTPUT_DIR/$name" \
        --chrome-flags="--headless" \
        --quiet
    
    print_success "Audit complete: $OUTPUT_DIR/$name.html"
}

# Parse and display scores
display_scores() {
    local json_file="$OUTPUT_DIR/$1.report.json"
    
    if [ ! -f "$json_file" ]; then
        print_error "Report file not found: $json_file"
        return 1
    fi
    
    print_header "Lighthouse Scores"
    
    # Extract scores using grep and sed (works without jq)
    performance=$(grep -o '"performance":[0-9.]*' "$json_file" | head -1 | cut -d':' -f2)
    accessibility=$(grep -o '"accessibility":[0-9.]*' "$json_file" | head -1 | cut -d':' -f2)
    best_practices=$(grep -o '"best-practices":[0-9.]*' "$json_file" | head -1 | cut -d':' -f2)
    seo=$(grep -o '"seo":[0-9.]*' "$json_file" | head -1 | cut -d':' -f2)
    
    # Convert to percentage
    performance=$(echo "$performance * 100" | bc 2>/dev/null || echo "0")
    accessibility=$(echo "$accessibility * 100" | bc 2>/dev/null || echo "0")
    best_practices=$(echo "$best_practices * 100" | bc 2>/dev/null || echo "0")
    seo=$(echo "$seo * 100" | bc 2>/dev/null || echo "0")
    
    # Display scores with color coding
    display_score "Performance" "$performance"
    display_score "Accessibility" "$accessibility"
    display_score "Best Practices" "$best_practices"
    display_score "SEO" "$seo"
    
    echo ""
    print_info "Full report: $OUTPUT_DIR/$1.report.html"
}

# Display individual score with color
display_score() {
    local name=$1
    local score=${2%.*}  # Remove decimal part
    
    if [ -z "$score" ] || [ "$score" = "0" ]; then
        echo -e "$name: ${YELLOW}N/A${NC}"
        return
    fi
    
    if [ "$score" -ge 90 ]; then
        echo -e "$name: ${GREEN}$score${NC}/100"
    elif [ "$score" -ge 50 ]; then
        echo -e "$name: ${YELLOW}$score${NC}/100"
    else
        echo -e "$name: ${RED}$score${NC}/100"
    fi
}

# Main execution
main() {
    print_header "Lighthouse Performance Audit"
    
    check_lighthouse
    
    # Run audit for homepage
    run_audit "$FRONTEND_URL" "homepage"
    
    # Run audit for other pages if needed
    if [ "$1" = "--full" ]; then
        print_info "Running full audit on multiple pages..."
        run_audit "$FRONTEND_URL/projects" "projects"
        run_audit "$FRONTEND_URL/contact" "contact"
        run_audit "$FRONTEND_URL/admin/login" "admin-login"
    fi
    
    # Display scores
    display_scores "homepage"
    
    print_header "Recommendations"
    echo "1. Review the HTML report for detailed recommendations"
    echo "2. Focus on metrics with scores below 90"
    echo "3. Check Core Web Vitals (LCP, FID, CLS)"
    echo "4. Optimize images and reduce JavaScript"
    echo "5. Enable caching and compression"
    echo ""
    print_info "Open report: open $OUTPUT_DIR/homepage.report.html"
}

# Run main function
main "$@"
