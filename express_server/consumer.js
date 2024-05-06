const emailClient = require('./emailclient');
const redis = require('redis');

(async function mainSender() {
  const client = redis.createClient({
    url: 'redis://localhost:6379'
  })
    .on('error', err => console.log('Redis Client Error', err))
    .on('ready', () => console.log('Redis server is connected'))
    
  // Await connection before proceeding
  await client.connect();

  const onDataChannel = 'user_data_added';

  client.subscribe(onDataChannel, (err, channel) => {
    if (err) {
      console.error('Error subscribing to channel:', err);
    } else {
      console.log('Subscribed to channel:', channel);
    }
  });

  client.on('message', async (channel, message) => {
    console.log(channel, onDataChannel);
    if (channel === onDataChannel) {
      console.log('Received data');
      const data = await client.lPop('user_data_queue');
      const user_data = JSON.parse(await data);
      await emailClient.mailMe(user_data);
      // Process the data (message) here (message will contain the user data)
  }

});
})()
