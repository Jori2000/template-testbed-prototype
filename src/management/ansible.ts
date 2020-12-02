import fs from "fs/promises";
import { exec } from "child_process"
import { settings } from "cluster";

export class AnsibleManager {
    constructor() {

    }

    setup = (config: any): Promise<any> => {
        return new Promise(async (resolve, reject) => {
            resolve(true)
        });
    }
}