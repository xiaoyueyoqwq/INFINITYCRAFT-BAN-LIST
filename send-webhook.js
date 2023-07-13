const axios = require('axios');

const webhookUrl = process.env.WEBHOOK_URL;

const commitMessage = process.env.GITHUB_EVENT_NAME === 'pull_request' ?
  process.env.GITHUB_EVENT_PULL_REQUEST_TITLE :
  process.env.GITHUB_EVENT_COMMIT_MESSAGE;

const commitAuthor = process.env.GITHUB_EVENT_NAME === 'pull_request' ?
  process.env.GITHUB_EVENT_PULL_REQUEST_USER_LOGIN :
  process.env.GITHUB_EVENT_AUTHOR;

const embedData = {
  title: 'IFC BAN LIST',
  description: `**${commitAuthor}** edit`,
  fields: [
    {
      name: 'Commit',
      value: commitMessage,
    },
  ],
  color: 16711680, // Red color
};

const requestData = {
  embeds: [embedData],
};

axios.post(webhookUrl, requestData)
  .then(response => {
    console.log('Webhook sent successfully');
  })
  .catch(error => {
    console.error('Error sending webhook', error);
    process.exit(1); // Terminate the script with a non-zero exit code on error
  });
