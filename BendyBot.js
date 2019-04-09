const BOTKEY = require('key.js');
const DISCORD = require('discord.js');
const client = new DISCORD.Client();

//Connection based events
client.on('ready', () => {
    // List servers the bot is connected to
    console.log("Servers:")
    client.guilds.forEach((guild) => {
        console.log(" - " + guild.name)

        // List all channels
        guild.channels.forEach((channel) => {
            console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`)
        })
    })

    //Set Activity
    client.user.setActivity("you scrubs.", {type: "WATCHING"})


    //Channel messaging
    //var generalChannel = client.channels.get("386111660403851266") // Replace with known channel ID
    //generalChannel.send("Sup, bitches!")  
})
/*
//Message based events
client.on('message', (receivedMessage) => {
    // Prevent bot from responding to its own messages
    if (receivedMessage.author == client.user) {
        return
    }

    receivedMessage.channel.send("Message received from " + receivedMessage.author.toString() + ": " + receivedMessage.content)
})
*/

client.on('message', (receivedMessage) => {
    if (receivedMessage.author == client.user) { // Prevent bot from responding to its own messages
        return
    }
    
    if (receivedMessage.content.startsWith("!")) {
        processCommand(receivedMessage)
    }
})

function processCommand(receivedMessage) {
    let fullCommand = receivedMessage.content.substr(1) // Remove the leading exclamation mark
    let splitCommand = fullCommand.split(" ") // Split the message up in to pieces for each space
    let primaryCommand = splitCommand[0] // The first word directly after the exclamation is the command
    let arguments = splitCommand.slice(1) // All other words are arguments/parameters/options for the command

    console.log("Command received: " + primaryCommand)
    console.log("Arguments: " + arguments) // There may not be any arguments

    if (primaryCommand == "help") {
        helpCommand(arguments, receivedMessage)
    } else if (primaryCommand == "multiply") {
        multiplyCommand(arguments, receivedMessage)
    } else if (primaryCommand == "commands") {
        commandsCommand(arguments, receivedMessage);
    } else if (primaryCommand == "random") {
        randomCommand(arguments, receivedMessage);
    } else {
        receivedMessage.channel.send("I don't understand the command. Try '!help'")
    }
}

function helpCommand(arguments, receivedMessage) {
    receivedMessage.channel.send("I'm not sure what you need help with. Try !commands for a list of commands.")
}

function multiplyCommand(arguments, receivedMessage) {
    if (arguments.length < 2) {
        receivedMessage.channel.send("Not enough values to multiply. Try `!multiply 2 4 10` or `!multiply 5.2 7`")
        return
    }
    let product = 1 
    arguments.forEach((value) => {
        product = product * parseFloat(value)
    })
    receivedMessage.channel.send("The product of " + arguments + " multiplied together is: " + product.toString())
}

function commandsCommand(arguments, receivedMessage) {
    if (arguments.length > 0) {
        receivedMessage.channel.send("!commands is a standalone command, providing a list of available commands. Type it alone, fuckface.");
    } else {
        receivedMessage.channel.send("The current commands are as follows: \
            \n !commands \
            \n !multiply \
            \n !random");
    }
}

function randomCommand(arguments, receivedMessage) {
    if (arguments.length > 1) {
        if (arguments.length == 2 && /^\d+$/.test(arguments[0]) && /^\d+$/.test(arguments[1])) { // Handle number range (min, max) 
            arguments.sort((a, b) => a - b); // sort the numbers
            min = Math.ceil(arguments[0]); // low value
            max = Math.floor(arguments[1]); // high value
            randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
            receivedMessage.channel.send(`Random number between ${min} and ${max}: \n ${randomNum}`); 
        } else { // Select from one of options
            min = Math.ceil(0); // low value
            max = Math.floor(arguments.length -1); // high value
            randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
            answer = arguments[randomNum];
            receivedMessage.channel.send(`Between those options its: ${answer}`); 
        }
    } else {
        receivedMessage.channel.send("!random requires either a min and a max number range (!random 1 10) or a list of options to choose between (!random chalk cheese dumplings).");
    }
}

client.login(BOTKEY) // Key imported locally.