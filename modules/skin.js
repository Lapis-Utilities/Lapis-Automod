function skinVaildate(packet, dbAccount, client, packetType) {
	if (packetType === "playerList") {
		if (!packet.skin_data.skin_id.includes(packet.skin_data.play_fab_id)) {
			console.log(`[${packet.xbox_user_id}] Bad skin information [T1]`);
			client.sendCommand(`kick "${packet.xbox_user_id}" Invaild skin information sent.\nThis could be because\n- You haven't connected to PlayFab API correctly.\n- You are using classic skin (Change skin)\nTry relaunching Minecraft to fix this. [T1]`, 0)
		}

		if (packet.skin_data.full_skin_id != packet.skin_data.skin_id) {
			console.log(`[${packet.xbox_user_id}] Full Skin ID & Skin ID do not match. [T2]`);
			client.sendCommand(`kick "${packet.xbox_user_id}" Invaild skin information sent. [T2]`, 0)
		}

		if (packet.skin_data.skin_data.width > 512 || packet.skin_data.skin_data.width < 64) {
			console.log(`[${packet.xbox_user_id}] Bad skin information [T3]`);
			client.sendCommand(`kick "${packet.xbox_user_id}" Invaild skin information sent. [T3]`, 0)
		}

		if (packet.skin_data.skin_data.height > 512 || packet.skin_data.skin_data.height < 64) {
			console.log(`[${packet.xbox_user_id}] Bad skin information [T4]`);
			client.sendCommand(`kick "${packet.xbox_user_id}" Invaild skin information sent. [T4]`, 0)
		}

		if (!packet.skin_data.skin_resource_pack.includes(packet.skin_data.play_fab_id)) {
			console.log(`[${packet.xbox_user_id}] Bad skin information [T5]`);
			client.sendCommand(`kick "${packet.xbox_user_id}" Invaild skin information sent.\nThis could be because\n- You haven't connected to PlayFab API correctly.\n- You are using classic skin (Change skin)\nTry relaunching Minecraft to fix this. [T5]`, 0)
		}

		if (packet.skin_data.play_fab_id > 16 || packet.skin_data.play_fab_id < 16) {
			console.log(`[${packet.xbox_user_id}] Bad skin information [T6]`);
			client.sendCommand(`kick "${packet.xbox_user_id}" Invaild skin information sent. [T6]`, 0)
		}

		if (packet.skin_data.premium === true && packet.skin_data.skin_resource_pack.includes('"default" : "geometry.n3"\n') || packet.skin_data.skin_id.includes('#')) {
			console.log(`[${packet.xbox_user_id}] Bad skin information [T9]`);
			client.sendCommand(`kick "${packet.xbox_user_id}" Invaild skin information sent.\nThis could be because you are using a custom skin.\nTry changing to steve. [T9]`, 0)
		}

		if (packet.skin_data.personal_pieces.length < 4) {
			console.log(`[${packet.xbox_user_id}] Bad skin information [T10]`);
			client.sendCommand(`kick "${packet.xbox_user_id}" Invaild skin information sent.\nThis could be because\n- You haven't connected to PlayFab API correctly.\n- You are using classic skin (Change skin)\nTry relaunching Minecraft to fix this. [T10]`, 0)
		}

		if (!packet.skin_data.skin_resource_pack.includes(packet.skin_data.play_fab_id) ||
			!packet.skin_data.skin_id.includes(packet.skin_data.play_fab_id) ||
			!packet.skin_data.full_skin_id.includes(packet.skin_data.play_fab_id) ||
			!packet.skin_data.geometry_data.includes(packet.skin_data.play_fab_id)) {
			console.log(`[${packet.xbox_user_id}] Bad skin information [T11]`);
			client.sendCommand(`kick "${packet.xbox_user_id}" Invaild skin information sent.\nThis could be because\n- You haven't connected to PlayFab API correctly.\n- You are using classic skin (Change skin)\nTry relaunching Minecraft to fix this. [T11]`, 0);
		}

		if (packet.skin_data.geometry_data_version.length < 5 || packet.skin_data.geometry_data_version.length > 6) {
			console.log(`[${packet.xbox_user_id}] Bad skin information [T12]`);
			client.sendCommand(`kick "${packet.xbox_user_id}" Invaild skin information sent. [T12]`, 0)
		}

		if (packet.skin_data.skin_resource_pack.includes(' "default" : "geometry.humanoid"\n')) {
			console.log(`[${packet.xbox_user_id}] Bad skin information [T13]`);
			client.sendCommand(`kick "${packet.xbox_user_id}" Invaild skin information sent.\nThis could be becuase\nYou are wearing a corrupt skin or invisible skin.\nTry changing skins to fix this. [T13] `, 0)
		}
	} else if (packetType === "playerSkin") {
		if (!packet.skin.skin_id.includes(packet.skin.play_fab_id)) {
			console.log(`[${dbAccount.xuid}] Bad skin information [T1]`);
			client.sendCommand(`kick "${dbAccount.xuid}" Invaild skin information sent.\nThis could be because\n- You are using classic skin (Change skin)\nTry relaunching Minecraft to fix this. [T1]`, 0)
		}

		if (packet.skin.full_skin_id != packet.skin.skin_id) {
			console.log(`[${dbAccount.xuid}] Full Skin ID & Skin ID do not match. [T2]`);
			client.sendCommand(`kick "${dbAccount.xuid}" Invaild skin information sent. [T2]`, 0)
		}

		if (packet.skin.skin_data.width > 512 || packet.skin.skin_data.width < 64) {
			console.log(`[${dbAccount.xuid}] Bad skin information [T3]`);
			client.sendCommand(`kick "${dbAccount.xuid}" Invaild skin information sent. [T3]`, 0)
		}

		if (packet.skin.skin_data.height > 512 || packet.skin.skin_data.height < 64) {
			console.log(`[${dbAccount.xuid}] Bad skin information [T4]`);
			client.sendCommand(`kick "${dbAccount.xuid}" Invaild skin information sent. [T4]`, 0)
		}

		if (!packet.skin.skin_resource_pack.includes(packet.skin.play_fab_id)) {
			console.log(`[${dbAccount.xuid}] Bad skin information [T5]`);
			client.sendCommand(`kick "${dbAccount.xuid}" Invaild skin information sent.\nThis could be because\n- You are using classic skin (Change skin)\nTry relaunching Minecraft to fix this. [T5]`, 0)
		}

		if (packet.skin.play_fab_id > 16 || packet.skin.play_fab_id < 16) {
			console.log(`[${dbAccount.xuid}] Bad skin information [T6]`);
			client.sendCommand(`kick "${dbAccount.xuid}" Invaild skin information sent.\nThis could be because you are using classic skin. (Change skin) [T6]`, 0)
		}

		if (packet.skin.premium === true && packet.skin.skin_resource_pack.includes('"default" : "geometry.n3"\n') || packet.skin.skin_id.includes('#')) {
			console.log(`[${dbAccount.xuid}] Bad skin information [T7]`);
			client.sendCommand(`kick "${dbAccount.xuid}" Invaild skin information sent.\nThis could be because you are using a custom skin.\nTry changing to steve. [T7]`, 0)
		}

		if (packet.skin.personal_pieces.length < 4) {
			console.log(`[${dbAccount.xuid}] Bad skin information [T8]`);
			client.sendCommand(`kick "${dbAccount.xuid}" Invaild skin information sent.\nThis could be because you are using classic skin. (Change skin) [T8]`, 0)
		}

		if (!packet.skin.skin_resource_pack.includes(packet.skin.play_fab_id) || !packet.skin.skin_id.includes(packet.skin.play_fab_id) || !packet.skin.full_skin_id.includes(packet.skin.play_fab_id) || !packet.skin.geometry_data.includes(packet.skin.play_fab_id)) {
			console.log(`[${dbAccount.xuid}] Bad skin information [T9]`);
			client.sendCommand(`kick "${dbAccount.xuid}" Invaild skin information sent.\nThis could be because\n- You are using classic skin (Change skin)\nTry relaunching Minecraft to fix this. [T9]`, 0);
		}

		if (packet.skin.skin_resource_pack.includes(' "default" : "geometry.humanoid"\n')) {
			console.log(`[${dbAccount.xuid}] Bad skin information [T10]`);
			client.sendCommand(`kick "${dbAccount.xuid}" Invaild skin information sent.\nThis could be becuase\nYou are wearing a corrupt skin or invisible skin.\nTry changing skins to fix this. [T10] `, 0)
		}
	} else {
		console.log(`Packet type: ${packetType} is not vaild. Failed to do any checks.`);
	}
}

module.exports = {
	skinVaildate: skinVaildate
};