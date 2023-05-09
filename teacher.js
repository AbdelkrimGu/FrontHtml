const APP_ID = "8f6e8de6a56448ddb685f1a335a2d81a"
const CHANNEL = "6451f268280176c1a9e604fe";
const bearer = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhYmRlbGtyaW1Aa3JlZXphbGlkLmNvbSIsImlhdCI6MTY4MzYwMTc3NCwiZXhwIjoxNjg2MTkzNzc0fQ.JnCrmg6cFqVxHs9aKeApgRaJCkWzV9sFKC7FPleWW9Q";

async function startStream() {
    // Create a new instance of the Agora client
    const client = AgoraRTC.createClient({ mode: 'live', codec: 'h264' });
    console.log(client);

    // Set up event listeners for when the client successfully connects to the Agora servers
    // and when it successfully joins the channel
    client.on('connection-state-change', (state) => {
        console.log(`Connection state changed to ${state}`);
    });

    client.on('user-published', async (user, mediaType) => {
    if (mediaType === 'video') {
        // Publish the teacher's video stream
        console.log("here");
        const localStream = await AgoraRTC.createStream({ audio: false, video: true });
        await localStream.setScreenSource('screen');
        await client.publish(localStream);
    }
    });

    
    console.log('AgoraRTC client initialized');

    // Hit the endpoint to check if the course exists
    const res = await fetch('http://localhost:8050/api/courses/start/' + CHANNEL, { method: 'GET' ,
    headers: {
      'Authorization': `Bearer ${bearer}`
    }});
    const data = await res.json();

    // Check if the course exists
    if (data.exists) {
        console.log('Course exists');
        console.log(data.token);

        // Join the channel with the generated token
        client.join(
            APP_ID,
            CHANNEL, // Replace with the actual course ID
            data.token,
        );
    } else {
        console.log('Course does not exist');
    }
}


