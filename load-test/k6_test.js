import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  vus: 200,
  duration: '60s',
};

export default function () {
  const res = http.post('http://localhost:8000/jobs', JSON.stringify({ user: 'test', vendor: 'sync' }), {
    headers: { 'Content-Type': 'application/json' },
  });

  const id = res.json().request_id;
  http.get(`http://localhost:8000/jobs/${id}`);
  sleep(1);
}
