/**
 * @license CC-BY-NC 4.0 - https://creativecommons.org/licenses/by-nc/4.0/
 */

const pkg = require('../package.json');
const fetch = require("node-fetch");
const convert = require("xml-js");

const settings_url = pkg.user ? `${pkg.settings}/${pkg.user}` : pkg.settings;

function getConfigUrl() {
    const baseUrl = settings_url.endsWith('/') ? settings_url : `${settings_url}/`;
    return pkg.env === 'azuriom' ? `${baseUrl}api/centralcorp/options` : `${baseUrl}utils/api`;
}

function getAzAuthUrl(config) {
    const baseUrl = settings_url.endsWith('/') ? settings_url : `${settings_url}/`;
    return pkg.env === 'azuriom' ? baseUrl : config.azauth.endsWith('/') ? config.azauth : `${config.azauth}/`;
}

class Config {
    async GetConfig() {
        try {
            const response = await fetch(getConfigUrl());
            return await response.json();
        } catch (error) {
            console.error("Failed to fetch config:", error);
            throw error;
        }
    }

    async GetNews() {
        try {
            this.config = await this.GetConfig();
            const newsUrl = new URL('/api/rss', getAzAuthUrl(this.config));

            const rss = await fetch(newsUrl).then(res => res.text());
            const rssParsed = JSON.parse(convert.xml2json(rss, { compact: true }));
            const items = rssParsed.rss.channel.item;

            if (!items) {
                return null;
            }

            return Array.isArray(items) ? items.map(this.parseNewsItem) : [this.parseNewsItem(items)];
        } catch (error) {
            console.error("Failed to fetch news:", error);
            throw error;
        }
    }

    parseNewsItem(item) {
        return {
            title: item.title._text,
            content: item['content:encoded']._text,
            author: item['dc:creator']._text,
            publish_date: item.pubDate._text,
            link: item.link._text,
            image: item.enclosure?._attributes?.url || null
        };
    }
}

export default new Config();
