const config = require("../config.json");

const { getXboxUserData, getTitleHistory, getClubData } = require("../src/xbox.js");
const { getAccountInfo, getUserPlayFabId, getPlayerProfile, getPlayerCombinedInfo } = require("../src/playfab.js");
const { getAccountInfoA667, getUserPlayFabIdA667, getPlayerProfileA667, getPlayerCombinedInfoA667 } = require("../src/xboxPlayfab.js");

async function apiVaildate(packet, client, realm) {
    if (!packet || !client || !realm) return;
    
    if (config.debug) console.log(`API Vaildate`);

    const profile = await getXboxUserData(packet.xbox_user_id);
    const titles = await getTitleHistory(packet.xbox_user_id);

    // We do not check their PlayFabId by Player List because it can be spoofed.
    
    const playFabId = await getUserPlayFabId(packet.xbox_user_id);
    const accountInfo = await getAccountInfo(playFabId.Data[0].PlayFabId);
    const playerProfile = await getPlayerProfile(playFabId.Data[0].PlayFabId);

    const playFabIdXbox = await getUserPlayFabIdA667(packet.xbox_user_id);
    const accountInfoXbox = await getAccountInfoA667(playFabIdXbox.Data[0].PlayFabId);
    const playerProfileXbox = await getPlayerProfileA667(playFabIdXbox.Data[0].PlayFabId);

    if (config.apiChecks.apiCheck1.enabled) {
        let isAlt;

        function daysDifference(date1, date2) {
            const diffTime = Math.abs(date2 - date1);
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }

        const diffDaysMC = daysDifference(Date.parse(accountInfo.AccountInfo.Created), Date.now()) - 1;
        const diffDaysXbox = daysDifference(Date.parse(accountInfoXbox.AccountInfo.Created), Date.now()) - 1;

        let overallPercent = 0;

        const followerPercent = profile.detail.followerCount < config.apiChecks.apiCheck1.followerValue ? 10 : 0;
        const followingPercent = profile.detail.followingCount < config.apiChecks.apiCheck1.followingValue ? 10 : 0;
        const bioPercent = profile.detail.bio.length === 0 ? 10 : 0;
        const accountTierPercent = profile.detail.accountTier === 'Silver' ? 10 : 0;
        const minecraftPercent = profile.presenceText.includes('Minecraft') ? 0 : 10;
        const onlinePercent = profile.presenceState === 'Online' ? 0 : 10;
        const gamerScorePercent = (profile.gamerScore < config.apiChecks.apiCheck1.gamerScoreValue) ? 10 : 0;
        const colorPercent = (profile.preferredColor.primaryColor === '107c10' && profile.preferredColor.secondaryColor === '102b14' && profile.preferredColor.tertiaryColor === '155715' && profile.colorTheme === 'gamerpicblur' ? 5 : 0);
        const titlesPercent = (titles[0].length === 0 ? 10 : 0) +
            (titles[0].length === 1 ? 8 : titles.length === 2 ? 6 : titles.length === 3 ? 4 : titles.length === 4 ? 2 : 0);
        const presenceDetailsPercent = profile.presenceDetails[0].length === 0 ? 10 : 0;
        const createdPercent = diffDaysMC < config.apiChecks.apiCheck1.createdValue || !accountInfo.AccountInfo.created ? 20 : 0;
        const createdPercent2 = diffDaysXbox < config.apiChecks.apiCheck1.createdValue || !accountInfoXbox.AccountInfo.created ? 20 : 0;

        overallPercent += followerPercent + followingPercent + bioPercent + accountTierPercent + minecraftPercent + onlinePercent + gamerScorePercent + colorPercent + titlesPercent + presenceDetailsPercent + createdPercent + createdPercent2;

        const convertToPercent = (number) => {
            return (number / 100).toFixed(2) * 100;
        }

        const totalPercent = convertToPercent(Math.floor(overallPercent));

        console.log(`Did you know, ${packet.username} has a ${totalPercent}% chance of being a alt?`);

        if (totalPercent > 100) totalPercent = 100;

        if (totalPercent >= config.apiChecks.apiCheck1.overallValue) {
            isAlt = true;
        } else {
            isAlt = false;
        }

        if (isAlt) {
            console.log(`[${packet.xbox_user_id}] API detection [T1] - ${totalPercent}% - Created: ${accountInfo.AccountInfo.Created}`);
            if (!config.debug) {
                if (config.apiChecks.apiCheck1.punishment === "kick") {
                    client.sendCommand(`kick "${packet.xbox_user_id}" Failed to meet requirements. (${totalPercent}%) (0xFFF1)`);
                    dbAccount.kickCount++;
                    dbAccount.save();
                } else if (config.apiChecks.apiCheck1.punishment === "ban") {
                    client.sendCommand(`kick "${packet.xbox_user_id}" Failed to meet requirements. (${totalPercent}%) (0xFFF1)`);
                    dbAccount.banCount++;
                    dbAccount.isBanned = true;
                    dbAccount.save();
                } else if (config.apiChecks.apiCheck1.punishment === "clubKick" && realm.isOwner) {
                    realm.kick(packet.xbox_user_id);
                    dbAccount.clubKickCount++;
                    dbAccount.save();
                } else if (config.apiChecks.apiCheck1.punishment === "clubBan" && realm.isOwner) {
                    realm.ban(packet.xbox_user_id);
                    dbAccount.clubBanCount++;
                    dbAccount.save();
                } else if (config.apiChecks.apiCheck1.punishment === "warning") {
                    client.sendCommand(`say "${packet.xbox_user_id}" You failed to meet requirements. (${totalPercent}%) (0xFFF1)`);
                    dbAccount.warningCount++;
                    dbAccount.save();
                }
            }
        }
    }

    if (config.apiChecks.apiCheck2.enabled && playerProfile.PlayerProfile?.DisplayName) {
        console.log(`[${packet.xbox_user_id}] API detection [T3]`);
        if (!config.debug) {
            if (config.apiChecks.apiCheck2.punishment === "kick") {
                client.sendCommand(`kick "${packet.xbox_user_id}" Failed to meet requirements. (0xFFF3)`);
                dbAccount.kickCount++;
                dbAccount.save();
            } else if (config.apiChecks.apiCheck2.punishment === "ban") {
                client.sendCommand(`kick "${packet.xbox_user_id}" Failed to meet requirements. (0xFFF3)`);
                dbAccount.banCount++;
                dbAccount.isBanned = true;
                dbAccount.save();
            } else if (config.apiChecks.apiCheck2.punishment === "warning") {
                client.sendCommand(`say "${packet.xbox_user_id}" You failed to meet requirements. (0xFFF3)`);
                dbAccount.warningCount++;
                dbAccount.save();
            } else if (config.apiChecks.apiCheck2.punishment === "clubKick" && realm.isOwner) {
                realm.kick(packet.xbox_user_id);
                dbAccount.clubKickCount++;
                dbAccount.save();
            } else if (config.apiChecks.apiCheck2.punishment === "clubBan" && realm.isOwner) {
                realm.ban(packet.xbox_user_id);
                dbAccount.clubBanCount++;
                dbAccount.save();
            }
        }
    }

    if (config.apiChecks.apiCheck3.enabled && packet.skin_data.play_fab_id !== playerProfile.PlayerProfile.PlayerId.toLowerCase()) {
        console.log(`[${packet.xbox_user_id}] API detection [T4]`);
        if (!config.debug) {
            if (config.apiChecks.apiCheck3.punishment === "kick") {
                client.sendCommand(`kick "${packet.xbox_user_id}" Failed to meet requirements. (0xFFF4)`);
                dbAccount.kickCount++;
                dbAccount.save();
            } else if (config.apiChecks.apiCheck3.punishment === "ban") {
                client.sendCommand(`kick "${packet.xbox_user_id}" Failed to meet requirements. (0xFFF4)`);
                dbAccount.banCount++;
                dbAccount.isBanned = true;
                dbAccount.save();
            } else if (config.apiChecks.apiCheck3.punishment === "warning") {
                client.sendCommand(`say "${packet.xbox_user_id}" You failed to meet requirements. (0xFFF4)`);
                dbAccount.warningCount++;
                dbAccount.save();
            } else if (config.apiChecks.apiCheck3.punishment === "clubKick" && realm.isOwner) {
                realm.kick(packet.xbox_user_id);
                dbAccount.clubKickCount++;
                dbAccount.save();
            } else if (config.apiChecks.apiCheck3.punishment === "clubBan" && realm.isOwner) {
                realm.ban(packet.xbox_user_id);
                dbAccount.clubBanCount++;
                dbAccount.save();
            }
        }
    }

    if (config.apiChecks.apiCheck4.enabled && !packet.skin_data.skin_resource_pack.includes(playerProfile.PlayerProfile.PlayerId.toLowerCase())) {
        console.log(`[${packet.xbox_user_id}] API detection [T5]`);
        if (!config.debug) {
            if (config.apiChecks.apiCheck4.punishment === "kick") {
                client.sendCommand(`kick "${packet.xbox_user_id}" Failed to meet requirements. (0xFFF5)`);
                dbAccount.kickCount++;
                dbAccount.save();
            } else if (config.apiChecks.apiCheck4.punishment === "ban") {
                client.sendCommand(`kick "${packet.xbox_user_id}" Failed to meet requirements. (0xFFF5)`);
                dbAccount.banCount++;
                dbAccount.isBanned = true;
                dbAccount.save();
            } else if (config.apiChecks.apiCheck4.punishment === "warning") {
                client.sendCommand(`say "${packet.xbox_user_id}" You failed to meet requirements. (0xFFF5)`);
                dbAccount.warningCount++;
                dbAccount.save();
            } else if (config.apiChecks.apiCheck4.punishment === "clubKick" && realm.isOwner) {
                realm.kick(packet.xbox_user_id);
                dbAccount.clubKickCount++;
                dbAccount.save();
            } else if (config.apiChecks.apiCheck4.punishment === "clubBan" && realm.isOwner) {
                realm.ban(packet.xbox_user_id);
                dbAccount.clubBanCount++;
                dbAccount.save();
            }
        }
    }

    if (config.apiChecks.apiCheck5.enabled && !packet.skin_data.geometry_data.includes(playerProfile.PlayerProfile.PlayerId.toLowerCase())) {
        console.log(`[${packet.xbox_user_id}] API detection [T6]`);
        if (!config.debug) {
            if (config.apiChecks.apiCheck5.punishment === "kick") {
                client.sendCommand(`kick "${packet.xbox_user_id}" Failed to meet requirements. (0xFFF6)`);
                dbAccount.kickCount++;
                dbAccount.save();
            } else if (config.apiChecks.apiCheck5.punishment === "ban") {
                client.sendCommand(`kick "${packet.xbox_user_id}" Failed to meet requirements. (0xFFF6)`);
                dbAccount.banCount++;
                dbAccount.isBanned = true;
                dbAccount.save();
            } else if (config.apiChecks.apiCheck5.punishment === "warning") {
                client.sendCommand(`say "${packet.xbox_user_id}" You failed to meet requirements. (0xFFF6)`);
                dbAccount.warningCount++;
                dbAccount.save();
            } else if (config.apiChecks.apiCheck5.punishment === "clubKick" && realm.isOwner) {
                realm.kick(packet.xbox_user_id);
                dbAccount.clubKickCount++;
                dbAccount.save();
            } else if (config.apiChecks.apiCheck5.punishment === "clubBan" && realm.isOwner) {
                realm.ban(packet.xbox_user_id);
                dbAccount.clubBanCount++;
                dbAccount.save();
            }
        }
    }
}

module.exports = {
    apiVaildate: apiVaildate
};