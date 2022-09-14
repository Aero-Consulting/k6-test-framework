import { check } from "k6";
import { SharedArray } from 'k6/data';

import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

import {
  registrationRequest,
  loginRequest
} from '../../utils/requests.js';

const logins = new SharedArray('logins', function () {
  const csv = open('../../data/dev_logins.csv');
  const { data } = papaparse.parse(csv, { header: true })
  return data;
});

export const options = {
  stages: [
    { duration: '5s', target: 3 },
    { duration: '10s', target: 3 }
  ],
  thresholds: {
    http_req_failed: ['rate < 0.01'], // http errors should be less than 1%
    'http_req_duration{type:registration}': [{ threshold: 'p(95) < 900' }],
    'http_req_duration{type:login}': [{ threshold: 'p(95) < 200' }]
  },
};

export function handleSummary(data) {
  return {
    "./reports/index.html": htmlReport(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}

export default function () {
  const { login } = logins[Math.floor(Math.random() * (logins.length - 1))]

  let response = registrationRequest()

  check(response, {
    'registration is status 200': (r) => r.status === 200,
    'registration is id exist': (r) => r.json().id
  });

  response = loginRequest(login)

  check(response, {
    'login is status 200': (r) => r.status === 200,
    'login is flag exist': (r) => r.json().flag
  });
}