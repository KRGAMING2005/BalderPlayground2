import { Eta } from "eta";
import path from "path";

interface Cookies {
    [key: string]: string;
}

function parseCookies(cookieString: string): Cookies {
    return cookieString.split(';').reduce((cookies: any, cookie: any) => {
      const [name, value] = cookie.split('=').map((c: string) => c.trim());
      cookies[name] = value;
      return cookies;
    }, {});
}

const eta = new Eta({views: path.join(import.meta.dir, "/routes")});

const sessions: Record<string, Record<string, unknown>> = {};

Bun.serve({
    port: 3200,
    async fetch(req: Request, server): Promise<Response> {
        const url = new URL(req.url);
        const path = url.pathname;
        
        let cookies: Cookies = {};

        if (req.headers.get('cookie')) {
            cookies = parseCookies(req.headers.get('cookie')!);
        }

        const sessionId: string = cookies["sessionId"] ?? self.crypto.randomUUID();

        if (!sessions[sessionId]) sessions[sessionId] = {};

        const session = sessions[sessionId];

        const headers = new Headers();
        headers.set("Content-Type", "text/html");
        headers.set("set-cookie", `sessionId=${sessionId}`);
        
        console.log({sessionId})

        const upgradeSuccess = server.upgrade(req);
        if (upgradeSuccess) return new Response(undefined);

        if (path.startsWith("/script")) {
            const fileName = url.toString().split("/").pop();
            const script = Bun.file(`${import.meta.dir}/static/js/${fileName}`);
            return new Response(script, {
                headers: {
                    'Content-Type': 'application/javascript'
                }
            });
        } else if (path.startsWith("/style")) {
            const fileName = url.toString().split("/").pop();
            const style = Bun.file(`${import.meta.dir}/static/css/${fileName}`);
            return new Response(style, {
                headers: {
                    'Content-Type': 'text/css'
                }
            });

        } else if (path.startsWith("/preview")) {
            let page = await Bun.file(`${import.meta.dir}/preview/index.html`).text();
            return new Response(page, {
                headers
            });
        }

        switch (path) {
            case "/": {
                // let index = await Bun.file(`${import.meta.dir}/routes/index.html`).text();
                return new Response(await eta.renderAsync("index.eta", {}), {headers});
                // return new Response(index, {
                //     headers
                // });
            }
        }
        return new Response("Bink bonk");
    },
    websocket: {
        async message(ws, message) {
            console.log(`Message: ${message}`);
            ws.send("Pong: " + message)
        }
    }
})

console.log("Server running on http://localhost:3200");