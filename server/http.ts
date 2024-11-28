import { ClientHttp2Session, connect } from 'http2';

export default class Session {
    host: string;
    connection: ClientHttp2Session;
    cookies: { [key: string]: string; } = {};

    constructor(host: string) {
        this.host = host;
        this.reconnect();
    }
    reconnect() {
        this.connection = connect(`https://${this.host}`);
        this.connection.on('goaway', () => {
            this.connection.close();
            this.reconnect();
        });
    }

    request(method: string, path: string, body?: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const req = this.connection.request({
                ':path': path,
                ':method': method,
                cookie: Object.entries(this.cookies).map(([key, value]) => `${key}=${value}`).join('; ')
            });
            let data = '';
            req.on('response', headers => {
                if ('set-cookie' in headers) {
                    for (const c of headers['set-cookie']) {
                        const cookie = c.split(';')[0];
                        const [key, value] = cookie.split('=');
                        this.cookies[key] = value;
                    }
                }
                if ('location' in headers) {
                    const location = new URL(headers['location'], `https://${this.host}`);
                    resolve(this.request(method, location.pathname + location.search + location.hash));
                }
                else {
                    req.on('data', chunk => data += chunk);
                    req.on('end', () => resolve(data));
                }
            });
            req.on('error', reject);
            if (body) req.write(body);
            req.end();
        });
    }

    get(path: string) {
        return this.request('GET', path);
    }
    post(path: string, body?: string) {
        return this.request('POST', path, body);
    }

    close() {
        this.connection.close();
    }
}