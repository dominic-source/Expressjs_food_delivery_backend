const fetch = require('node-fetch');

const query = `
  mutation createUser {
    createUser(username: "chinonso", email: "chinonso@gmail.com") {
      username
      email
      created_at
    }
  }
`;

const url = 'http://localhost:5000/graphql';
fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query }),
})
.then(response => response.json())
.then(data => {
  console.log('Response data:', data);
})
.catch(error => console.error('Error sending request:', error));

console.log('Query sent successfully!');
