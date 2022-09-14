export function registrationPayload() {
  return {
    "email": "eve.holt@reqres.in",
    "password": "pistol"
  }
}

export function loginPayload(login) {
  return {
    "login": login,
    "password": "test"
  }
}