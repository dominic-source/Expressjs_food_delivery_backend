const emailClient = require('./emailclient');
const Bull = require('bull');

(async function mainSender() {
  const queue = new Bull('user_data_queue');

  queue.on('error', (err) => console.error('Bull queue error:', err));

  queue.process(async (job) => {
    const user_data = job.data;
    console.log('Received data');
    await emailClient.mailMe(user_data);
  });

  console.log('Consumer (worker) ready');
})();