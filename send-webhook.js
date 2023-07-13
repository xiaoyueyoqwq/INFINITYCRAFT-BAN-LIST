const axios = require('axios');

const discordWebhookURL = process.env.DISCORD_WEBHOOK_URL;
const commitURL = process.env.GITHUB_SERVER_URL + '/' + process.env.GITHUB_REPOSITORY + '/commit/' + process.env.GITHUB_SHA;

const generateChangesList = (changes) => {
  if (changes.length === 0) {
    return 'None';
  }

  return changes.map((change) => `:white_check_mark: ${change}`).join('\n');
};

const payload = {
  content: 'New commit',
  embeds: [
    {
      title: 'Commit Details',
      url: commitURL,
      description: 'New commit has been made to the repository.',
      color: 16777215, // White color
      fields: [
        {
          name: ':pencil2: Commit Message',
          value: process.env.GITHUB_COMMIT_MESSAGE,
        },
        {
          name: ':bust_in_silhouette: Author',
          value: process.env.GITHUB_ACTOR,
          inline: true,
        },
        {
          name: ':heavy_plus_sign: Added Files',
          value: generateChangesList(process.env.GITHUB_ADDED_FILES.split('\n')),
          inline: true,
        },
        {
          name: ':pencil: Modified Files',
          value: generateChangesList(process.env.GITHUB_MODIFIED_FILES.split('\n')),
          inline: true,
        },
        {
          name: ':wastebasket: Deleted Files',
          value: generateChangesList(process.env.GITHUB_DELETED_FILES.split('\n')),
          inline: true,
        },
      ],
    },
  ],
};

axios
  .post(discordWebhookURL, payload)
  .then(() => {
    console.log('Discord webhook notification sent successfully.');
  })
  .catch((error) => {
    console.error('Error sending Discord webhook notification:', error);
  });
