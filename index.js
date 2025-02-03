const express = require('express')
const http = require('http')

const app = express()
app.set('json spaces', 2);
app.use(express.json());

//Handle all paths
app.all('*', (req, res) => {
    const body = req.body;

    try {
        if (body && body.length > 0) {
            console.log("Received event");
            const event = req.body[0];

            const eventData = event.data;
            if (event.eventType === "Microsoft.EventGrid.SubscriptionValidationEvent") {
                console.log("Received SubscriptionValidation event");
                res.status(200).json({
                    validationResponse: eventData.validationCode,
                });

                return;
            }
        }

        // return body back
        res.status(200).json({body: body});
    }
    catch (error) {
        res.status(500).json({
            error: error
        });
        console.error("Error during the incoming call event.", error);
    }
})


var httpServer = http.createServer(app).listen(process.env.HTTP_PORT || 8080);
console.log(`Listening on ports ${process.env.HTTP_PORT || 8080} for http`);

let calledClose = false;

process.on('exit', function () {
    if (calledClose) return;
    console.log('Got exit event. Trying to stop Express server.');
    server.close(function () {
        console.log("Express server closed");
    });
});

process.on('SIGINT', shutDown);
process.on('SIGTERM', shutDown);

function shutDown() {
    console.log('Got a kill signal. Trying to exit gracefully.');
    calledClose = true;
    httpServer.close(function () {
        console.log("HTTP and HTTPS servers closed. Asking process to exit.");
        process.exit()
    });
}