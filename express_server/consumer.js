const emailClient = require('./emailclient');
const Bull = require('bull');

(async function mainSender() {
  const queue = new Bull('user_data_queue'); // Define the queue name

  queue.on('error', (err) => console.error('Bull queue error:', err));

  queue.process(async (job) => {
    const user_data = job.data; // Access data from the job
    console.log('Received data');
    await emailClient.mailMe(user_data);
  });

  console.log('Consumer (worker) ready');
})();