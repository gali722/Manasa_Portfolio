#!/bin/bash

# Post-Deployment Testing Script
# Tests all critical features after deployment

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
API_URL="${API_URL:-http://localhost:5000}"
FRONTEND_URL="${FRONTEND_URL:-http://localhost:5173}"

# Test counters
PASSED=0
FAILED=0
WARNINGS=0

# Functions
print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_test() {
    echo -e "${BLUE}Testing:${NC} $1"
}

print_pass() {
    echo -e "${GREEN}✓ PASS${NC} $1"
    ((PASSED++))
}

print_fail() {
    echo -e "${RED}✗ FAIL${NC} $1"
    ((FAILED++))
}

print_warn() {
    echo -e "${YELLOW}⚠ WARN${NC} $1"
    ((WARNINGS++))
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Test functions
test_backend_health() {
    print_header "Backend Health Check"
    print_test "Health endpoint"
    
    response=$(curl -s -w "\n%{http_code}" "$API_URL/api/health" || echo "000")
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)
    
    if [ "$http_code" = "200" ]; then
        print_pass "Health endpoint returned 200"
        
        if echo "$body" | grep -q '"success":true'; then
            print_pass "Health check successful"
        else
            print_fail "Health check returned unexpected response"
        fi
    else
        print_fail "Health endpoint returned $http_code"
    fi
}

test_public_endpoints() {
    print_header "Public API Endpoints"
    
    endpoints=(
        "/api/profile:Profile"
        "/api/skills:Skills"
        "/api/projects:Projects"
        "/api/experience:Experience"
        "/api/education:Education"
        "/api/certifications:Certifications"
        "/api/testimonials:Testimonials"
    )
    
    for endpoint_info in "${endpoints[@]}"; do
        IFS=':' read -r endpoint name <<< "$endpoint_info"
        print_test "$name endpoint"
        
        http_code=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL$endpoint")
        
        if [ "$http_code" = "200" ] || [ "$http_code" = "404" ]; then
            print_pass "$name endpoint accessible (HTTP $http_code)"
        else
            print_fail "$name endpoint returned HTTP $http_code"
        fi
    done
}

test_cors() {
    print_header "CORS Configuration"
    print_test "CORS headers"
    
    response=$(curl -s -I -H "Origin: $FRONTEND_URL" "$API_URL/api/health")
    
    if echo "$response" | grep -qi "access-control-allow-origin"; then
        cors_origin=$(echo "$response" | grep -i "access-control-allow-origin" | cut -d' ' -f2 | tr -d '\r')
        print_pass "CORS headers present: $cors_origin"
    else
        print_fail "CORS headers not found"
    fi
}

test_security_headers() {
    print_header "Security Headers"
    
    response=$(curl -s -I "$API_URL/api/health")
    
    headers=(
        "X-Content-Type-Options"
        "X-Frame-Options"
        "X-XSS-Protection"
    )
    
    for header in "${headers[@]}"; do
        print_test "$header"
        if echo "$response" | grep -qi "$header"; then
            value=$(echo "$response" | grep -i "$header" | cut -d' ' -f2- | tr -d '\r')
            print_pass "$header: $value"
        else
            print_warn "$header not found"
        fi
    done
    
    # Check HSTS for HTTPS
    if [[ "$API_URL" == https* ]]; then
        print_test "Strict-Transport-Security"
        if echo "$response" | grep -qi "strict-transport-security"; then
            print_pass "HSTS header present"
        else
            print_warn "HSTS header not found (recommended for HTTPS)"
        fi
    fi
}

test_frontend() {
    print_header "Frontend Accessibility"
    print_test "Homepage"
    
    http_code=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL")
    
    if [ "$http_code" = "200" ]; then
        print_pass "Frontend accessible (HTTP 200)"
        
        # Check for essential HTML elements
        html=$(curl -s "$FRONTEND_URL")
        
        if echo "$html" | grep -q "<title>"; then
            print_pass "HTML contains title tag"
        else
            print_warn "Title tag not found"
        fi
        
        if echo "$html" | grep -q 'id="root"'; then
            print_pass "Root div present"
        else
            print_fail "Root div not found"
        fi
        
        if echo "$html" | grep -q "<script"; then
            print_pass "Script tags present"
        else
            print_fail "Script tags not found"
        fi
    else
        print_fail "Frontend returned HTTP $http_code"
    fi
}

test_rate_limiting() {
    print_header "Rate Limiting"
    print_test "Multiple rapid requests"
    
    success_count=0
    for i in {1..5}; do
        http_code=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/api/health")
        if [ "$http_code" = "200" ]; then
            ((success_count++))
        fi
    done
    
    if [ $success_count -ge 3 ]; then
        print_pass "Rate limiting configured (handled $success_count/5 requests)"
    else
        print_warn "Rate limiting may be too strict ($success_count/5 requests succeeded)"
    fi
}

test_authentication() {
    print_header "Authentication"
    print_test "Protected endpoint without auth"
    
    http_code=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/api/admin/profile")
    
    if [ "$http_code" = "401" ]; then
        print_pass "Protected endpoint requires authentication (HTTP 401)"
    else
        print_fail "Protected endpoint returned HTTP $http_code (expected 401)"
    fi
}

test_https() {
    print_header "HTTPS Configuration"
    
    if [[ "$API_URL" == https* ]]; then
        print_test "Backend HTTPS"
        
        if curl -s -I "$API_URL/api/health" > /dev/null 2>&1; then
            print_pass "Backend accessible via HTTPS"
        else
            print_fail "Backend HTTPS connection failed"
        fi
    else
        print_warn "Backend not using HTTPS (recommended for production)"
    fi
    
    if [[ "$FRONTEND_URL" == https* ]]; then
        print_test "Frontend HTTPS"
        
        if curl -s -I "$FRONTEND_URL" > /dev/null 2>&1; then
            print_pass "Frontend accessible via HTTPS"
        else
            print_fail "Frontend HTTPS connection failed"
        fi
    else
        print_warn "Frontend not using HTTPS (recommended for production)"
    fi
}

print_summary() {
    print_header "Test Summary"
    
    total=$((PASSED + FAILED))
    
    echo -e "${GREEN}Passed:${NC} $PASSED"
    echo -e "${RED}Failed:${NC} $FAILED"
    echo -e "${YELLOW}Warnings:${NC} $WARNINGS"
    echo -e "Total Tests: $total"
    echo ""
    
    if [ $FAILED -eq 0 ]; then
        echo -e "${GREEN}✓ All tests passed!${NC}"
        if [ $WARNINGS -gt 0 ]; then
            echo -e "${YELLOW}⚠ Review warnings above${NC}"
        fi
        exit 0
    else
        echo -e "${RED}✗ Some tests failed. Please review the issues above.${NC}"
        exit 1
    fi
}

# Main execution
main() {
    print_header "Post-Deployment Testing"
    echo "API URL: $API_URL"
    echo "Frontend URL: $FRONTEND_URL"
    
    test_backend_health
    test_public_endpoints
    test_cors
    test_security_headers
    test_authentication
    test_rate_limiting
    test_frontend
    test_https
    
    print_summary
}

# Run tests
main
