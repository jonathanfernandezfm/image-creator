const request = require("request");
const fetch = require("node-fetch");
const URL = "https://eu.battle.net/oauth/token?grant_type=client_credentials";
const API_URL = "https://eu.api.blizzard.com/data/wow/";
const NAMESPACE = "static-eu";
const LOCALE = "es_ES";

class wowAPI {
	constructor(client, client_secret) {
		this.client = client;
		this.client_secret = client_secret;
		this.getOAuthToken();
	}

	async getOAuthToken() {
		const headers = {
			Authorization:
				"Basic " + Buffer.from(`${this.client}:${this.client_secret}`).toString("base64"),
		};

		let response = await fetch(URL, { method: "GET", headers: headers });
		let json = await response.json();

		this.access_token = json.access_token;
		this.expiration = json.expires_in;
	}

	async getAchievement(id) {
    console.log(`${API_URL}/achievement/${id}?namespace=${NAMESPACE}&locale=${LOCALE}&access_token=${this.access_token}`)
		let response = await fetch(
			`${API_URL}/achievement/${id}?namespace=${NAMESPACE}&locale=${LOCALE}&access_token=${this.access_token}`,
			{ method: "GET" }
    );
    
    let json = await response.json();

    return json;
  }

	async getAchievementMedia(id) {
		let response = await fetch(
			`${API_URL}media/achievement/${id}?namespace=${NAMESPACE}&locale=${LOCALE}&access_token=${this.access_token}`,
			{ method: "GET" }
    );
    
    let json = await response.json();

    return json;
  }
}

module.exports = wowAPI;
