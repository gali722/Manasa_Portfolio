# Post-Deployment Testing Guide

This guide provides comprehensive testing procedures to verify the deployment is successful and all features are working correctly.

## Table of Contents

- [Automated Testing](#automated-testing)
- [Manual Testing](#manual-testing)
- [Performance Testing](#performance-testing)
- [Security Testing](#security-testing)
- [Accessibility Testing](#accessibility-testing)
- [Browser Compatibility Testing](#browser-compatibility-testing)
- [Mobile Testing](#mobile-testing)

## Automated Testing

### 1. Run Deployment Verification Script

```bash
# Set your deployment URLs
export API_URL="https://api.manasagali.com"
export FRONTEND_URL="https://manasagali.com"

# Run verification
./scripts/test-deployment.sh
```

This script tests:

- Backend health endpoint
- Public API endpoints
- CORS configuration
- Security headers
- Authentication
- Rate limiting
- Frontend accessibility
- HTTPS configuration

### 2. Run Lighthouse Audit

```bash
# Set frontend URL
export FRONTEND_URL="https://manasagali.com"

# Run audit
./scripts/lighthouse-audit.sh

# Run full audit (multiple pages)
./scripts/lighthouse-audit.sh --full
```

Target scores:

- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

### 3. Run Node.js Verification Script

```bash
# Set deployment URLs
export API_URL="https://api.manasagali.com"
export FRONTEND_URL="https://manasagali.com"

# Run verification
npm run verify:deployment
```

## Manual Testing

### Public Portfolio Features

#### Homepage

- [ ] Page loads within 3 seconds
- [ ] Hero section displays correctly
- [ ] Profile photo loads
- [ ] Name and title visible
- [ ] Call-to-action buttons work
- [ ] Smooth scroll to sections works
- [ ] Theme toggle switches themes
- [ ] Theme persists on reload
- [ ] Navigation menu works
- [ ] Mobile menu works on small screens

#### About Section

- [ ] Professional summary displays
- [ ] Contact information visible
- [ ] Years of experience counter works
- [ ] Section animations work
- [ ] Content is readable

#### Skills Section

- [ ] All skills display
- [ ] Skills grouped by category
- [ ] Proficiency indicators show
- [ ] Technology icons load
- [ ] Category filter works (if implemented)
- [ ] Responsive layout works

#### Projects Section

- [ ] All projects display
- [ ] Project cards show thumbnails
- [ ] Search functionality works
- [ ] Filter by technology works
- [ ] Project detail modal opens
- [ ] Image gallery works
- [ ] Lightbox zoom works
- [ ] External links work
- [ ] Technology tags display
- [ ] Pagination works (if implemented)

#### Experience Section

- [ ] Timeline displays correctly
- [ ] All positions shown
- [ ] Company logos load
- [ ] Dates are correct
- [ ] Descriptions expand/collapse
- [ ] Technologies listed
- [ ] Chronological order correct

#### Education Section

- [ ] All degrees listed
- [ ] Institution logos load
- [ ] Dates are correct
- [ ] Coursework displays
- [ ] Achievements shown

#### Certifications Section

- [ ] All certifications listed
- [ ] Badges/logos load
- [ ] Verification links work
- [ ] Dates are correct
- [ ] Issuer information shown

#### Testimonials Section

- [ ] Carousel works
- [ ] Author photos load
- [ ] Navigation controls work
- [ ] Auto-play works (if enabled)
- [ ] LinkedIn links work
- [ ] Testimonials rotate smoothly

#### Contact Form

- [ ] Form displays correctly
- [ ] All fields present (name, email, subject, message)
- [ ] Field validation works
- [ ] Required field indicators show
- [ ] Email format validation works
- [ ] Submit button works
- [ ] Loading state shows during submission
- [ ] Success message displays
- [ ] Error message displays on failure
- [ ] Form clears after success
- [ ] reCAPTCHA works (if implemented)

#### Resume Download

- [ ] Download button visible
- [ ] Click initiates download
- [ ] Correct file downloads
- [ ] Filename is appropriate
- [ ] File opens correctly
- [ ] Download tracked in analytics

#### Footer

- [ ] Copyright information correct
- [ ] Social media links work
- [ ] Links open in new tab
- [ ] Quick navigation works
- [ ] Contact information correct

### Admin Features

#### Login

- [ ] Login page accessible at `/admin/login`
- [ ] Form displays correctly
- [ ] Email/username field works
- [ ] Password field works
- [ ] Show/hide password toggle works
- [ ] Remember me checkbox works
- [ ] Login with correct credentials succeeds
- [ ] Login with wrong credentials fails
- [ ] Error messages display correctly
- [ ] Loading state shows during login
- [ ] Redirect to dashboard after login

#### Dashboard

- [ ] Dashboard loads after login
- [ ] Sidebar navigation visible
- [ ] All menu items present
- [ ] Top bar shows user info
- [ ] Logout button visible
- [ ] Breadcrumb navigation works
- [ ] Mobile menu works
- [ ] Overview cards display data

#### Profile Management

- [ ] Page loads correctly
- [ ] Current profile data displays
- [ ] Profile photo shows
- [ ] Can upload new profile photo
- [ ] Photo preview works
- [ ] Photo upload progress shows
- [ ] Can update name
- [ ] Can update title
- [ ] Can update summary (rich text editor works)
- [ ] Can update contact information
- [ ] Can update social media links
- [ ] Can upload resume
- [ ] Current resume file shows
- [ ] Resume upload progress shows
- [ ] Save button works
- [ ] Success message displays
- [ ] Changes reflect on public site immediately

#### Skills Management

- [ ] Skills list displays
- [ ] All skills shown with details
- [ ] Add new skill button works
- [ ] Add skill modal opens
- [ ] Can enter skill name
- [ ] Can select category
- [ ] Can set proficiency level
- [ ] Can add icon
- [ ] Save creates new skill
- [ ] Edit button works
- [ ] Edit modal pre-fills data
- [ ] Can update skill details
- [ ] Save updates skill
- [ ] Delete button works
- [ ] Delete confirmation shows
- [ ] Confirm deletes skill
- [ ] Drag-and-drop reordering works
- [ ] Order saves correctly
- [ ] Changes reflect on public site

#### Projects Management

- [ ] Projects list displays
- [ ] All projects shown with thumbnails
- [ ] Add new project button works
- [ ] Can enter project title
- [ ] Can enter short description
- [ ] Can enter full description (rich text)
- [ ] Can upload multiple images
- [ ] Image preview works
- [ ] Can add technology tags
- [ ] Can add external links
- [ ] Can set featured status
- [ ] Can set publish/draft status
- [ ] Save creates new project
- [ ] Edit button works
- [ ] Can update project details
- [ ] Can add/remove images
- [ ] Save updates project
- [ ] Delete button works
- [ ] Delete confirmation shows
- [ ] Confirm deletes project
- [ ] Changes reflect on public site

#### Experience Management

- [ ] Experience list displays
- [ ] All positions shown
- [ ] Add new experience button works
- [ ] Can enter company name
- [ ] Can enter position title
- [ ] Can enter location
- [ ] Can select start date
- [ ] Can select end date
- [ ] Current position checkbox works
- [ ] Can upload company logo
- [ ] Can enter description
- [ ] Can add responsibilities (bullet points)
- [ ] Can add technologies
- [ ] Save creates new experience
- [ ] Edit button works
- [ ] Can update experience details
- [ ] Save updates experience
- [ ] Delete button works
- [ ] Delete confirmation shows
- [ ] Confirm deletes experience
- [ ] Changes reflect on public site

#### Education Management

- [ ] Education list displays
- [ ] Add new education button works
- [ ] Can enter institution name
- [ ] Can enter degree
- [ ] Can enter field of study
- [ ] Can enter location
- [ ] Can select dates
- [ ] Can enter GPA
- [ ] Can add coursework
- [ ] Can upload institution logo
- [ ] Save creates new education
- [ ] Edit button works
- [ ] Can update education details
- [ ] Save updates education
- [ ] Delete button works
- [ ] Confirm deletes education
- [ ] Changes reflect on public site

#### Certifications Management

- [ ] Certifications list displays
- [ ] Add new certification button works
- [ ] Can enter certification name
- [ ] Can enter issuer
- [ ] Can select issue date
- [ ] Can select expiry date
- [ ] Can enter credential ID
- [ ] Can enter verification URL
- [ ] Can upload badge
- [ ] Save creates new certification
- [ ] Edit button works
- [ ] Can update certification details
- [ ] Save updates certification
- [ ] Delete button works
- [ ] Confirm deletes certification
- [ ] Changes reflect on public site

#### Testimonials Management

- [ ] Testimonials list displays
- [ ] Add new testimonial button works
- [ ] Can enter author name
- [ ] Can enter author title
- [ ] Can enter author company
- [ ] Can upload author photo
- [ ] Can enter testimonial content
- [ ] Can enter LinkedIn URL
- [ ] Can select relationship
- [ ] Can set visibility
- [ ] Save creates new testimonial
- [ ] Edit button works
- [ ] Can update testimonial details
- [ ] Save updates testimonial
- [ ] Delete button works
- [ ] Confirm deletes testimonial
- [ ] Drag-and-drop reordering works
- [ ] Changes reflect on public site

#### Analytics Dashboard

- [ ] Dashboard loads
- [ ] Overview cards display data
- [ ] Page views chart renders
- [ ] Unique visitors shown
- [ ] Popular sections breakdown displays
- [ ] Date range selector works
- [ ] Data updates when range changes
- [ ] Export button works
- [ ] Export downloads CSV/JSON
- [ ] Recent activity feed shows
- [ ] Resume download count shown
- [ ] Contact form submissions count shown

#### Settings Page

- [ ] Settings page loads
- [ ] Change password form displays
- [ ] Current password field works
- [ ] New password field works
- [ ] Confirm password field works
- [ ] Password validation works
- [ ] Save changes password
- [ ] Success message displays
- [ ] Email notification preferences shown
- [ ] Can toggle notifications
- [ ] Preferences save correctly
- [ ] Backup button works
- [ ] Backup downloads file
- [ ] Restore button works
- [ ] Can upload backup file
- [ ] Restore processes correctly

#### Logout

- [ ] Logout button works
- [ ] Redirects to login page
- [ ] Session cleared
- [ ] Cannot access admin pages after logout
- [ ] Must login again to access admin

### Email Functionality

#### Contact Form Emails

1. **Submit Contact Form:**
   - Go to contact page
   - Fill in all fields
   - Submit form

2. **Check Admin Email:**
   - [ ] Email received at galimanasa3@gmail.com
   - [ ] Subject line correct
   - [ ] Sender name included
   - [ ] Sender email included
   - [ ] Message content included
   - [ ] Timestamp included
   - [ ] Reply-to address is sender's email
   - [ ] Email template renders correctly
   - [ ] No formatting issues

3. **Check Visitor Email:**
   - [ ] Confirmation email received
   - [ ] Subject line appropriate
   - [ ] Greeting includes visitor name
   - [ ] Thank you message present
   - [ ] Expected response time mentioned
   - [ ] Contact information included
   - [ ] Email template renders correctly
   - [ ] Professional appearance

## Performance Testing

### Core Web Vitals

Test using Chrome DevTools or PageSpeed Insights:

- [ ] **Largest Contentful Paint (LCP):** < 2.5s
- [ ] **First Input Delay (FID):** < 100ms
- [ ] **Cumulative Layout Shift (CLS):** < 0.1

### Page Load Times

Test with slow 3G connection:

- [ ] Homepage loads in < 5s
- [ ] Projects page loads in < 5s
- [ ] Contact page loads in < 5s
- [ ] Admin dashboard loads in < 5s

### Resource Optimization

- [ ] Images are optimized (WebP format)
- [ ] Images are lazy loaded
- [ ] JavaScript is minified
- [ ] CSS is minified
- [ ] Fonts are optimized
- [ ] No render-blocking resources
- [ ] Compression enabled (gzip/brotli)

### Caching

- [ ] Static assets cached (1 year)
- [ ] API responses cached appropriately
- [ ] Service worker caching works
- [ ] Cache headers present

## Security Testing

### HTTPS

- [ ] Site accessible via HTTPS
- [ ] HTTP redirects to HTTPS
- [ ] SSL certificate valid
- [ ] No mixed content warnings
- [ ] Green padlock in browser

### Security Headers

Check using securityheaders.com:

- [ ] Strict-Transport-Security present
- [ ] X-Content-Type-Options: nosniff
- [ ] X-Frame-Options: DENY
- [ ] X-XSS-Protection: 1; mode=block
- [ ] Content-Security-Policy present
- [ ] Referrer-Policy present

### Authentication

- [ ] Cannot access admin without login
- [ ] Session expires after 24 hours
- [ ] Logout clears session
- [ ] Password is hashed (not visible in network tab)
- [ ] JWT tokens are httpOnly cookies

### Input Validation

- [ ] XSS protection works (try `<script>alert('xss')</script>`)
- [ ] SQL injection protection works (using Mongoose)
- [ ] File upload validation works
- [ ] File type restrictions enforced
- [ ] File size limits enforced
- [ ] HTML sanitization works in rich text

### Rate Limiting

- [ ] Contact form rate limited (5 per hour)
- [ ] Login rate limited (5 attempts per 15 min)
- [ ] API rate limited (100 per 15 min)
- [ ] Rate limit error messages appropriate

## Accessibility Testing

### Keyboard Navigation

- [ ] Can tab through all interactive elements
- [ ] Tab order is logical
- [ ] Focus indicators visible
- [ ] Can submit forms with Enter key
- [ ] Can close modals with Escape key
- [ ] Skip to content link works

### Screen Reader

Test with NVDA (Windows) or VoiceOver (Mac):

- [ ] All images have alt text
- [ ] Form labels are read correctly
- [ ] Buttons have descriptive labels
- [ ] Links have descriptive text
- [ ] Headings are hierarchical
- [ ] ARIA labels present where needed
- [ ] Error messages are announced

### Color Contrast

Use WebAIM Contrast Checker:

- [ ] Text meets WCAG AA (4.5:1)
- [ ] Large text meets WCAG AA (3:1)
- [ ] Interactive elements have sufficient contrast
- [ ] Focus indicators have sufficient contrast

### Forms

- [ ] All form fields have labels
- [ ] Required fields indicated
- [ ] Error messages clear and helpful
- [ ] Success messages announced
- [ ] Field validation provides feedback

## Browser Compatibility Testing

### Desktop Browsers

Test on latest versions:

- [ ] Chrome (Windows/Mac)
- [ ] Firefox (Windows/Mac)
- [ ] Safari (Mac)
- [ ] Edge (Windows)

Check:

- Layout renders correctly
- All features work
- No console errors
- Performance acceptable

### Mobile Browsers

Test on:

- [ ] Chrome (Android)
- [ ] Safari (iOS)
- [ ] Firefox (Android)
- [ ] Samsung Internet (Android)

Check:

- Responsive design works
- Touch interactions work
- Mobile menu works
- Forms are usable
- Performance acceptable

## Mobile Testing

### Responsive Design

Test at these breakpoints:

- [ ] 320px (iPhone SE)
- [ ] 375px (iPhone 12)
- [ ] 414px (iPhone 12 Pro Max)
- [ ] 768px (iPad)
- [ ] 1024px (iPad Pro)
- [ ] 1280px (Desktop)
- [ ] 1920px (Large Desktop)

### Touch Interactions

- [ ] Buttons are large enough (44x44px minimum)
- [ ] Touch targets have adequate spacing
- [ ] Swipe gestures work (if implemented)
- [ ] Pinch to zoom works on images
- [ ] No hover-only interactions

### Mobile Performance

- [ ] Page loads quickly on 3G
- [ ] Images load progressively
- [ ] Animations are smooth (60fps)
- [ ] No layout shifts
- [ ] Battery usage reasonable

## SEO Testing

### Meta Tags

- [ ] Title tag present on all pages
- [ ] Meta description present
- [ ] Open Graph tags present
- [ ] Twitter Card tags present
- [ ] Canonical URLs set
- [ ] Language attribute set

### Structured Data

Test with Google Rich Results Test:

- [ ] Person schema present
- [ ] Professional profile schema
- [ ] Contact information schema
- [ ] No errors in structured data

### Sitemap & Robots

- [ ] sitemap.xml accessible
- [ ] sitemap.xml lists all pages
- [ ] robots.txt accessible
- [ ] robots.txt allows crawling
- [ ] No broken links

### Content

- [ ] Headings are hierarchical (h1, h2, h3)
- [ ] Content is readable
- [ ] Keywords used naturally
- [ ] Internal links work
- [ ] External links open in new tab

## Testing Checklist Summary

### Critical Tests (Must Pass)

- [ ] Backend health check passes
- [ ] Frontend loads successfully
- [ ] Admin login works
- [ ] Contact form sends emails
- [ ] HTTPS enabled
- [ ] No console errors
- [ ] Mobile responsive

### Important Tests (Should Pass)

- [ ] Lighthouse scores > 90
- [ ] All CRUD operations work
- [ ] Security headers present
- [ ] Accessibility compliant
- [ ] Cross-browser compatible

### Nice to Have (Optional)

- [ ] Service worker caching
- [ ] Advanced animations
- [ ] Social media integration
- [ ] Analytics tracking
- [ ] Error monitoring

## Reporting Issues

If you find issues during testing:

1. **Document the Issue:**
   - What were you testing?
   - What did you expect?
   - What actually happened?
   - Steps to reproduce
   - Screenshots/videos

2. **Check Environment:**
   - Browser and version
   - Device and OS
   - Screen size
   - Network conditions

3. **Verify Configuration:**
   - Environment variables correct?
   - API URL correct?
   - CORS configured?
   - Database connected?

4. **Check Logs:**
   - Browser console errors
   - Network tab errors
   - Server logs
   - Database logs

5. **Create Issue:**
   - Use issue tracker
   - Include all details
   - Assign priority
   - Tag appropriately

## Post-Testing Actions

After all tests pass:

1. [ ] Document test results
2. [ ] Update deployment checklist
3. [ ] Notify stakeholders
4. [ ] Set up monitoring
5. [ ] Schedule follow-up tests
6. [ ] Plan improvements
7. [ ] Celebrate success! 🎉

## Continuous Testing

### Daily

- [ ] Check uptime
- [ ] Review error logs
- [ ] Test contact form

### Weekly

- [ ] Run automated tests
- [ ] Check performance metrics
- [ ] Review analytics

### Monthly

- [ ] Full manual testing
- [ ] Lighthouse audit
- [ ] Security scan
- [ ] Dependency updates

### Quarterly

- [ ] Comprehensive audit
- [ ] User feedback review
- [ ] Feature review
- [ ] Performance optimization
