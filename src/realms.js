const { getRealmToken, getXboxLiveToken } = require("./xbox.js");

const realmHeaders = {
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

async function main(realm) {
    if (!realm) return 'Not specified.';

    const realmToken = await getRealmToken();

    if (!realmToken) return 'Failed to get realm auth token';

    realmHeaders.authorization = `XBL3.0 x=${realmToken.userHash};${realmToken.XSTSToken}`;

    const xboxToken = await getXboxLiveToken();

    if (!xboxToken) return 'Failed to get xbox auth token';

    if (realm.ownerUUID === xboxToken.userXUID) {
        realm.isOwner = true;
        realm.ban = async (xuid) => { 
            await realmBan(realm, xuid);
        }

        realm.kick = async (xuid) => { 
            await realmKick(realm, xuid);
        }

        realm.changeCode = async () => {
            await realmChangeCode(realm);
        }

        realm.backup = async () => {
            await realmBackup(realm);
        }

        realm.close = async () => {
            await realmClose(realm);
        }

        realm.open = async () => {
            await realmOpen(realm);
        }
    } else {
        return 'Not owner';
    }
};

async function realmBan(realm, xuid) {
    if (!realm) return 'Not specified.';

    const ban = await fetch(`https://pocket.realms.minecraft.net/worlds/${realm.id}/blocklist/${xuid}`, {
        method: "POST",
        headers: realmHeaders
    });

    return ban.status;
}

async function realmKick(realm, xuid) {
    if (!realm) return 'Not specified.';

    const kick = await fetch(`https://pocket.realms.minecraft.net/invites/${realm.id}/invite/update`, {
        method: "PUT",
        headers: realmHeaders,
        body: JSON.stringify({
            invites: {[xuid]: "REMOVE"}
        }) 
    });

    return kick.status;
}

async function realmChangeCode(realm) {
    if (!realm) return 'Not specified.';

    const code = await fetch(`https://pocket.realms.minecraft.net/links/v1`, {
        method: "POST",
        headers: realmHeaders,
        body: JSON.stringify({
            type: "INFINITE", 
            worldId: realm.id
        }) 
    });

    const json = await code.json();

    return json;
}

async function realmBackup(realm) {
    if (!realm) return 'Not specified.';

    const backupGet = await fetch(`https://pocket.realms.minecraft.net/worlds/${realm.id}/backups`, {
        method: "GET",
        headers: realmHeaders
    });

    const jsonGet = await backupGet.json();
    const backupId = jsonGet.backups.reduce((prev, curr) => prev.backupId > curr.backupId ? prev : curr).backupId;

    if (typeof backupId != "string") return 'No backupId found.';

    for (let i = 0; i < 2; i++) {
        const backupPut = await fetch(`https://pocket.realms.minecraft.net/worlds/${realm.id}/backups?backupId=${backupId}&clientSupportsRetries`, {
            method: "PUT",
            headers: realmHeaders
        });

        // 503 means good for some reason, 204 sometimes happens also...
        // also this is the reason why we loop it
        if (backupPut.status === 503 || backupPut.status === 204) {
            return 'success';
        }
    }
}

async function realmClose(realm) {
    if (!realm) return 'Not specified.';

    const close = await fetch(`https://pocket.realms.minecraft.net/worlds/${realm.id}/close`, {
        method: "PUT",
        headers: realmHeaders
    });

    const json = await close.json();

    if (typeof json === "boolean" && json) return 'success'; 
}

async function realmOpen(realm) {
    if (!realm) return 'Not specified.';

    const open = await fetch(`https://pocket.realms.minecraft.net/worlds/${realm.id}/open`, {
        method: "PUT",
        headers: realmHeaders
    });

    const json = await open.json();

    if (typeof json === "boolean" && json) return 'success'; 
}

module.exports = { main };