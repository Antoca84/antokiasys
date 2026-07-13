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
