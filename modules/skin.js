const config = require("../config.json");

function skinVaildate(packet, dbAccount, client, realm, packetType) {
	if (!packet || !client || !dbAccount || !realm) return;

	if (config.debug) console.log(`Skin Vaildate`);

	if (packetType === "playerList") {
		if (config.skinChecks.skinCheck1.enabled && packet.skin_data.skin_data.width > 512 || packet.skin_data.skin_data.width < 64) {
			console.log(`[${packet.xbox_user_id}] Bad skin information [T1]`);
			if (!config.debug) {
				switch (config.skinChecks.skinCheck1.punishment) {
					case "kick":
						client.sendCommand(`kick "${packet.xbox_user_id}" Invaild skin information sent. (0x3f5)`, 0)
						dbAccount.kickCount++
						dbAccount.save()
						break
					case "ban":
						client.sendCommand(`kick "${packet.xbox_user_id}" Invaild skin information sent. (0x3f5)`, 0)
						dbAccount.banCount++
						dbAccount.isBanned = true
						dbAccount.save()
						break
					case "clubKick":
						if (realm.isOwner) {
							realm.kick(packet.xbox_user_id);
							dbAccount.clubKickCount++
							dbAccount.save()
						}
						break
					case "clubBan":
						if (realm.isOwner) {
							realm.ban(packet.xbox_user_id);
							dbAccount.clubBanCount++
							dbAccount.save()
						}
						break
					case "warning":
						client.sendCommand(`say "${packet.xbox_user_id}" You sent invaild skin information. (0x3f5)`, 0)
						dbAccount.warningCount++
						dbAccount.save()
						break
				}
			}
		}

		if (config.skinChecks.skinCheck2.enabled && packet.skin_data.skin_data.height > 512 || packet.skin_data.skin_data.height < 64) {
			console.log(`[${packet.xbox_user_id}] Bad skin information [T2]`);
			if (!config.debug) {
				switch (config.skinChecks.skinCheck2.punishment) {
					case "kick":
						client.sendCommand(`kick "${packet.xbox_user_id}" Invaild skin information sent. (0x3f6)`, 0)
						dbAccount.kickCount++
						dbAccount.save()
						break
					case "ban":
						client.sendCommand(`kick "${packet.xbox_user_id}" Invaild skin information sent. (0x3f6)`, 0)
						dbAccount.banCount++
						dbAccount.isBanned = true
						dbAccount.save()
						break
					case "clubKick":
						if (realm.isOwner) {
							realm.kick(packet.xbox_user_id);
							dbAccount.clubKickCount++
							dbAccount.save()
						}
						break
					case "clubBan":
						if (realm.isOwner) {
							realm.ban(packet.xbox_user_id);
							dbAccount.clubBanCount++
							dbAccount.save()
						}
						break
					case "warning":
						client.sendCommand(`say "${packet.xbox_user_id}" You sent invaild skin information. (0x3f6)`, 0)
						dbAccount.warningCount++
						dbAccount.save()
						break
				}
			}
		}

		if (config.skinChecks.skinCheck3.enabled && !packet.skin_data.skin_resource_pack.includes('geometry.humanoid.customSlim') && !packet.skin_data.skin_resource_pack.includes('geometry.humanoid.custom') && (packet.skin_data.play_fab_id > 16 || packet.skin_data.play_fab_id < 16)) {
			console.log(`[${packet.xbox_user_id}] Bad skin information [T3]`);
			if (!config.debug) {
				switch (config.skinChecks.skinCheck3.punishment) {
					case "kick":
						client.sendCommand(`kick "${packet.xbox_user_id}" Invaild skin information sent. (0x3f6)`, 0)
						dbAccount.kickCount++
						dbAccount.save()
						break
					case "ban":
						client.sendCommand(`kick "${packet.xbox_user_id}" Invaild skin information sent. (0x3f6)`, 0)
						dbAccount.banCount++
						dbAccount.isBanned = true
						dbAccount.save()
						break
					case "clubKick":
						if (realm.isOwner) {
							realm.kick(packet.xbox_user_id);
							dbAccount.clubKickCount++
							dbAccount.save()
						}
						break
					case "clubBan":
						if (realm.isOwner) {
							realm.ban(packet.xbox_user_id);
							dbAccount.clubBanCount++
							dbAccount.save()
						}
						break
					case "warning":
						client.sendCommand(`say "${packet.xbox_user_id}" You sent invaild skin information. (0x3f6)`, 0)
						dbAccount.warningCount++
						dbAccount.save()
						break
				}
			}
		}

		if (config.skinChecks.skinCheck4.enabled)
			if (
				!packet.skin_data.skin_resource_pack.includes("geometry.humanoid.custom") &&
				!packet.skin_data.skin_resource_pack.includes(packet.skin_data.play_fab_id) &&
				!packet.skin_data.skin_id.includes(packet.skin_data.play_fab_id) &&
				!packet.skin_data.full_skin_id.includes(packet.skin_data.play_fab_id) &&
				!packet.skin_data.geometry_data.includes(packet.skin_data.play_fab_id)) {
				console.log(`[${packet.xbox_user_id}] Bad skin information [T4]`);
				if (!config.debug) {
					switch (config.skinChecks.skinCheck4.punishment) {
						case "kick":
							client.sendCommand(`kick "${packet.xbox_user_id}" Invaild skin information sent. (0x3f10)`, 0)
							dbAccount.kickCount++
							dbAccount.save()
							break
						case "ban":
							client.sendCommand(`kick "${packet.xbox_user_id}" Invaild skin information sent. (0x3f10)`, 0)
							dbAccount.banCount++
							dbAccount.isBanned = true
							dbAccount.save()
							break
						case "clubKick":
							if (realm.isOwner) {
								realm.kick(packet.xbox_user_id);
								dbAccount.clubKickCount++
								dbAccount.save()
							}
							break
						case "clubBan":
							if (realm.isOwner) {
								realm.ban(packet.xbox_user_id);
								dbAccount.clubBanCount++
								dbAccount.save()
							}
							break
						case "warning":
							client.sendCommand(`say "${packet.xbox_user_id}" You sent invaild skin information. (0x3f10)`, 0)
							dbAccount.warningCount++
							dbAccount.save()
							break
					}
				}
			}

		if (config.skinChecks.skinCheck5.enabled && packet.skin_data.geometry_data_version != "1.14.0" && packet.skin_data.geometry_data_version != "0.0.0") {
			console.log(`[${packet.xbox_user_id}] Bad skin information [T5]`);
			if (!config.debug) {
				switch (config.skinChecks.skinCheck5.punishment) {
					case "kick":
						client.sendCommand(`kick "${packet.xbox_user_id}" Invaild skin information sent. (0x3f11)`, 0)
						dbAccount.kickCount++
						dbAccount.save()
						break
					case "ban":
						client.sendCommand(`kick "${packet.xbox_user_id}" Invaild skin information sent. (0x3f11)`, 0)
						dbAccount.banCount++
						dbAccount.isBanned = true
						dbAccount.save()
						break
					case "clubKick":
						if (realm.isOwner) {
							realm.kick(packet.xbox_user_id);
							dbAccount.clubKickCount++
							dbAccount.save()
						}
						break
					case "clubBan":
						if (realm.isOwner) {
							realm.ban(packet.xbox_user_id);
							dbAccount.clubBanCount++
							dbAccount.save()
						}
						break
					case "warning":
						client.sendCommand(`say "${packet.xbox_user_id}" You sent invaild skin information. (0x3f11)`, 0)
						dbAccount.warningCount++
						dbAccount.save()
						break
				}
			}
		}

		if (config.skinChecks.skinCheck6.enabled && packet.skin_data.skin_resource_pack.includes(' "default" : "geometry.humanoid"\n')) {
			console.log(`[${packet.xbox_user_id}] Bad skin information [T6]`);
			if (!config.debug) {
				switch (config.skinChecks.skinCheck6.punishment) {
					case "kick":
						client.sendCommand(`kick "${packet.xbox_user_id}" Invaild skin information sent. (0x3f12)`, 0)
						dbAccount.kickCount++
						dbAccount.save()
						break
					case "ban":
						client.sendCommand(`kick "${packet.xbox_user_id}" Invaild skin information sent. (0x3f12)`, 0)
						dbAccount.banCount++
						dbAccount.isBanned = true
						dbAccount.save()
						break
					case "clubKick":
						if (realm.isOwner) {
							realm.kick(packet.xbox_user_id);
							dbAccount.clubKickCount++
							dbAccount.save()
						}
						break
					case "clubBan":
						if (realm.isOwner) {
							realm.ban(packet.xbox_user_id);
							dbAccount.clubBanCount++
							dbAccount.save()
						}
						break
					case "warning":
						client.sendCommand(`say "${packet.xbox_user_id}" You sent invaild skin information. (0x3f12)`, 0)
						dbAccount.warningCount++
						dbAccount.save()
						break
				}
			}
		}

		if (config.skinChecks.skinCheck7.enabled && !packet.skin_data.skin_resource_pack.includes("default")) {
			console.log(`[${packet.xbox_user_id}] Bad skin information [T7]`);
			if (!config.debug) {
				switch (config.skinChecks.skinCheck7.punishment) {
					case "kick":
						client.sendCommand(`kick "${packet.xbox_user_id}" Invaild skin information sent. (0x3f13)`, 0)
						dbAccount.kickCount++
						dbAccount.save()
						break
					case "ban":
						client.sendCommand(`kick "${packet.xbox_user_id}" Invaild skin information sent. (0x3f13)`, 0)
						dbAccount.banCount++
						dbAccount.isBanned = true
						dbAccount.save()
						break
					case "clubKick":
						if (realm.isOwner) {
							realm.kick(packet.xbox_user_id);
							dbAccount.clubKickCount++
							dbAccount.save()
						}
						break
					case "clubBan":
						if (realm.isOwner) {
							realm.ban(packet.xbox_user_id);
							dbAccount.clubBanCount++
							dbAccount.save()
						}
						break
					case "warning":
						client.sendCommand(`say "${packet.xbox_user_id}" You sent invaild skin information. (0x3f13)`, 0)
						dbAccount.warningCount++
						dbAccount.save()
						break
				}
			}
		}
	} else if (packetType === "playerSkin") {
		if (config.skinChecks.skinCheck1.enabled && packet.skin.skin_data.width > 512 || packet.skin.skin_data.width < 64) {
			console.log(`[${dbAccount.xuid}] Bad skin information [T1]`);
			if (!config.debug) {
				switch (config.skinChecks.skinCheck1.punishment) {
					case "kick":
						client.sendCommand(`kick "${dbAccount.xuid}" Invaild skin information sent. (0x5d3)`, 0)
						dbAccount.kickCount++
						dbAccount.save()
						break
					case "ban":
						client.sendCommand(`kick "${dbAccount.xuid}" Invaild skin information sent. (0x5d3)`, 0)
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
						client.sendCommand(`say "${dbAccount.xuid}" You sent invaild skin information. (0x5d3)`, 0)
						dbAccount.warningCount++
						dbAccount.save()
						break
				}
			}
		}

		if (config.skinChecks.skinCheck3.enabled && !packet.skin.skin_resource_pack.includes('geometry.humanoid.customSlim') && !packet.skin.skin_resource_pack.includes('geometry.humanoid.custom') && (packet.skin.play_fab_id > 16 || packet.skin.play_fab_id < 16)) {
			console.log(`[${dbAccount.xuid}] Bad skin information [T3]`);
			if (!config.debug) {
				switch (config.skinChecks.skinCheck3.punishment) {
					case "kick":
						client.sendCommand(`kick "${dbAccount.xuid}" Invaild skin information sent. (0x5d6)`, 0)
						dbAccount.kickCount++
						dbAccount.save()
						break
					case "ban":
						client.sendCommand(`kick "${dbAccount.xuid}" Invaild skin information sent. (0x5d6)`, 0)
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
						client.sendCommand(`say "${dbAccount.xuid}" You sent invaild skin information. (0x5d6)`, 0)
						dbAccount.warningCount++
						dbAccount.save()
						break
				}
			}
		}

		if (config.skinChecks.skinCheck4.enabled)
			if (
				!packet.skin.skin_resource_pack.includes(packet.skin.play_fab_id) ||
				!packet.skin.skin_id.includes(packet.skin.play_fab_id) ||
				!packet.skin.full_skin_id.includes(packet.skin.play_fab_id) ||
				!packet.skin.geometry_data.includes(packet.skin.play_fab_id)) {
				console.log(`[${dbAccount.xuid}] Bad skin information [T4]`);
				if (!config.debug) {
					switch (config.skinChecks.skinCheck4.punishment) {
						case "kick":
							client.sendCommand(`kick "${dbAccount.xuid}" Invaild skin information sent. (0x5d8)`, 0)
							dbAccount.kickCount++
							dbAccount.save()
							break
						case "ban":
							client.sendCommand(`kick "${dbAccount.xuid}" Invaild skin information sent. (0x5d8)`, 0)
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
							client.sendCommand(`say "${dbAccount.xuid}" You sent invaild skin information. (0x5d8)`, 0)
							dbAccount.warningCount++
							dbAccount.save()	
							break
					}

				}
			}

		if (config.skinChecks.skinCheck6.enabled && packet.skin.skin_resource_pack.includes(' "default" : "geometry.humanoid"\n')) {
			console.log(`[${dbAccount.xuid}] Bad skin information [T6]`);
			if (!config.debug) {
				switch (config.skinChecks.skinCheck6.punishment) {
					case "kick":
						client.sendCommand(`kick "${dbAccount.xuid}" Invaild skin information sent. (0x5d10)`, 0)
						dbAccount.kickCount++
						dbAccount.save()
						break
					case "ban":
						client.sendCommand(`kick "${dbAccount.xuid}" Invaild skin information sent. (0x5d10)`, 0)
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
						client.sendCommand(`say "${dbAccount.xuid}" You sent invaild skin information. (0x5d10)`, 0)
						dbAccount.warningCount++
						dbAccount.save()
						break
				}
			}
		}

		if (config.skinChecks.skinCheck7.enabled && !packet.skin.skin_resource_pack.includes("default")) {
			console.log(`[${dbAccount.xuid}] Bad skin information [T7]`);
			if (!config.debug) {
				switch (config.skinChecks.skinCheck7.punishment) {
					case "kick":
						client.sendCommand(`kick "${dbAccount.xuid}" Invaild skin information sent. (0x5d11)`, 0)
						dbAccount.kickCount++
						dbAccount.save()
						break
					case "ban":
						client.sendCommand(`kick "${dbAccount.xuid}" Invaild skin information sent. (0x5d11)`, 0)
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
						client.sendCommand(`say "${dbAccount.xuid}" You sent invaild skin information. (0x5d11)`, 0)
						dbAccount.warningCount++
						dbAccount.save()
						break
				}
			}
		}
	} else {
		console.log(`Packet type: ${packetType} is not vaild. Failed to do any checks.`);
	}
}

module.exports = {
	skinVaildate
};