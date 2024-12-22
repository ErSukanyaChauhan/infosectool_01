
const express = require("express");
const cors = require('cors');
const app = express();
const request = require('request');
const { TwitterApi } = require("twitter-api-v2");
const { BskyAgent } = require("@atproto/api");
const bodyParser = require("body-parser");
const axios = require("axios");

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use(cors());
// Replace with your Bluesky credentials
const handle = "bedtime-story.bsky.social"; // Your Bluesky username
const appPassword = "M0bile@number"; // Generated App Password
const agent = new BskyAgent({ service: "https://bsky.social" });
// Twitter API credentials
const twitterClient = new TwitterApi({
  appKey: "xLu8SIDWRgpLlz76FyH2TFM73",
  appSecret: "UycwJHncclfiRzZpEzvM6Iz5N6tezQl749YeUkSafzzmE5UGIB",
  accessToken: "157896629-NbGJf1c7fL07tjC1gq3Vs8XZKVE8dSzqSdszhWEX",
  accessSecret: "x6R7xf0UdTSqPR1UBS6RvdkTmGRUB4MjLUZU6Xfti4IHS",
});

app.get('/api/hash/:hash', (req, res) => {
  const hash = req.params.hash;
  const options = {
    url: `http://www.virustotal.com/api/v3/files/${hash}`,
    headers: {
      accept: 'application/json',
      'x-apikey': '4a812c43e5c6d22664cba618b14df7830dac5979759fa6b447ac9d3a6b8a22cd'
    }
  };
  request(options).pipe(res);
});


app.get('/api/check/:ip', async (req, res) => {
  const ip = req.params.ip;
  console.log(`Checking IP: ${ip}`);

  const option1 = {
    url: 'https://api.abuseipdb.com/api/v2/check',
    params: { ipAddress: ip, verbose: true },
    headers: {
      'Accept': 'application/json',
      'Key': 'ca82246533814382b7d1b17fbdd67c3010a1bcb2c646f5f7045d1762d2c1490b6a34bfdc0be0f7c6',
    },
  };

  const option2 = {
    url: `https://www.virustotal.com/api/v3/ip_addresses/${ip}`,
    headers: {
      accept: 'application/json',
      'X-ApiKey': '4a812c43e5c6d22664cba618b14df7830dac5979759fa6b447ac9d3a6b8a22cd',
    },
  };

  const option3 = {
    url: `https://api.metadefender.com/v4/ip/${ip}`,
    headers: {
      'apikey': 'b4d7b507832f3240e11faf1b2bf1724d',
    },
  };
  try {

    const [response1, response2,response3] = await Promise.all([
      axios(option1),
      axios(option2),
      axios(option3 ),
    ]);

    // Combine the data from both responses
    const combinedResponse = {
      abuseIPDB: response1.data,
      virusTotal: response2.data,
      metaDefender: response3.data,
    };

    console.log('Combined API Response:', combinedResponse);
    res.json(combinedResponse);
  } catch (error) {
    console.error('Error from API:', error.combinedResponse?.data || error.message);
    res.status(error.combinedResponse?.status || 500).json({
      error: error.combinedResponse?.data || 'An error occurred',
    });
  }
});


app.post("/api/post-to-twitter", async (req, res) => {
  const { message, url } = req.body;
  try {
    const tweet = await twitterClient.v2.tweet(`${message} ${url}`);
    res.status(200).json({ success: true, tweet });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/post-to-mastodon', async (req, res) => {
  const { status } = req.body;
  const accessToken = 'Eb3_Cay9NTOEbdaAbfyi4CRJAyYuOKf2g-EX8EtiQ6k'; // Replace with dynamic token handling
  const instanceUrl = 'https://mastodon.social'; // Replace with your instance

  try {
    const response = await axios.post(
      `${instanceUrl}/api/v1/statuses`,
      { status, visibility: 'public' },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.response?.data || error.message });
  }
});

app.post("/api/post-to-bluesky", async (req, res) => {
  const { text, url } = req.body; // Example input: { text: "Check this out!", url: "https://example.com" }

  try {
    // Login to Bluesky
    await agent.login({ identifier: handle, password: appPassword });

    // Post to Bluesky
    const response = await agent.post({
      text: `${text}\n${url}`, // Combine the message and URL
    });

    res.status(200).json({
      success: true,
      post: response,
    });
  } catch (error) {
    console.error("Error posting to Bluesky:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to post to Bluesky",
    });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


//old code 
// const express = require('express');
// const axios = require('axios');
// const cors = require('cors');
// const app = express();
// const request = require('request');

// app.use(cors());

// app.get('/api/hash/:hash', (req, res) => {
//   const hash = req.params.hash;
//   const options = {
//     url: `http://www.virustotal.com/api/v3/files/${hash}`,
//     headers: {
//       accept: 'application/json',
//       'x-apikey': '4a812c43e5c6d22664cba618b14df7830dac5979759fa6b447ac9d3a6b8a22cd'
//     }
//   };
//   request(options).pipe(res);
// });


// app.get('/api/check/:ip', async (req, res) => {
//   const ip = req.params.ip;
//   console.log(`Checking IP: ${ip}`);

//   const option1 = {
//     url: 'https://api.abuseipdb.com/api/v2/check',
//     params: { ipAddress: ip, verbose: true },
//     headers: {
//       'Accept': 'application/json',
//       'Key': 'ca82246533814382b7d1b17fbdd67c3010a1bcb2c646f5f7045d1762d2c1490b6a34bfdc0be0f7c6',
//     },
//   };

//   const option2 = {
//     url: `https://www.virustotal.com/api/v3/ip_addresses/${ip}`,
//     headers: {
//       accept: 'application/json',
//       'X-ApiKey': '4a812c43e5c6d22664cba618b14df7830dac5979759fa6b447ac9d3a6b8a22cd',
//     },
//   };

//   const option3 = {
//     url: `https://api.metadefender.com/v4/ip/${ip}`,
//     headers: {
//       'apikey': 'b4d7b507832f3240e11faf1b2bf1724d',
//     },
//   };
//   try {

//     const [response1, response2,response3] = await Promise.all([
//       axios(option1),
//       axios(option2),
//       axios(option3 ),
//     ]);

//     // Combine the data from both responses
//     const combinedResponse = {
//       abuseIPDB: response1.data,
//       virusTotal: response2.data,
//       metaDefender: response3.data,
//     };

//     console.log('Combined API Response:', combinedResponse);
//     res.json(combinedResponse);
//   } catch (error) {
//     console.error('Error from API:', error.combinedResponse?.data || error.message);
//     res.status(error.combinedResponse?.status || 500).json({
//       error: error.combinedResponse?.data || 'An error occurred',
//     });
//   }
// });

// const PORT = 4000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });





