/**
 * @author Luuxis
 * @license CC-BY-NC 4.0 - https://creativecommons.org/licenses/by-nc/4.0/
 */

let console_log = console.log;
let console_info = console.info;
let console_warn = console.warn;
let console_debug = console.debug;
let console_error = console.error;

const os = require('os');
const path = require('path');

class logger {
    constructor(name, color) {
        this.Logger(name, color)
    }

    async Logger(name, color) {
        console.log = (value) => {
            console_log.call(console, `%c[${name}]:`, `color: ${color};`, value);
            this.showLogsInConsole(name, value, color);
        };

        console.info = (value) => {
            console_info.call(console, `%c[${name}]:`, `color: ${color};`, value);
            this.showLogsInConsole(name, value, color);
        };

        console.warn = (value) => {
            console_warn.call(console, `%c[${name}]:`, `color: ${color};`, value);
            this.showLogsInConsole(name, value, color);
        };

        console.debug = (value) => {
            console_debug.call(console, `%c[${name}]:`, `color: ${color};`, value);
            this.showLogsInConsole(name, value, color);
        };

        console.error = (value) => {
            console_error.call(console, `%c[${name}]:`, `color: ${color};`, value);
            this.showLogsInConsole(name, value, color);
        };
    }

    async showLogsInConsole(source, log, color) {
        if(typeof log !== 'string') {
            log = JSON.stringify(log, null, 2);
        }

        for(const censoredWord in this.getCensoredStrings()) {
            if(log.includes(censoredWord)) {
                return;
            }
        }

        log = this.sanitizeLog(log);

        const time = new Date();

        const formattedDate = `${this.reformateInteger(time.getDate())}/${this.reformateInteger(time.getMonth())}/${time.getFullYear()} ${this.reformateInteger(time.getHours())}:${this.reformateInteger(time.getMinutes())}:${this.reformateInteger(time.getSeconds())}`

        const element = document.createElement('div');
        const console = document.querySelector('.console');

        if(console === null) return;

        element.style.color = `#${color}`;
        element.textContent = `[${formattedDate}][${source}] ${log}`;

        console.appendChild(element);
        console.scrollTop = console.scrollHeight;
    }

    sanitizeLog(log) {
        if(typeof log !== 'string') return log;

        const userHome = os.homedir();
        const normalizedHome = path.normalize(userHome).replace(/\\/g, '/');

        const regex = new RegExp(normalizedHome.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');

        const normalizedLog = log.replace(/\\/g, '/');
        return normalizedLog.replace(regex, '[Home]/');
    }

    reformateInteger(int) {
        return int > 9 ? `${int}` : `0${int}`;
    }

    getCensoredStrings() {
        return [
            'token',
            'Token',
            'authentification',
        ];
    }
}

export default logger;