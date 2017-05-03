var config = require('../config');
var express = require('express');
var bodyParser = require('body-parser');
var watson = require('watson-developer-cloud');

var router = express.Router();
var jsonParser = bodyParser.json();
var conversation = watson.conversation(config.watson.conversation);


router.post('/', jsonParser, function(req, res, next) {
conversation.message({
'input': {'text':req.body.text},//req.body.text,
'context': {},//req.body.context,
'workspace_id': config.watson.conversation.workspace_id
},
function(err, response) {
if (err) {
console.log('error:', err);
} else {
console.log("Detected input: " + response.input.text);
if (response.intents.length > 0) {
var intent = response.intents[0];
console.log("Detected intent: " + intent.intent);
console.log("Confidence: " + intent.confidence);
}
//if (response.output.length > 0) {
//var output = response.output[0];
//console.log("Detected output: " + output.output);
//console.log("Confidence: " + intent.confidence);
//}
if (response.entities.length > 0) {
var entity = response.entities[0];
console.log("Detected entity: " + entity.entity);
console.log("Value: " + entity.value);
if ((entity.entity === 'help') && (entity.value === 'time')) {
var msg = 'The current time is ' + new Date().toLocaleTimeString();
console.log(msg);
response.output.text = msg;
}
}	
console.log(response.output.text[0]);
console.log(JSON.stringify(response, null, 2));
if (response.output.text.length>0)
{
	res.write(response.output.text[0]);
}
res.end("");
console.log("string sent");
}
});
});

module.exports = router;