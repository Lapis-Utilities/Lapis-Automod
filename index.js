const fetch = require("node-fetch");
const chalk = require("chalk");
const prompt = require("prompt-sync")();
const config = require("./config.json");

const { moderate } = require("./src/moderate.js");
const { getRealmToken } = require("./src/xbox.js");
const { main } = require("./src/realms.js");

const realm_api_headers = {
	"Accept": "*/*",
	"authorization": "",
	"charset": "utf-8",
	"client-ref": "42039c71c23561e02d99b28a8bfb34091a61cadf",
	"client-version": "1.20.73",
	"x-clientplatform": "Windows",
	"content-type": "application/json",
	"user-agent": "MCPE/UWP",
	"Accept-Language": "en-CA",
	"Accept-Encoding": "gzip, deflate, br",
	"Host": "pocket.realms.minecraft.net",
	"Connection": "Keep-Alive"
};

(async () => {
	try {
		const xboxToken = await getRealmToken();

		realm_api_headers.authorization = `XBL3.0 x=${xboxToken.userHash};${xboxToken.XSTSToken}`;

		if (typeof config.clientOptions.realmOptions.realmCode === "string" && config.clientOptions.realmOptions.realmCode.length === 11) {
			const getRealm = await fetch(`https://pocket.realms.minecraft.net/worlds/v1/link/${config.clientOptions.realmOptions.realmCode}`, {
				method: "GET",
				headers: realm_api_headers
			});

			if (getRealm.status === 200) {
				const joinRealm = await fetch(`https://pocket.realms.minecraft.net/invites/v1/link/accept/${config.clientOptions.realmOptions.realmCode}`, {
					method: "POST",
					headers: realm_api_headers
				});

				if (joinRealm.status === 200) {
					console.log(chalk.green(`Joined ${config.clientOptions.realmOptions.realmCode} successfully.`));
				} else {
					console.log(chalk.red(`Failed to join ${config.clientOptions.realmOptions.realmCode}`));
				}
			}
		}

		const worlds = await fetch("https://pocket.realms.minecraft.net/worlds", {
			method: "GET",
			headers: realm_api_headers
		});

		const allRealms = (await worlds.json()).servers
			.filter(realm => !realm.expired && realm.state !== "CLOSED")
			.sort((a, b) => a.id - b.id);

		let realm = {};

		if (config.clientOptions.realmOptions.realmId < 100000 && !config.clientOptions.skipRealmPicking) {
			console.log(chalk.blue(`${"-".repeat(35)}`));
			console.log(allRealms.map((realm, i) => `-> ${i + 1}. ${realm.name}`).join("\n"), "\n", chalk.blue("-".repeat(35)));

			const selection = Number(prompt(chalk.blue("--> Select a number: ")));

			if (selection < 10000) {
				realm = allRealms[selection - 1];
			} else {
				realm = allRealms.find(realmData => realmData.id === selection);
			}
		} else {
			if (config.clientOptions.skipRealmPicking && typeof config.clientOptions.realmOptions.realmId === 'number') {
				realm = allRealms.find(realmData => realmData.id === config.clientOptions.realmOptions.realmId);
			}
		}

		if (!realm) {
			console.log(chalk.red(`---> Invalid number choice`));
			process.exit(1);
		}

		let realmIP;

		while (true) {
			const response = await fetch(`https://pocket.realms.minecraft.net/worlds/${realm.id}/join`, {
				method: "GET",
				headers: realm_api_headers
			}).catch(() => { });

			if (!response || (response.status !== 200 && response.status !== 503)) {
				console.log(response?.status);
				console.log(await response?.text());
				await new Promise(r => setTimeout(r, config.clientOptions.retryIPtimeout));
				continue;
			}

			try {
				if (response.status === 200) {
					console.log(chalk.green(`--> Joining ${realm.name}...`));
					realmIP = await response.json();
					realm.ip = realmIP.address.substring(0, realmIP.address.indexOf(':'));
					realm.port = Number(realmIP.address.substring(realmIP.address.indexOf(':') + 1));
				}

				if (response.status === 503) {
					console.log(chalk.red("---> Retrying..."));
					realmIP = await response.text();
				}
			} catch (err) {
				throw err;
			}

			if (response.status === 200) {
				main(realm);
				moderate(realm);
				break;
			}

			await new Promise(r => setTimeout(r, config.clientOptions.retryIPtimeout));
		}
	} catch (err) {
		if (!err.type === 'invalid-json') {
			console.log(err);
			process.exit(1);
		}
	}
})();