const fetch = require("node-fetch");
const { getPlayFabToken } = require("./xbox.js");

const apiUrl = "https://20ca2.playfabapi.com";
const sdkVersion = "XPlatCppSdk-3.6.190304";

const api_headers = {
	"Accept": "application/json",
	"content-type": "application/json; charset=utf-8",
	"User-Agent": "libhttpclient/1.0.0.0",
	"x-playfabsdk": sdkVersion,
	"x-reporterrorassuccess": true,
	"Accept-Language": "en-US",
	"Accept-Encoding": "gzip, deflate, br",
	"Host": "20ca2.playfabapi.com",
	"Connection": "Keep-Alive",
	"Cache-Control": "no-cache"
};

async function loginWithXbox() {
	const authToken = await getPlayFabToken();
	if (authToken.errorMsg) return authToken;

	const body = JSON.stringify({
		CreateAccount: true,
		EncryptedRequest: null,
		InfoRequestParameters: {
			GetCharacterInventories: false,
			GetCharacterList: false,
			GetPlayerProfile: true,
			GetPlayerStatistics: false,
			GetTitleData: false,
			GetUserAccountInfo: true,
			GetUserData: false,
			GetUserInventory: false,
			GetUserReadOnlyData: false,
			GetUserVirtualCurrency: false,
			PlayerStatisticNames: null,
			ProfileConstraints: null,
			TitleDataKeys: null,
			UserDataKey: null,
			UserReadOnlyDataKeys: null
		},
		PlayerSecret: null,
		TitleId: "20CA2",
		XboxToken: `XBL3.0 x=${authToken.userHash};${authToken.XSTSToken}`
	}, null, 2);

	const response = await fetch(`${apiUrl}/Client/LoginWithXbox?sdk=${sdkVersion}`, {
		method: "POST",
		headers: {
			...api_headers,

			"Content-Length": body.length
		},
		body: body
	});

	const data = await response.json();

	if (data.status !== "OK") return { errorMsg: `[loginWithXbox] ${data.code} ${data.status}. Error: ${data.errorMessage}` };

	return data.data;
}

async function getAccountInfo(playFabId) {
	if (!playFabId) return;

	const authData = await loginWithXbox();
	if (authData.errorMsg) return authData;

	const body = JSON.stringify({
		PlayFabId: playFabId
	}, null, 2);

	const response = await fetch(`${apiUrl}/Client/GetAccountInfo`, {
		method: "POST",
		headers: {
			...api_headers,

			"x-entitytoken": authData.EntityToken.EntityToken,
			"Content-Length": body.length
		},
		body: body
	});

	const data = await response.json();
	if (data.status !== "OK") return { errorMsg: `${data.code} ${data.status}. Error: ${data.errorMessage}` };

	return data.data;
}

async function getPlayerProfile(playFabId) {
	if (!playFabId) return;

	const authData = await loginWithXbox();
	if (authData.errorMsg) return authData;

	const body = JSON.stringify({
		PlayFabId: playFabId
	}, null, 2);

	const response = await fetch(`${apiUrl}/Client/GetPlayerProfile`, {
		method: "POST",
		headers: {
			...api_headers,

			"x-entitytoken": authData.EntityToken.EntityToken,
			"Content-Length": body.length
		},
		body: body
	});

	const data = await response.json();
	if (data.status !== "OK") return { errorMsg: `${data.code} ${data.status}. Error: ${data.errorMessage}` };

	return data.data;
}

async function getPlayerCombinedInfo(playFabId) {
	if (!playFabId) return;

	const authData = await loginWithXbox();
	if (authData.errorMsg) return authData;

	const body = JSON.stringify({
        InfoRequestParameters: {
			GetCharacterInventories: true,
			GetCharacterList: true,
			GetPlayerProfile: true,
			GetPlayerStatistics: true,
			GetTitleData: true,
			GetUserAccountInfo: true,
			GetUserData: true,
			GetUserInventory: true,
			GetUserReadOnlyData: true,
			GetUserVirtualCurrency: true,
			PlayerStatisticNames: null,
			ProfileConstraints: null,
			TitleDataKeys: null,
			UserDataKey: null,
			UserReadOnlyDataKeys: null
		},
		PlayFabId: playFabId
	}, null, 2);

	const response = await fetch(`${apiUrl}/Client/GetPlayerCombinedInfo`, {
		method: "POST",
		headers: {
			...api_headers,

			"x-entitytoken": authData.EntityToken.EntityToken,
			"Content-Length": body.length
		},
		body: body
	});

	const data = await response.json();
	if (data.status !== "OK") return { errorMsg: `${data.code} ${data.status}. Error: ${data.errorMessage}` };

	return data.data;
}

async function getUserPlayFabId(xuid) {
	if (!xuid) return;
	
	const authData = await loginWithXbox();
	if (authData.errorMsg) return authData;

	const body = JSON.stringify({
		XboxLiveAccountIds: [xuid][0],
        SANDBOX: "RETAIL"
	}, null);

	const response = await fetch(`${apiUrl}/Client/GetPlayFabIDsFromXboxLiveIDs`, {
		method: "POST",
		headers: {
			...api_headers,

			"x-entitytoken": authData.EntityToken.EntityToken,
			"Content-Length": body.length
		},
		body: body
	});

	const data = await response.json();

	if (data.status !== "OK") return { errorMsg: `${data.code} ${data.status}. Error: ${data.errorMessage}` };

	return data.data;
}

module.exports = {
    getAccountInfo,
    getUserPlayFabId,
    getPlayerProfile,
    getPlayerCombinedInfo
}