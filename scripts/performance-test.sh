#!/bin/bash

# تنظیم متغیرهای محیطی
export NODE_ENV=test
export TEST_URL=http://localhost:3000

# شروع سرور تست
npm run start:test &
SERVER_PID=$!

# صبر برای آماده شدن سرور
sleep 10

echo "Running Lighthouse tests..."
npm run test:lighthouse

echo "Running K6 stress tests..."
k6 run tests/performance/stress-test.js

echo "Running JMeter load tests..."
jmeter -n -t tests/performance/load-test.jmx -l test-results.jtl

# ایجاد گزارش
echo "Generating test report..."
node scripts/generate-performance-report.js

# خاموش کردن سرور تست
kill $SERVER_PID

echo "Performance tests completed!"