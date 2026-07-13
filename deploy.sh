#!/bin/bash
set -e

rm -rf dist
mkdir -p dist/assets/css dist/assets/js dist/assets/img/avatars dist/assets/img/hero

cp index.html dist/
cp feature-checkin.html feature-traduzione.html feature-faq.html feature-pulizie.html feature-daily-ops.html guest-site-demo.html dist/
cp assets/css/style.css dist/assets/css/
cp assets/js/main.js dist/assets/js/
cp assets/img/avatars/*.webp dist/assets/img/avatars/
cp assets/img/hero/*.png dist/assets/img/hero/ 2>/dev/null || true
cp assets/img/*.png assets/img/*.webp dist/assets/img/ 2>/dev/null || true

npx wrangler deploy

if [ -n "$CLOUDFLARE_API_TOKEN" ]; then
  echo "Purging Cloudflare cache..."
  curl -s -X POST "https://api.cloudflare.com/client/v4/zones/f96af629abfa5d73c2e1885be0f4e3a7/purge_cache" \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    -H "Content-Type: application/json" \
    --data '{"purge_everything":true}' | python3 -c "import sys,json; d=json.load(sys.stdin); print('Cache purged.' if d['success'] else 'Purge FAILED: ' + str(d['errors']))"
else
  echo "CLOUDFLARE_API_TOKEN not set — skipping cache purge (purge manually from dashboard)."
fi
