// Retrieve the token from the server using an AJAX request
// and store it in a variable called `token`
const meetingid = "6451f268280176c1a9e604fe";
const APP_ID = "8f6e8de6a56448ddb685f1a335a2d81a";
const bearer = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhLmd1ZW5hbm91QGVzaS1zYmEuZHoiLCJpYXQiOjE2ODMzODM4ODcsImV4cCI6MTY4NTk3NTg4N30.JJX_F6xXFPm4mxreD0LuBXcgBDCWbk5K8WBFxl08PuU";

// Join the stream and watch the teacher's content
async function joinStream() {
    // Hit the endpoint to check if the course exists
    const res = await fetch('http://localhost:8050/api/courses/join/'+  meetingid, { method: 'GET',
    headers: {
      'Authorization': `Bearer ${bearer}`
    } });
    const data = await res.json();

    if(data.isStudentInCourseGroup){
        // Create a new instance of the Agora client
        const client = AgoraRTC.createClient({ mode: 'live', codec: 'h264' });

        

        // Set up event listeners for when the client successfully connects to the Agora servers
        // and when it successfully joins the channel
        client.on('connection-state-change', (state) => {
            console.log(`Connection state changed to ${state}`);
        });

        client.on('user-published', async (user, mediaType) => {
        if (mediaType === 'video') {
            // Subscribe to the teacher's video stream
            const remoteStream = await client.subscribe(user);
            // Add the video stream to the HTML page
            const videoElement = document.createElement('video');
            videoElement.srcObject = remoteStream;
            videoElement.autoplay = true;
            videoElement.controls = false;
            document.body.appendChild(videoElement);
        }
        });

        // Connect to the Agora servers
        client.init(APP_ID, () => {
        console.log('AgoraRTC client initialized');
        // Join the channel with the stored token
        client.join(
            data.token,
            meetingid, // Replace with the actual course ID
            null, // Leave `optionalInfo` parameter as `null`
            () => {
                console.log('User joined the channel');
            },
        );
        });
    }



}

