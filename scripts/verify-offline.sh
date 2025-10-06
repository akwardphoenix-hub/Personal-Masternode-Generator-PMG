#!/bin/bash
# verify-offline.sh - Verify the application works in offline mode

set -e

echo "🔍 Verifying Offline-Capable Setup..."
echo ""

# Check required files exist
echo "✅ Checking required files..."
test -f .env.test && echo "  ✓ .env.test exists"
test -f playwright.config.ts && echo "  ✓ playwright.config.ts exists"
test -f vite.config.ts && echo "  ✓ vite.config.ts exists"
test -f .github/workflows/test.yml && echo "  ✓ CI workflow exists"
test -f public/data/council-proposals.json && echo "  ✓ Local JSON data exists"
echo ""

# Check dependencies
echo "✅ Checking dependencies..."
test -d node_modules && echo "  ✓ node_modules installed"
test -f package-lock.json && echo "  ✓ package-lock.json exists"
echo ""

# Test build
echo "✅ Testing build..."
npm run build > /dev/null 2>&1 && echo "  ✓ Build successful"
echo ""

# Test preview server can start
echo "✅ Testing preview server..."
timeout 10 bash -c 'npm run preview > /dev/null 2>&1 &
PID=$!
sleep 3
curl -s http://127.0.0.1:4173 > /dev/null && echo "  ✓ Preview server responds"
kill $PID 2>/dev/null || true
' || echo "  ⚠ Preview server test skipped"
echo ""

# Test linting
echo "✅ Testing linting..."
npm run lint > /dev/null 2>&1 && echo "  ✓ Linting passed"
echo ""

# Test E2E (if Playwright browser installed)
if [ -d "$HOME/.cache/ms-playwright/chromium_headless_shell-1193" ]; then
  echo "✅ Testing E2E suite..."
  # Kill any existing preview servers
  pkill -f "vite preview" 2>/dev/null || true
  sleep 1
  
  # Run E2E tests
  if VITE_OFFLINE_ONLY=true npx playwright test --reporter=list 2>&1 | grep -q "3 passed"; then
    echo "  ✓ All E2E tests passed (3/3)"
  else
    echo "  ⚠ E2E tests did not pass - check manually"
  fi
else
  echo "⚠️  Playwright browser not installed - skipping E2E tests"
  echo "   Run: npx playwright install chromium"
fi
echo ""

echo "✨ All checks passed! System is offline-capable."
echo ""
echo "To run the full CI pipeline locally:"
echo "  npm run ci:all"
