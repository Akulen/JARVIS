function sleep(miliseconds) {
	var currentTime = new Date().getTime();

	while (currentTime + miliseconds >= new Date().getTime()) {
	}
}

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] == obj) {
            return true;
        }
    }
    return false;
}

// Create the configuration
var config = {
	channels: ["#frioi", "#botfrioi"],
	server: "irc.freenode.net",
	botName: "_JARVIS_",
	password: process.argv[2]
};
var op = new Array(
	"rigauxt",
	"cheikdav",
	"Lucas-84"
);
var autoKick = new Array();
// Get the lib
var irc = require("irc");
var c = require("irc-colors");

// Create the bot name
var bot = new irc.Client(config.server, config.botName, {
	channels: config.channels,
	userName: 'rigauxtBot',
	realName: 'rigauxtBot IRC Client'
});

bot.addListener('error', function(message) {
	console.log('error: ', message);
});

bot.addListener('raw', function(message) {
	if(message.nick == "NickServ")
	{
		bot.say('nickserv', 'identify ' + config.botName + ' ' + config.password)
	}
});

bot.addListener('message', function (from, to, message) {
	console.log(from + ' => ' + to + ': ' + c.stripColorsAndStyle(message));
	if(message.substring(0, config.botName.length+1) == config.botName + ":" || to[0] != '#')
	{
		var command = (to[0] == '#') ? message.substring(config.botName.length+2, message.length).split(' ') : message.split(' ');
		var destination = (to[0] == '#') ? to : from;
		if(command.length)
		{
			if(to[0] == '#')
			{
				if(op.contains(from))
				{
					if(command[0] == "quit")
					{
						bot.part(to);
					}
					if(command.length > 1 && command[0] == "op" && command[1] != config.botName)
					{
						bot.send('MODE', to, '+o', command[1]);
					}
					if(command.length > 1 && command[0] == "deop" && command[1] != config.botName)
					{
						bot.send('MODE', to, '-o', command[1]);
					}
					if(command.length > 1 && command[0] == "voice" && command[1] != config.botName)
					{
						bot.send('MODE', to, '+v', command[1]);
					}
					if(command.length > 1 && command[0] == "devoice" && command[1] != config.botName)
					{
						bot.send('MODE', to, '-v', command[1]);
					}
					if(command.length > 1 && command[0] == "autokick" && command[1] != config.botName && !op.contains(command[1]) && !autoKick.contains(command[1]) && command[1] != "")
					{
						autoKick.push(command[1]);
						bot.send('kick', to, command[1]);
					}
					if((command.length == 1 || command[1] == "") && command[0] == "autokick")
					{
						bot.say(to, autoKick);
					}
					if(command.length > 1 && command[0] == "stopkick" && autoKick.contains(command[1]))
					{
						autoKick.splice(autoKick.indexOf(command[1]), 1);
					}
					if((command.length == 1 || command[1] == "") && command[0] == "clearkick")
					{
						autoKick = new Array();
					}
				}
			}
			if(command[0] == "dice")
			{
				bot.say(destination, c.navy(Math.floor((Math.random()*6)+1)));
			}
		}
	}
});

bot.addListener('join', function (channel, nick, message) {
	sleep(1000);
	if(Math.floor((Math.random()*5)+1) == 1)
		bot.say(channel, c.green.bold("plop!"));
	if(op.contains(nick))
		bot.send('MODE', channel, '+o', nick);
	if(autoKick.contains(nick))
		bot.send('kick', channel, nick);
});

bot.addListener('invite', function (channel, from, message) {
	bot.join(channel);
});

bot.addListener('registered', function (channel, from, message) {
	bot.say('nickserv', 'identify ' + config.botName + ' ' + config.password)
});
