const axios = require('axios');

export default async function handler(req, res) {
    const { code } = req.query;

    if (!code) {
        // Redirect to LinkedIn OAuth flow
        const CLIENT_ID = '77cup4l3n7fna8';
        const REDIRECT_URI = 'https://bota.vercel.app/api/linkedin';

        const linkedInAuthURL = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=r_liteprofile`;

        return res.redirect(linkedInAuthURL);
    }

    try {
        // Exchange code for access token
        const CLIENT_ID = '77cup4l3n7fna8';
        const CLIENT_SECRET = 'WPL_AP1.IPAJhJCJjLxLGYhf.rgqvHQ==';
        const REDIRECT_URI = 'https://bota.vercel.app/api/linkedin';

        const tokenResponse = await axios.post(
            'https://www.linkedin.com/oauth/v2/accessToken',
            new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri: REDIRECT_URI,
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
            })
        );

        const { access_token } = tokenResponse.data;

        // Fetch LinkedIn profile
        const profileResponse = await axios.get('https://api.linkedin.com/v2/me', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        // Send LinkedIn profile data back
        return res.json(profileResponse.data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
