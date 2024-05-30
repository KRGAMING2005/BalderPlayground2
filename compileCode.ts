import { isMainThread, workerData, parentPort } from "worker_threads";

async function compileCode(userId: string, code: string) {
    
}

if (!isMainThread) {
    parentPort!.once('message', async (idk: any) => {
        try {
            
        } catch (error) {
            //TODO: Throw error and tell why compile broke.
        }
    });
}