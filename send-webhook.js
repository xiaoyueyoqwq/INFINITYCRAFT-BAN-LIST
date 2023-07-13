const axios = require('axios');

const discordWebhookURL = process.env.DISCORD_WEBHOOK_URL;
const commitURL = process.env.GITHUB_SERVER_URL + '/' + process.env.GITHUB_REPOSITORY + '/commit/' + process.env.GITHUB_SHA;

const generateChangesList = (changes) => {
  if (changes.length === 0) {
    return 'None';
  }

  return changes.map((change) => {
    const { filename, additions, deletions, changes } = change;
    const action = additions > 0 ? 'Added' : deletions > 0 ? 'Deleted' : 'Modified';
    const changeInfo = `${changes} changes: ${additions} additions & ${deletions} deletions`;
    return `:white_check_mark: ${filename} (${action}): ${changeInfo}`;
  }).join('\n');
};

axios.get(`https://api.github.com/repos/${process.env.GITHUB_REPOSITORY}/commits/${process.env.GITHUB_SHA}`)
  .then((response) => {
    const commitData = response.data;

    const payload = {
      content: 'New commit',
      embeds: [
        {
          title: 'Commit Details',
          url: commitURL,
          description: commitData.commit.message,
          color: 16777215, // White color
          fields: [
            {
              name: ':bust_in_silhouette: Author',
              value: commitData.commit.author.name,
              inline: true,
            },
            {
              name: ':clock2: Date',
              value: commitData.commit.author.date,
              inline: true,
            },
            {
              name: 'File Changes',
              value: generateChangesList(commitData.files),
            },
          ],
        },
      ],
    };

    return axios.post(discordWebhookURL, payload);
  })
  .then(() => {
    console.log('Discord webhook notification sent successfully.');
  })
  .catch((error) => {
    console.error('Error sending Discord webhook notification:', error);
  });
