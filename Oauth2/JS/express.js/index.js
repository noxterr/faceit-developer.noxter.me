import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
dotenv.config()

const app = express()
app.set('view engine', 'ejs')
const jsonParser = bodyParser.json()
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.get('/', async(req, res) => {
    // Compile the source code
    // const compiledFunction = pug.compileFile('query.pug');
    const code_verified = base64_url_encode(process.env.CODE_VERIFIED)
    const code_challenge = await sha256(code_verified)

    res.render('index', {
        client_id: process.env.CLIENT_ID,
        code_verified: code_verified,
        code_challenge: code_challenge,
        code_challenge_method: 'S256'
    });
})

// create a function that base64 url encodes a string
function base64_url_encode(str) {

    return btoa(str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''));
}

async function sha256(message) {
    // encode as UTF-8
    const msgBuffer = new TextEncoder().encode(message);

    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // convert bytes to hex string
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

app.listen(3000, () => {
    console.log(`[server]: Server is running at http://localhost:${3000}`)
})

export const viteNodeApp = app