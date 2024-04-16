const {
	isUUIDv4
} = require("../src/util.js");

const config = require("../config.json");

function emoteVaildate(packet, dbAccount, client, realm) {
    if (!packet || !dbAccount || !client || !realm) return;
    
    if (config.debug) console.log(`Emote Vaildate`);

    if (config.emoteChecks.emoteCheck1.enabled && packet.flags === 'mute_chat') {
        console.log(`[${dbAccount.xuid}] Bad emote information [T1]`);
        if (!config.debug) {
            switch (config.emoteChecks.emoteCheck1.punishment) {
                case "kick":
                    client.sendCommand(`kick "${dbAccount.xuid}" Invaild emote information sent. (0x8a1)`, 0)
                    dbAccount.kickCount++
                    dbAccount.save()
                    break
                case "ban":
                    client.sendCommand(`kick "${dbAccount.xuid}" Invaild emote information sent. (0x8a1)`, 0)
                    dbAccount.banCount++
                    dbAccount.isBanned = true
                    dbAccount.save()
                    break
                case "clubKick":
                    if (realm.isOwner) {
                        realm.kick(dbAccount.xuid);
                        dbAccount.clubKickCount++
                        dbAccount.save()
                    }
                    break
                case "clubBan":
                    if (realm.isOwner) {
                        realm.ban(dbAccount.xuid);
                        dbAccount.clubBanCount++
                        dbAccount.save()
                    }
                    break
                case "warning":
                    client.sendCommand(`say "${dbAccount.xuid}" You sent invaild emote information. (0x8a1)`, 0)
                    dbAccount.warningCount++
                    dbAccount.save()
                    break
            }
        }
    }
}

module.exports = {
	emoteVaildate
};