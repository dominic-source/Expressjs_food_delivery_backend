const fetch = require('node-fetch');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

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

const query2 = `
query {
  user(username: "chinonso") {
    username
    email
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
console.log(new Date().toString());



// //////////
fs.readFile("/home/dominic-source/Pictures/Screenshots/dash.png", (err, data) => {
  if(err) {
    console.log(`an error occured ${err}`);
    return;
  }
  const query2 = {
    id: "662a24c4bd6271906582a410"
  };

  const formData = new FormData();
  formData.append('toUploadFile', data, 'paystack.png');
  formData.append('id', query2.id);
  
  axios.post('http://localhost:5000/uploads/', formData, {
    headers: {
      ...formData.getHeaders(),
    }
  })
  .then((response) => {
    console.log('uploaded successfully');
  })
  .catch((error) => {
    console.log(error)
    console.error('Error uploading file:');
  });
});
