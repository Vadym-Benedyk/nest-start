import * as ngrok from 'ngrok';


export async function startNgrok(): Promise<void> {
  try {
    const url: string = await ngrok.connect({
      proto: 'http',
      addr: process.env.PORT || 3000,
      authtoken: process.env.NGROK_AUTH_TOKEN,
      region: 'eu',
      hostname: 'calm-platypus-prompt.ngrok-free.app',
    });

    console.log(`Ngrok tunnel is running at: ${url}`);
  } catch (error) {
    console.error('Error starting ngrok:', error);
  }
}
