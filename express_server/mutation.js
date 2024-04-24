const fetch = require('node-fetch');

const query = `
mutation createUser {
  createUser(
    lastName: "morba",
    firstName: "Linus",
    username: "chinonso",
    email: "chinonso@gmail.com",
    userType: "seller",
    status: "busy",
    passwordHash: "mypsas",
    phoneNumber: "3252526") {
    id
    username
    email
    createdAt
    updatedAt
  }
} 
`;

// const query = `
// query {
//   user(username: "chinonso") {
//     username
//     email
//   }
// }
// `;

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
console.log(new Date().toString());