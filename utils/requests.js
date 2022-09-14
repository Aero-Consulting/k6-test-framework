import http from 'k6/http';
import {loginPayload, registrationPayload} from './payloads.js';

const BASE_URL = __ENV.BASE_URL || 'http://mockserver:8081'

export function postRequest(url, payload, headers = {}) {
  return http.post(`${BASE_URL}` + url, payload, headers)
}

export function registrationRequest(tags = { type: 'registration', 'Content-Type': 'application/json' }) {
  return postRequest('/api/register', registrationPayload(), { tags })
}

export function loginRequest(login, tags = { type: 'login', 'Content-Type': 'application/json' }) {
  return postRequest('/api/login', loginPayload(login),  { tags })
}