import { google } from 'googleapis';

const CLIENT_ID = '1098603719614-n1b7f7c913a8i3rug67ss2fsck9n0rbg.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// URL de autorización
const authUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://mail.google.com/'],
});

console.log('🔗 Autoriza esta URL:', authUrl);

const CODE = "4/0AUJR-x5ViaLGcvG8ayoPlVLM0kdonPTyByYvTpPLqIgOy2ZxjE8ay0ZnjTASk2eGpNAQNg";

async function main() {
  try {
    const { tokens } = await oAuth2Client.getToken(CODE);
    console.log('✅ Token generado:', tokens);
  } catch (err) {
    console.error('❌ Error al obtener el token:', err.response?.data || err.message);
  }
}

main();

