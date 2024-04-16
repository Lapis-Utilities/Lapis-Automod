const config = require("../config.json");

const { isValidPlatformChatId } = require("../src/util.js");

async function textVaildate(packet, dbAccount, client, realm) {
	if (!packet || !dbAccount || !client || !realm) return;

    if (packet.type === 'translation') return;
	if (config.debug) console.log(`Text Vaildate`);

	if (config.textChecks.textCheck1.enabled && packet.message.includes('* External')) {
		console.log(`[${packet.xuid}] External Message [T1]`);
		if (!config.debug) {
			switch (config.textChecks.textCheck1.punishment) {
				case "kick":
					client.sendCommand(`kick "${packet.xuid}" Invaild information sent. (0x91)`, 0);
					dbAccount.kickCount++
					dbAccount.save()
					break
				case "ban":
					client.sendCommand(`kick "${packet.xuid}" Invaild information sent. (0x91)`, 0);
					dbAccount.banCount++
					dbAccount.isBanned = true
					dbAccount.save()
					break
				case "clubKick":
					if (realm.isOwner) {
						realm.kick(packet.xuid);
						dbAccount.clubKickCount++
						dbAccount.save()
					}
					break
				case "clubBan":
					if (realm.isOwner) {
						realm.ban(packet.xuid);
						dbAccount.clubBanCount++
						dbAccount.save()
					}
					break
				case "warning":
					client.sendCommand(`say "${packet.xuid}" You sent invaild information. (0x91)`, 0);
					dbAccount.warningCount++
					dbAccount.save()
					break
			}
		}
	}

    if (config.textChecks.textCheck2.enabled && packet.platform_chat_id.length >= 1 && !isValidPlatformChatId(packet.platform_chat_id) && dbAccount.currentDevice != 'NintendoSwitch' || dbAccount.currentDevice != 'Orbis') {
        console.log(`[${packet.xuid}] Bad Message [T2]`);
		if (!config.debug) {
			switch (config.textChecks.textCheck2.punishment) {
				case "kick":
					client.sendCommand(`kick "${packet.xuid}" Invaild information sent. (0x93)`, 0);
					dbAccount.kickCount++
					dbAccount.save()
					break
				case "ban":
					client.sendCommand(`kick "${packet.xuid}" Invaild information sent. (0x93)`, 0);
					dbAccount.banCount++
					dbAccount.isBanned = true
					dbAccount.save()
					break
				case "clubKick":
					if (realm.isOwner) {
						realm.kick(packet.xuid);
						dbAccount.clubKickCount++
						dbAccount.save()
					}
					break
				case "clubBan":
					if (realm.isOwner) {
						realm.ban(packet.xuid);
						dbAccount.clubBanCount++
						dbAccount.save()
					}
					break
				case "warning":
					client.sendCommand(`say "${packet.xuid}" You sent invaild information. (0x93)`, 0);
					dbAccount.warningCount++
					dbAccount.save()
					break
			}
		}
    }

    if (config.textChecks.textCheck3.enabled && packet.platform_chat_id.length >= 1 && dbAccount.currentDevice != 'NintendoSwitch' || dbAccount.currentDevice != 'Orbis') {
        console.log(`[${packet.xuid}] Bad Message [T3]`);
		if (!config.debug) {
			switch (config.textChecks.textCheck3.punishment) {
				case "kick":
					client.sendCommand(`kick "${packet.xuid}" Invaild information sent. (0x95)`, 0);
					dbAccount.kickCount++
					dbAccount.save()
					break
				case "ban":
					client.sendCommand(`kick "${packet.xuid}" Invaild information sent. (0x95)`, 0);
					dbAccount.banCount++
					dbAccount.isBanned = true
					dbAccount.save()
					break
				case "clubKick":
					if (realm.isOwner) {
						realm.kick(packet.xuid);
						dbAccount.clubKickCount++
						dbAccount.save()
					}
					break
				case "clubBan":
					if (realm.isOwner) {
						realm.ban(packet.xuid);
						dbAccount.clubBanCount++
						dbAccount.save()
					}
					break
				case "warning":
					client.sendCommand(`say "${packet.xuid}" You sent invaild information. (0x95)`, 0);
					dbAccount.warningCount++
					dbAccount.save()
					break
			}
		}
    }
}

module.exports = {
	textVaildate
};