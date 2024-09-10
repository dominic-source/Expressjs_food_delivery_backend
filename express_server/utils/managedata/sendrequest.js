import fetch from 'node-fetch';
// check if the file extension for a file upload is allowed
export async function authRequest(reqHeader) {
  // Login logic using the RESTful API (already implemented)
  return await fetch(`${process.env.DELIVER_URL}/api/authenticateAndAuthorize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': reqHeader
    },
  });
};

export async function loginMe(email, password) {
  return await fetch(`${process.env.DELIVER_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
};
