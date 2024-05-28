import { Eta } from "eta";
import path from "path";
import { exec } from "child_process";
import { $, FileSystemRouter } from "bun";

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

let userId = "f8f4b2b7-b016-418b-b80b-c36630badc64";

const sessions: Record<string, Record<string, unknown>> = {};

const previewFolder = `${import.meta.dir}/preview/${userId}/`;

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
        
        const upgradeSuccess = server.upgrade(req);
        if (upgradeSuccess) return new Response(undefined);

        const headers = new Headers();
        headers.set("Content-Type", "text/html");
        headers.set("set-cookie", `sessionId=${sessionId};SameSite=Strict`);
        
        if (path.startsWith("/preview")) {
            let requestedFile: string = "never defined";
            if (requestedFile == "never defined") requestedFile = url.toString().split("/").pop() ?? "split failed";
            if (requestedFile == ``) requestedFile = "index.html";

            console.log(requestedFile);

            const file = Bun.file(`${previewFolder}${requestedFile}`);
            
            if (await file.exists()) {
                return new Response(await file.text(), {
                    headers: {
                        'content-type': file.type
                    }
                });
            }else {
                return new Response("404", { status: 404 });
            }
        }

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

        }

        switch (path) {
            case "/": {
                // let index = await Bun.file(`${import.meta.dir}/routes/index.html`).text();
                return new Response(await eta.renderAsync("index.eta", { userId }), {headers});
                // return new Response(index, {
                //     headers
                // });
            }
        }
        return new Response("Bink bonk");
    },
    websocket: {
        async message(ws, message) {
            let data: { user: string, fileContents: string[] } = JSON.parse(message as string);

            const user: string = data.user;
            const fileContents: string[] = data.fileContents;

            const typescript = fileContents.join("\n");

            await Bun.write(`${import.meta.dir}/preview/${user}/script.ts`, typescript);
            exec(`tsc ${import.meta.dir}/preview/${user}/script.ts --outfile ${import.meta.dir}/preview/${user}/script.js`);
            console.log("Ran compile")
            //TODO: Wait for compile to finish.
            ws.send(JSON.stringify({reload: true}))
        }
    }
})

console.log("Server running on http://localhost:3200");