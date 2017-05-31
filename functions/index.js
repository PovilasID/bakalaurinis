var functions = require('firebase-functions');

exports.setLatest = functions.database
	.ref('/pef/{userId}')
	.orderByChild('timestamp')
	.on(event => {
		const pef = event.data.val()
		console.log("ALL THE PEFS I GOT", pef);
		console.log("LATEST PEF", Object.keys(pef)[0]);
		
		//ref.child('videos/videoId1').
	})