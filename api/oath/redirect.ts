import { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from "node-fetch"

const clientID = process.env.GITHUB_CLIENT_ID
const clientSecret = process.env.GITHUB_CLIENT_SECRET

const REDIRECT_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Redirect</title>
    <script>
        const opener=window.opener;
        opener.postMessage({accessToken:'##ACCESS_TOKEN##'},'##TARGET_ORIGIN##')
    </script>
</head>
<body>
    redirecting
</body>
</html>`

export default async (req: VercelRequest, res: VercelResponse) => {
    const oathCode = req.query.code;
    const targetOrigin = req.query.origin as string
    console.log(oathCode, req.query)
    try {
        const tokenResponse = await fetch('https://github.com/login/oauth/access_token?' +
            `client_id=${clientID}&` +
            `client_secret=${clientSecret}&` +
            `code=${oathCode}`, { method: 'post', headers: { 'accept': 'application/json' } });
        try {
            const json: any = await tokenResponse.json();
            console.log(json)
            // if (json.error) throw new Error(json.error)
            const accessToken = json.access_token;
            res.setHeader('Content-Type', 'text/html; charset=utf8')
            res.status(200).send(REDIRECT_HTML.replace('##ACCESS_TOKEN##', accessToken).replace('##TARGET_ORIGIN##', targetOrigin)).end()
        } catch (error) {
            console.log(error)
            res.status(500).json({ error, status: 1 }).end()
        }
    } catch (error) {
        res.status(500).json({ error: '', status: 1 }).end()

    }
}