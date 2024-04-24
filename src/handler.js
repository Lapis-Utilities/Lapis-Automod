const { getRealmToken } = require("./xbox.js");
const { main } = require("./realms.js");

const config = require("../config.json");

const realm_api_headers = {
	"Accept": "*/*",
	"authorization": "",
	"charset": "utf-8",
	"client-ref": "08bdb049f310d03aeabda3748f857640eb62a733",
	"client-version": "1.20.80",
	"x-clientplatform": "Windows",
    "x-networkprotocolversion": 671,
	"content-type": "application/json",
	"user-agent": "MCPE/UWP",
	"Accept-Language": "en-CA",
	"Accept-Encoding": "gzip, deflate, br",
	"Host": "pocket.realms.minecraft.net",
	"Connection": "Keep-Alive"
};

async function handleFunctions(client) {
	client.sendCommand = (command, source = 0) => {
		client.queue("command_request", {
			command: command.substring(0, 512),
			origin: {
				type: source,
				uuid: "",
				request_id: ""
			},
			internal: false,
			version: 72
		});
	};

	client.sendMessage = (message) => {
		client.write("text", {
			type: "chat",
			needs_translation: false,
			source_name: client.username,
			message: message,
			xuid: client.profile.xuid,
			platform_chat_id: client.options.skinData.PlatformOnlineId
		});
	};
}

async function handleRejoin(realm) {
	if (!realm) return 'Not specified.';

	// This is very dumb, but needed for it to work
	const { moderate } = require("./moderate.js");
	const chalk = require("chalk");
	const config = require("../config.json");

    const authToken = await getRealmToken();

    if (!authToken) {
        console.log(chalk.red("Failed to get auth token"));
        process.exit(1);
    }

    realm_api_headers.authorization = `XBL3.0 x=${authToken.userHash};${authToken.XSTSToken}`;

    let realmIP;
    let retryCount = 0;

    const maxRetries = config.clientOptions.maxIPRetries;

    try {
        while (true) {
            if (retryCount >= maxRetries) {
                console.log(chalk.red("Max retries reached, exiting."));
                break;
            }

            const response = await fetch(`https://pocket.realms.minecraft.net/worlds/${realm.id}/join`, {
                method: "GET",
                headers: realm_api_headers
            }).catch((error) => {
                console.error('Fetch failed:', error);
            });

            if (!response || (response.status !== 200 && response.status !== 503)) {
                console.log(response?.status);
                console.log(await response?.text());
                await new Promise(r => setTimeout(r, config.clientOptions.retryIPtimeout));
                retryCount++;
                continue;
            }

            if (response.status === 200) {
                console.log(chalk.green(`--> Joining ${realm.name}...`));
                realmIP = await response.json();
                realm.ip = realmIP.address.substring(0, realmIP.address.indexOf(':'));
                realm.port = Number(realmIP.address.substring(realmIP.address.indexOf(':') + 1));
                main(realm);
                moderate(realm);
                break;
            } else if (response.status === 503) {
                console.log(chalk.red("---> Retry again later"));
                realmIP = await response.text();
            }

            await new Promise(r => setTimeout(r, config.clientOptions.retryIPtimeout));
            retryCount++;
        }
    } catch (err) {
        console.error('Caught an exception:', err);
        process.exit(1);
    }
}

module.exports = {
	handleFunctions,
	handleRejoin
};