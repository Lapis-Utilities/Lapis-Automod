const {
	accountsModel
} = require("../src/database.js");

const {
	isUUIDv3,
	isUUIDv4WithoutDashes,
	isUUIDv5,
	isValidPlatformChatId
} = require("../src/util.js");

const { getTitleHistory, getXboxUserData } = require("../src/xbox.js");

const config = require("../config.json");

async function deviceVaildate(packet, dbAccount, client, realm, packetType) {
	if (config.debug) console.log(`Device Vaildate | Packet Type: ${packetType}`);

	if (!packet || !client || !realm) return;

	if (packetType === "playerList") {
		if (config.deviceChecks.deviceCheck1.enabled && packet.build_platform != 12 || packet.build_platform != 11 && packet.platform_chat_id.length != 0) {
			console.log(`[${packet.xbox_user_id}] Not on right platform and has a Platform Chat ID. [T1]`);
			if (!config.debug) {
				switch (config.deviceChecks.deviceCheck1.punishment) {
					case "kick":
						client.sendCommand(`kick "${packet.xbox_user_id}" Invaild information sent. (0x3f1)`, 0);
						dbAccount.kickCount++
						dbAccount.save()
						break;
					case "ban":
						client.sendCommand(`kick "${packet.xbox_user_id}" Invaild information sent. (0x3f1)`, 0);
						dbAccount.banCount++
						dbAccount.isBanned = true
						dbAccount.save()
						break;
					case "clubKick":
						if (realm.isOwner) {
							realm.kick(packet.xbox_user_id);
							dbAccount.clubKickCount++
							dbAccount.save()
						}
						break;
					case "clubBan":
						if (realm.isOwner) {
							realm.ban(packet.xbox_user_id);
							dbAccount.clubBanCount++
							dbAccount.save()
						}
						break;
					case "warning":
						client.sendCommand(`say "${packet.xbox_user_id}" You sent invaild information. (0x3f1)`, 0);
						dbAccount.warningCount++
						dbAccount.save()
						break;
				}
			}
		}

		if (config.deviceChecks.deviceCheck2.enabled && !isValidPlatformChatId(packet.platform_chat_id) && packet.build_platform === 12 || packet.build_platform === 11) {
			console.log(`[${packet.xbox_user_id}] Invaild Platform Chat ID. [T2]`);
			if (!config.debug) {
				switch (config.deviceChecks.deviceCheck2.punishment) {
					case "kick":
						client.sendCommand(`kick "${packet.xbox_user_id}" Invaild information sent. (0x3f2)`, 0);
						dbAccount.kickCount++
						dbAccount.save()
						break;
					case "ban":
						client.sendCommand(`kick "${packet.xbox_user_id}" Invaild information sent. (0x3f2)`, 0);
						dbAccount.banCount++
						dbAccount.isBanned = true
						dbAccount.save()
						break;
					case "clubKick":
						if (realm.isOwner) {
							realm.kick(packet.xbox_user_id);
							dbAccount.clubKickCount++
							dbAccount.save()
						}
						break;
					case "clubBan":
						if (realm.isOwner) {
							realm.ban(packet.xbox_user_id);
							dbAccount.clubBanCount++
							dbAccount.save()
						}
						break;
					case "warning":
						client.sendCommand(`say "${packet.xbox_user_id}" You sent invaild information. (0x3f2)`, 0);
						dbAccount.warningCount++
						dbAccount.save()
						break;
				}
			}
		}
	}

	if (config.deviceChecks.deviceCheck7.enabled
		&& packet.build_platform === 0
		|| packet.build_platform === 4
		|| packet.build_platform === 5
		|| packet.build_platform === 6
		|| packet.build_platform === 9
		|| packet.build_platform === 10
		|| packet.build_platform === 15
		|| packet.build_platform === 8) {
		console.log(`[${packet.xbox_user_id}] Unsupported device. [T7] (plrList)`);
		if (!config.debug) {
			switch (config.deviceChecks.deviceCheck7.punishment) {
				case "kick":
					client.sendCommand(`kick "${packet.xbox_user_id}" Invaild information sent. (0x3f7)`, 0);
					dbAccount.kickCount++
					dbAccount.save()
					break;
				case "ban":
					client.sendCommand(`kick "${packet.xbox_user_id}" Invaild information sent. (0x3f7)`, 0);
					dbAccount.banCount++
					dbAccount.isBanned = true
					dbAccount.save()
					break;
				case "clubKick":
					if (realm.isOwner) {
						realm.kick(packet.xbox_user_id);
						dbAccount.clubKickCount++
						dbAccount.save()
					}
					break;
				case "clubBan":
					if (realm.isOwner) {
						realm.ban(packet.xbox_user_id);
						dbAccount.clubBanCount++
						dbAccount.save()
					}
					break;
				case "warning":
					client.sendCommand(`say "${packet.xbox_user_id}" You sent invaild information. (0x3f7)`, 0);
					dbAccount.warningCount++
					dbAccount.save()
					break;
			}

		}
	}

	if (config.deviceChecks.deviceCheck8.enabled && packet.build_platform > 15 || packet.build_platform < 0) {
		console.log(`[${packet.xbox_user_id}] Bad Build Platform ID. [T8] (plrList)`);
		if (!config.debug) {
			switch (config.deviceChecks.deviceCheck8.punishment) {
				case "kick":
					client.sendCommand(`kick "${packet.xbox_user_id}" Invaild information sent. (0x3f8)`, 0);
					dbAccount.kickCount++
					dbAccount.save()
					break;
				case "ban":
					client.sendCommand(`kick "${packet.xbox_user_id}" Invaild information sent. (0x3f8)`, 0);
					dbAccount.banCount++
					dbAccount.isBanned = true
					dbAccount.save()
					break;
				case "clubKick":
					if (realm.isOwner) {
						realm.kick(packet.xbox_user_id);
						dbAccount.clubKickCount++
						dbAccount.save()
					}
					break;
				case "clubBan":
					if (realm.isOwner) {
						realm.ban(packet.xbox_user_id);
						dbAccount.clubBanCount++
						dbAccount.save()
					}
					break;
				case "warning":
					client.sendCommand(`say "${packet.xbox_user_id}" You sent invaild information. (0x3f8)`, 0);
					dbAccount.warningCount++
					dbAccount.save()
					break;
			}

		}
	}

	if (config.deviceChecks.deviceCheck9.enabled) {
		const profile = await getXboxUserData(packet.xbox_user_id);
		const titleHistory = await getTitleHistory(packet.xbox_user_id);

		const deviceNameToOsMap = {
			"Android": 1,
			"IOS": 2,
			"FireOS": 4,
			"Win10": 7,
			"Orbis": 11,
			"NintendoSwitch": 12,
			"Xbox": 13
		};

		const bannedDeviceOsNumbers = config.deviceChecks.deviceCheck9.bannedDevices.map(deviceName => deviceNameToOsMap[deviceName]);

		const bannedTitleIds = {
			12: "2047319603",
			11: "2044456598",
			2: "1810924247",
			1: "1739947436",
			13: "1828326430",
			7: "896928775",
			4: "1944307183"
		};

		const titleIdToBannedDeviceMap = {
			"2047319603": 12,
			"2044456598": 11,
			"1810924247": 2,
			"1739947436": 1,
			"1828326430": 13,
			"896928775": 7,
			"1944307183": 4
		};

		titleHistory.forEach(title => {
			bannedDeviceOsNumbers.some(bannedDevice => {
				if (title.titleId != bannedTitleIds[packet.build_platform]) return;

				if (title.titleId === bannedTitleIds[packet.build_platform] && bannedDevice === packet.build_platform) {
					console.log(`[${packet.xbox_user_id}] Device banned. (titleHistory) (plrList) [T9]`);
					if (!config.debug) {
						switch (config.deviceChecks.deviceCheck9.punishment) {
							case "kick":
								client.sendCommand(`kick "${packet.xbox_user_id}" Device banned. (0x3f9)`, 0);
								dbAccount.kickCount++
								dbAccount.save()
								break;
							case "ban":
								client.sendCommand(`kick "${packet.xbox_user_id}" Device banned. (0x3f9)`, 0);
								dbAccount.banCount++
								dbAccount.isBanned = true
								dbAccount.save()
								break;
							case "clubKick":
								if (realm.isOwner) {
									realm.kick(packet.xbox_user_id);
									dbAccount.clubKickCount++
									dbAccount.save()
								}
								break;
							case "clubBan":
								if (realm.isOwner) {
									realm.ban(packet.xbox_user_id);
									dbAccount.clubBanCount++
									dbAccount.save()
								}
								break;
							case "warning":
								client.sendCommand(`say "${packet.xbox_user_id}" Device banned. (0x3f9)`, 0);
								dbAccount.warningCount++
								dbAccount.save()
								break;
						}
					}
				}
			});
		});

		profile.presenceDetails.forEach(detail => {
			if (!detail.PresenceText.includes('Minecraft')) return;

			if (titleIdToBannedDeviceMap[detail.TitleId] != packet.build_platform) {
				console.log(`[${packet.xbox_user_id}] Device banned. (spoofing) (presenceDetails) (plrList) [T9]`);
				if (!config.debug) {
					switch (config.deviceChecks.deviceCheck9.punishment) {
						case "kick":
							client.sendCommand(`kick "${packet.xbox_user_id}" Device banned. (0x3f9)`, 0);
							dbAccount.kickCount++
							dbAccount.save()
							break;
						case "ban":
							client.sendCommand(`kick "${packet.xbox_user_id}" Device banned. (0x3f9)`, 0);
							dbAccount.banCount++
							dbAccount.isBanned = true
							dbAccount.save()
							break;
						case "clubKick":
							if (realm.isOwner) {
								realm.kick(packet.xbox_user_id);
								dbAccount.clubKickCount++
								dbAccount.save()
							}
							break;
						case "clubBan":
							if (realm.isOwner) {
								realm.ban(packet.xbox_user_id);
								dbAccount.clubBanCount++
								dbAccount.save()
							}
							break;
						case "warning":
							client.sendCommand(`say "${packet.xbox_user_id}" Device banned. (0x3f9)`, 0);
							dbAccount.warningCount++
							dbAccount.save()
							break;
					}

				}
			}

			bannedDeviceOsNumbers.some(bannedDevice => {
				if (detail.TitleId === bannedTitleIds[packet.build_platform] && bannedDevice === packet.build_platform) {
					console.log(`[${packet.xbox_user_id}] Device banned. (presenceDetails) (plrList) [T9]`);
					if (!config.debug) {
						switch (config.deviceChecks.deviceCheck9.punishment) {
							case "kick":
								client.sendCommand(`kick "${packet.xbox_user_id}" Device banned. (0x3f9)`, 0);
								dbAccount.kickCount++
								dbAccount.save()
								break;
							case "ban":
								client.sendCommand(`kick "${packet.xbox_user_id}" Device banned. (0x3f9)`, 0);
								dbAccount.banCount++
								dbAccount.isBanned = true
								dbAccount.save()
								break;
							case "clubKick":
								if (realm.isOwner) {
									realm.kick(packet.xbox_user_id);
									dbAccount.clubKickCount++
									dbAccount.save()
								}
								break;
							case "clubBan":
								if (realm.isOwner) {
									realm.ban(packet.xbox_user_id);
									dbAccount.clubBanCount++
									dbAccount.save()
								}
								break;
							case "warning":
								client.sendCommand(`say "${packet.xbox_user_id}" Device banned. (0x3f9)`, 0);
								dbAccount.warningCount++
								dbAccount.save()
								break;
						}
					}
				}
			});
		})

		bannedDeviceOsNumbers.some(bannedDevice => {
			if (packet.build_platform != bannedDevice) return;

			if (packet.build_platform === bannedDevice) {
				console.log(`[${packet.xbox_user_id}] Device banned. (inGameDevice) (plrList) [T9]`);
				if (!config.debug) {
					switch (config.deviceChecks.deviceCheck9.punishment) {
						case "kick":
							client.sendCommand(`kick "${packet.xbox_user_id}" Device banned. (0x3f9)`, 0);
							dbAccount.kickCount++
							dbAccount.save()
							break;
						case "ban":
							client.sendCommand(`kick "${packet.xbox_user_id}" Device banned. (0x3f9)`, 0);
							dbAccount.banCount++
							dbAccount.isBanned = true
							dbAccount.save()
							break;
						case "clubKick":
							if (realm.isOwner) {
								realm.kick(packet.xbox_user_id);
								dbAccount.clubKickCount++
								dbAccount.save()
							}
							break;
						case "clubBan":
							if (realm.isOwner) {
								realm.ban(packet.xbox_user_id);
								dbAccount.clubBanCount++
								dbAccount.save()
							}
							break;
						case "warning":
							client.sendCommand(`say "${packet.xbox_user_id}" Device banned. (0x3f9)`, 0);
							dbAccount.warningCount++
							dbAccount.save()
							break;
					}
				}
			}
		})
	} else if (packetType === "playerAdd") {
		const {
			device_id,
			device_os
		} = packet;

		const accounts = await accountsModel.find({}).exec();

		accounts.forEach(dbAccount2 => {
			const linkedDeviceIds = dbAccount2.deviceIds;
			const gamertags = dbAccount2.gamertags;
			const lastGamertag = gamertags[gamertags.length - 1];

			if (linkedDeviceIds && Array.isArray(linkedDeviceIds)) {
				if (config.deviceChecks.deviceCheck3.enabled && linkedDeviceIds.length > config.deviceChecks.deviceCheck3.count && lastGamertag === packet.username) {
					console.log(`[${dbAccount.xuid}] Had too many Device IDs. [T3]`);
					if (!config.debug) {
						switch (config.deviceChecks.deviceCheck3.punishment) {
							case "kick":
								client.sendCommand(`kick "${dbAccount.xuid}" You had too many device IDs. (0xc1)`, 0);
								dbAccount.kickCount++
								dbAccount.save()
								break;
							case "ban":
								client.sendCommand(`kick "${dbAccount.xuid}" You had too many device IDs. (0xc1)`, 0);
								dbAccount.banCount++
								dbAccount.isBanned = true
								dbAccount.save()
								break;
							case "clubKick":
								if (realm.isOwner) {
									realm.kick(dbAccount.xuid);
									dbAccount.clubKickCount++
									dbAccount.save()
								}
								break;
							case "clubBan":
								if (realm.isOwner) {
									realm.ban(dbAccount.xuid);
									dbAccount.clubBanCount++
									dbAccount.save()
								}
								break;
							case "warning":
								client.sendCommand(`say "${dbAccount.xuid}" You had too many device IDs. (0xc1)`, 0);
								dbAccount.warningCount++
								dbAccount.save()
								break;
						}
					}
				}

				linkedDeviceIds.forEach(linkedDeviceId => {
					if (config.deviceChecks.deviceCheck4.enabled && linkedDeviceId === device_id) {
						if (lastGamertag === packet.username) return;

						console.log(`[${dbAccount.xuid}] Had a duplicate Device ID(s). Last account was: ${lastGamertag}. [T4]`);
						if (!config.debug) {
							switch (config.deviceChecks.deviceCheck4.punishment) {
								case "kick":
									client.sendCommand(`kick "${dbAccount.xuid}" You had a duplicate device ID. (0xc2)`, 0);
									dbAccount.kickCount++
									dbAccount.save()
									break;
								case "ban":
									client.sendCommand(`kick "${dbAccount.xuid}" You had a duplicate device ID. (0xc2)`, 0);
									dbAccount.banCount++
									dbAccount.isBanned = true
									dbAccount.save()
									break;
								case "clubKick":
									if (realm.isOwner) {
										realm.kick(dbAccount.xuid);
										dbAccount.clubKickCount++
										dbAccount.save()
									}
									break;
								case "clubBan":
									if (realm.isOwner) {
										realm.ban(dbAccount.xuid);
										dbAccount.clubBanCount++
										dbAccount.save()
									}
									break;
								case "warning":
									client.sendCommand(`say "${dbAccount.xuid}" You had a duplicate device ID. (0xc2)`, 0);
									dbAccount.warningCount++
									dbAccount.save()
									break;
							}

						}
					}
				});
			}
		});

		if (config.deviceChecks.deviceCheck5.enabled && dbAccount.deviceOs.length > config.deviceChecks.deviceCheck5.count) {
			console.log(`[${dbAccount.xuid}] Had too many device types in the database. [T5]`);
			if (!config.debug) {
				switch (config.deviceChecks.deviceCheck5.punishment) {
					case "kick":
						client.sendCommand(`kick "${dbAccount.xuid}" You had too many device types. (0xc3)`, 0);
						dbAccount.kickCount++
						dbAccount.save()
						break;
					case "ban":
						client.sendCommand(`kick "${dbAccount.xuid}" You had too many device types. (0xc3)`, 0);
						dbAccount.banCount++
						dbAccount.isBanned = true
						dbAccount.save()
						break;
					case "clubKick":
						if (realm.isOwner) {
							realm.kick(dbAccount.xuid);
							dbAccount.clubKickCount++
							dbAccount.save()
						}
						break;
					case "clubBan":
						if (realm.isOwner) {
							realm.ban(dbAccount.xuid);
							dbAccount.clubBanCount++
							dbAccount.save()
						}
						break;
					case "warning":
						client.sendCommand(`say "${dbAccount.xuid}" You had too many device types. (0xc3)`, 0);
						dbAccount.warningCount++
						dbAccount.save()
						break;
				}
			}
		}

		switch (device_os) {
			case "Xbox":
				if (config.deviceChecks.deviceCheck6.enabled && !device_id.endsWith("=")) {
					console.log(`[${dbAccount.xuid}] User on Xbox without the right Device ID. [T6]`);
					if (!config.debug) {
						switch (config.deviceChecks.deviceCheck6.punishment) {
							case "kick":
								client.sendCommand(`kick "${dbAccount.xuid}" Invalid ID. (0xc4)`, 0);
								dbAccount.kickCount++
								dbAccount.save()
								break;
							case "ban":
								client.sendCommand(`kick "${dbAccount.xuid}" Invalid ID. (0xc4)`, 0);
								dbAccount.banCount++
								dbAccount.isBanned = true
								dbAccount.save()
								break;
							case "clubKick":
								if (realm.isOwner) {
									realm.kick(dbAccount.xuid);
									dbAccount.clubKickCount++
									dbAccount.save()
								}
								break;
							case "clubBan":
								if (realm.isOwner) {
									realm.ban(dbAccount.xuid);
									dbAccount.clubBanCount++
									dbAccount.save()
								}
								break;
							case "warning":
								client.sendCommand(`say "${dbAccount.xuid}" Invalid ID. (0xc4)`, 0);
								dbAccount.warningCount++
								dbAccount.save()
								break;
						}
					}
				}

				break;
			case "FireOS":
			case "Android":
				if (config.deviceChecks.deviceCheck6.enabled && !isUUIDv4WithoutDashes(device_id)) {
					console.log(`[${dbAccount.xuid}] User on ${device_os} without the right Device ID. [T6]`);
					if (!config.debug) {
						switch (config.deviceChecks.deviceCheck6.punishment) {
							case "kick":
								client.sendCommand(`kick "${dbAccount.xuid}" Invalid ID. (0xc4)`, 0);
								dbAccount.kickCount++
								dbAccount.save()
								break;
							case "ban":
								client.sendCommand(`kick "${dbAccount.xuid}" Invalid ID. (0xc4)`, 0);
								dbAccount.banCount++
								dbAccount.isBanned = true
								dbAccount.save()
								break;
							case "clubKick":
								if (realm.isOwner) {
									realm.kick(dbAccount.xuid);
									dbAccount.clubKickCount++
									dbAccount.save()
								}
								break;
							case "clubBan":
								if (realm.isOwner) {
									realm.ban(dbAccount.xuid);
									dbAccount.clubBanCount++
									dbAccount.save()
								}
								break;
							case "warning":
								client.sendCommand(`say "${dbAccount.xuid}" Invalid ID. (0xc4)`, 0);
								dbAccount.warningCount++
								dbAccount.save()
								break;
						}
					}
				}

				break;
			case "IOS":
				if (config.deviceChecks.deviceCheck6.enabled && !isUUIDv4WithoutDashes(device_id) && /^[A-Z0-9]{32}$/.test(device_id)) {
					console.log(`[${dbAccount.xuid}] User on iOS without the right Device ID. [T6]`);
					if (!config.debug) {
						switch (config.deviceChecks.deviceCheck6.punishment) {
							case "kick":
								client.sendCommand(`kick "${dbAccount.xuid}" Invalid ID. (0xc4)`, 0);
								dbAccount.kickCount++
								dbAccount.save()
								break;
							case "ban":
								client.sendCommand(`kick "${dbAccount.xuid}" Invalid ID. (0xc4)`, 0);
								dbAccount.banCount++
								dbAccount.isBanned = true
								dbAccount.save()
								break;
							case "clubKick":
								if (realm.isOwner) {
									realm.kick(dbAccount.xuid);
									dbAccount.clubKickCount++
									dbAccount.save()
								}
								break;
							case "clubBan":
								if (realm.isOwner) {
									realm.ban(dbAccount.xuid);
									dbAccount.clubBanCount++
									dbAccount.save()
								}
								break;
							case "warning":
								client.sendCommand(`say "${dbAccount.xuid}" Invalid ID. (0xc4)`, 0);
								dbAccount.warningCount++
								dbAccount.save()
								break;
						}
					}
				}

				break;
			case "Orbis":
			case "Win10":
			case "Win32":
				if (config.deviceChecks.deviceCheck2.enabled && !isValidPlatformChatId(packet.platform_chat_id) && device_os === "Orbis") {
					console.log(`[${dbAccount.xuid}] Invaild Platform Chat ID. [T2]`);
					if (!config.debug) {
						switch (config.deviceChecks.deviceCheck2.punishment) {
							case "kick":
								client.sendCommand(`kick "${dbAccount.xuid}" Invaild Platform Chat ID. (0xc5)`, 0);
								dbAccount.kickCount++
								dbAccount.save()
								break;
							case "ban":
								client.sendCommand(`kick "${dbAccount.xuid}" Invaild Platform Chat ID. (0xc5)`, 0);
								dbAccount.banCount++
								dbAccount.isBanned = true
								dbAccount.save()
								break;
							case "clubKick":
								if (realm.isOwner) {
									realm.kick(dbAccount.xuid);
									dbAccount.clubKickCount++
									dbAccount.save()
								}
								break;
							case "clubBan":
								if (realm.isOwner) {
									realm.ban(dbAccount.xuid);
									dbAccount.clubBanCount++
									dbAccount.save()
								}
								break;
							case "warning":
								client.sendCommand(`say "${dbAccount.xuid}" Invaild Platform Chat ID. (0xc5)`, 0);
								dbAccount.warningCount++
								dbAccount.save()
								break;
						}
					}
				}

				if (config.deviceChecks.deviceCheck6.enabled && !isUUIDv3(device_id)) {
					console.log(`[${dbAccount.xuid}] User on ${device_os} with the wrong Device ID. [T6]`);
					if (!config.debug) {
						switch (config.deviceChecks.deviceCheck6.punishment) {
							case "kick":
								client.sendCommand(`kick "${dbAccount.xuid}" Invalid ID. (0xc4)`, 0);
								dbAccount.kickCount++
								dbAccount.save()
								break;
							case "ban":
								client.sendCommand(`kick "${dbAccount.xuid}" Invalid ID. (0xc4)`, 0);
								dbAccount.banCount++
								dbAccount.isBanned = true
								dbAccount.save()
								break;
							case "clubKick":
								if (realm.isOwner) {
									realm.kick(dbAccount.xuid);
									dbAccount.clubKickCount++
									dbAccount.save()
								}
								break;
							case "clubBan":
								if (realm.isOwner) {
									realm.ban(dbAccount.xuid);
									dbAccount.clubBanCount++
									dbAccount.save()
								}
								break;
							case "warning":
								client.sendCommand(`say "${dbAccount.xuid}" Invalid ID. (0xc4)`, 0);
								dbAccount.warningCount++
								dbAccount.save()
								break;
						}
					}
				}

				break;
			case "NintendoSwitch":
				if (config.deviceChecks.deviceCheck6.enabled && !isUUIDv5(device_id)) {
					console.log(`[${dbAccount.xuid}] User on Nintendo Switch with the wrong Device ID. [T6]`);
					if (!config.debug) {
						switch (config.deviceChecks.deviceCheck6.punishment) {
							case "kick":
								client.sendCommand(`kick "${dbAccount.xuid}" Invalid ID. (0xc4)`, 0);
								dbAccount.kickCount++
								dbAccount.save()
								break;
							case "ban":
								client.sendCommand(`kick "${dbAccount.xuid}" Invalid ID. (0xc4)`, 0);
								dbAccount.banCount++
								dbAccount.isBanned = true
								dbAccount.save()
								break;
							case "clubKick":
								if (realm.isOwner) {
									realm.kick(dbAccount.xuid);
									dbAccount.clubKickCount++
									dbAccount.save()
								}
								break;
							case "clubBan":
								if (realm.isOwner) {
									realm.ban(dbAccount.xuid);
									dbAccount.clubBanCount++
									dbAccount.save()
								}
								break;
							case "warning":
								client.sendCommand(`say "${dbAccount.xuid}" Invalid ID. (0xc4)`, 0);
								dbAccount.warningCount++
								dbAccount.save()
								break;
						}
					}
				}

				if (config.deviceChecks.deviceCheck2.enabled && !isValidPlatformChatId(packet.platform_chat_id)) {
					console.log(`[${dbAccount.xuid}] Invaild Platform Chat ID. [T2]`);
					if (!config.debug) {
						switch (config.deviceChecks.deviceCheck2.punishment) {
							case "kick":
								client.sendCommand(`kick "${dbAccount.xuid}" Invaild Platform Chat ID. (0xc5)`, 0);
								dbAccount.kickCount++
								dbAccount.save()
								break;
							case "ban":
								client.sendCommand(`kick "${dbAccount.xuid}" Invaild Platform Chat ID. (0xc5)`, 0);
								dbAccount.banCount++
								dbAccount.isBanned = true
								dbAccount.save()
								break;
							case "clubKick":
								if (realm.isOwner) {
									realm.kick(dbAccount.xuid);
									dbAccount.clubKickCount++
									dbAccount.save()
								}
								break;
							case "clubBan":
								if (realm.isOwner) {
									realm.ban(dbAccount.xuid);
									dbAccount.clubBanCount++
									dbAccount.save()
								}
								break;
							case "warning":
								client.sendCommand(`say "${dbAccount.xuid}" Invaild Platform Chat ID. (0xc5)`, 0);
								dbAccount.warningCount++
								dbAccount.save()
								break;
						}
					}
				}

				break;
		}

		if (config.deviceChecks.deviceCheck7.enabled
			&& device_os === "Linux"
			|| device_os === "WindowsPhone"
			|| device_os === "TVOS"
			|| device_os === "Dedicated"
			|| device_os === "Hololens"
			|| device_os === "GearVR"
			|| device_os === "OSX"
			|| device_os === "Undefined"
			|| device_os === "Win32") {
			console.log(`[${dbAccount.xuid}] Unsupported device. [T7] (addPlr)`);
			if (!config.debug) {
				switch (config.deviceChecks.deviceCheck7.punishment) {
					case "kick":
						client.sendCommand(`kick "${dbAccount.xuid}" Invaild information sent. (0xc7)`, 0);
						dbAccount.kickCount++
						dbAccount.save()
						break;
					case "ban":
						client.sendCommand(`kick "${dbAccount.xuid}" Invaild information sent. (0xc7)`, 0);
						dbAccount.banCount++
						dbAccount.isBanned = true
						dbAccount.save()
						break;
					case "clubKick":
						if (realm.isOwner) {
							realm.kick(dbAccount.xuid);
							dbAccount.clubKickCount++
							dbAccount.save()
						}
						break;
					case "clubBan":
						if (realm.isOwner) {
							realm.ban(dbAccount.xuid);
							dbAccount.clubBanCount++
							dbAccount.save()
						}
						break;
					case "warning":
						client.sendCommand(`say "${dbAccount.xuid}" Invaild information sent. (0xc7)`, 0);
						dbAccount.warningCount++
						dbAccount.save()
						break;
				}
			}
		}

		if (config.deviceChecks.deviceCheck1.enabled && device_os != 'NintendoSwitch' || device_os != 'Orbis' && packet.platform_chat_id.length != 0) {
			console.log(`[${dbAccount.xuid}] Not on NintendoSwitch & has Platform Chat ID. [T1]`);
			if (!config.debug) {
				switch (config.deviceChecks.deviceCheck1.punishment) {
					case "kick":
						client.sendCommand(`kick "${dbAccount.xuid}" Invaild information sent. (0x3f1)`, 0);
						dbAccount.kickCount++
						dbAccount.save()
						break;
					case "ban":
						client.sendCommand(`kick "${dbAccount.xuid}" Invaild information sent. (0x3f1)`, 0);
						dbAccount.banCount++
						dbAccount.isBanned = true
						dbAccount.save()
						break;
					case "clubKick":
						if (realm.isOwner) {
							realm.kick(dbAccount.xuid);
							dbAccount.clubKickCount++
							dbAccount.save()
						}
						break;
					case "clubBan":
						if (realm.isOwner) {
							realm.ban(dbAccount.xuid);
							dbAccount.clubBanCount++
							dbAccount.save()
						}
						break;
					case "warning":
						client.sendCommand(`say "${dbAccount.xuid}" Invaild information sent. (0x3f1)`, 0);
						dbAccount.warningCount++
						dbAccount.save()
						break;
				}
			}
		}

		if (config.deviceChecks.deviceCheck8.enabled && /^\d+$/.test(device_os)) {
			console.log(`[${dbAccount.xuid}] Unsupported device. [T8]`);
			if (!config.debug) {
			switch (config.deviceChecks.deviceCheck8.punishment) {
				case "kick":
					client.sendCommand(`kick "${dbAccount.xuid}" Invaild information sent. (0xc8)`, 0);
					dbAccount.kickCount++
					dbAccount.save()
					break;
				case "ban":
					client.sendCommand(`kick "${dbAccount.xuid}" Invaild information sent. (0xc8)`, 0);
					dbAccount.banCount++
					dbAccount.isBanned = true
					dbAccount.save()
					break;
				case "clubKick":
					if (realm.isOwner) {
						realm.kick(dbAccount.xuid);
						dbAccount.clubKickCount++
						dbAccount.save()
					}
					break;
				case "clubBan":
					if (realm.isOwner) {
						realm.ban(dbAccount.xuid);
						dbAccount.clubBanCount++
						dbAccount.save()
					}
					break;
				case "warning":
					client.sendCommand(`say "${dbAccount.xuid}" Invaild information sent. (0xc8)`, 0);
					dbAccount.warningCount++
					dbAccount.save()
					break;
				}
			}
		}

		if (config.deviceChecks.deviceCheck9.enabled) {
			const profile = await getXboxUserData(dbAccount.xuid);
			const titleHistory = await getTitleHistory(dbAccount.xuid);

			const bannedDevices = config.deviceChecks.deviceCheck9.bannedDevices;

			const bannedTitleIds = {
				"NintendoSwitch": "2047319603",
				"Orbis": "2044456598",
				"IOS": "1810924247",
				"Android": "1739947436",
				"Xbox": "1828326430",
				"Win10": "896928775",
				"FireOS": "1944307183"
			};

			const titleIdToBannedDeviceMap = {
				"2047319603": "NintendoSwitch",
				"2044456598": "Orbis",
				"1810924247": "IOS",
				"1739947436": "Android",
				"1828326430": "Xbox",
				"896928775": "Win10",
				"1944307183": "FireOS"
			}

			titleHistory.forEach(title => {
				bannedDevices.some(bannedDevice => {
					if (title.titleId != bannedTitleIds[device_os]) return;

					if (title.titleId === bannedTitleIds[device_os] && bannedDevice === device_os) {
						console.log(`[${dbAccount.xuid}] Device banned. (titleHistory) (plrAdd) [T9]`);
						if (!config.debug) {
							switch (config.deviceChecks.deviceCheck9.punishment) {
								case "kick":
									client.sendCommand(`kick "${dbAccount.xuid}" Device banned. (0xc9)`, 0);
									dbAccount.kickCount++
									dbAccount.save()
									break;
								case "ban":
									client.sendCommand(`kick "${dbAccount.xuid}" Device banned. (0xc9)`, 0);
									dbAccount.banCount++
									dbAccount.isBanned = true
									dbAccount.save()
									break;
								case "clubKick":
									if (realm.isOwner) {
										realm.kick(dbAccount.xuid);
										dbAccount.clubKickCount++
										dbAccount.save()
									}
									break;
								case "clubBan":
									if (realm.isOwner) {
										realm.ban(dbAccount.xuid);
										dbAccount.clubBanCount++
										dbAccount.save()
									}
									break;
								case "warning":
									client.sendCommand(`say "${dbAccount.xuid}" Device banned. (0xc9)`, 0);
									dbAccount.warningCount++
									dbAccount.save()
									break;
							}
						}
					}
				});
			});

			profile.presenceDetails.forEach(detail => {
				if (!detail.PresenceText.includes('Minecraft')) return;

				if (titleIdToBannedDeviceMap[detail.TitleId] != device_os) {
					console.log(`[${dbAccount.xuid}] Device banned. (spoofing) (presenceDetails) (plrAdd) [T9]`);
					if (!config.debug) {
						switch (config.deviceChecks.deviceCheck9.punishment) {
							case "kick":
								client.sendCommand(`kick "${dbAccount.xuid}" Device banned. (0xc9)`, 0);
								dbAccount.kickCount++
								dbAccount.save()
								break
							case "ban":
								client.sendCommand(`kick "${dbAccount.xuid}" Device banned. (0xc9)`, 0);
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
								client.sendCommand(`say "${dbAccount.xuid}" Device banned. (0xc9)`, 0);
								dbAccount.warningCount++
								dbAccount.save()
								break
						}
					}
				}

				bannedDevices.some(bannedDevice => {
					if (detail.TitleId === bannedTitleIds[device_os] && bannedDevice === device_os) {
						console.log(`[${dbAccount.xuid}] Device banned. (presenceDetails) (plrAdd) [T9]`);
						if (!config.debug) {
							switch (config.deviceChecks.deviceCheck9.punishment) {
								case "kick":
									client.sendCommand(`kick "${dbAccount.xuid}" Device banned. (0xc9)`, 0);
									dbAccount.kickCount++
									dbAccount.save()
									break
								case "ban":
									client.sendCommand(`kick "${dbAccount.xuid}" Device banned. (0xc9)`, 0);
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
									client.sendCommand(`say "${dbAccount.xuid}" Device banned. (0xc9)`, 0);
									dbAccount.warningCount++
									dbAccount.save()
									break
							}

						}
					}
				})
			})

			bannedDevices.some(bannedDevice => {
				if (device_os != bannedDevice) return;

				if (device_os === bannedDevice) {
					console.log(`[${dbAccount.xuid}] Device banned. (inGameDevice) (plrAdd) [T9]`);
					if (!config.debug) {
						switch (config.deviceChecks.deviceCheck9.punishment) {
							case "kick":
								client.sendCommand(`kick "${dbAccount.xuid}" Device banned. (0xc9)`, 0);
								dbAccount.kickCount++
								dbAccount.save()
								break;
							case "ban":
								client.sendCommand(`kick "${dbAccount.xuid}" Device banned. (0xc9)`, 0);
								dbAccount.banCount++
								dbAccount.isBanned = true
								dbAccount.save()
								break;
							case "clubKick":
								if (realm.isOwner) {
									realm.kick(dbAccount.xuid);
									dbAccount.clubKickCount++
									dbAccount.save()
								}
								break;
							case "clubBan":
								if (realm.isOwner) {
									realm.ban(dbAccount.xuid);
									dbAccount.clubBanCount++
									dbAccount.save()
								}
								break;
							case "warning":
								client.sendCommand(`say "${dbAccount.xuid}" Device banned. (0xc9)`, 0);
								dbAccount.warningCount++
								dbAccount.save()
								break;
						}
					}
				}
			})
		}
	} else {
		console.log(`Packet type: ${packetType} is not vaild. Failed to do any checks.`);
	}
}

module.exports = {
	deviceVaildate
};