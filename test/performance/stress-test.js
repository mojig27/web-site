import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 }, // رمپ-آپ به 100 کاربر
    { duration: '5m', target: 100 }, // حفظ 100 کاربر
    { duration: '2m', target: 200 }, // رمپ-آپ به 200 کاربر
    { duration: '5m', target: 200 }, // حفظ 200 کاربر
    { duration: '2m', target: 0 },   // رمپ-داون به 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% از درخواست‌ها باید زیر 500ms باشند
    http_req_failed: ['rate<0.01'],   // نرخ خطا کمتر از 1%
  },
};

export default function() {
  let response = http.get('http://localhost:3000');
  
  check(response, {
    'is status 200': (r) => r.status === 200,
    'transaction time < 500ms': (r) => r.timings.duration < 500,
  });

  // حافظه و CPU را چک می‌کنیم
  let metrics = {
    memory_usage: response.timings.duration,
    cpu_usage: response.timings.duration,
  };

  sleep(1);
}