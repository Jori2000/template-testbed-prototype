import fs from "fs/promises";
import { exec } from "child_process"
import { settings } from "cluster";

export class PackerManager {
    constructor() {

    }

    setup = (config: any): Promise<any> => {
        return new Promise(async (resolve, reject) => {


            //read file names
            let packerFiles = [];
            console.log("now this:")
            let packerFolders = await fs.readdir("./src/Packer");
            if (!packerFolders) {
                //throw error
            }
            // get single files in folder
            for (let folder of packerFolders) {
                console.log(folder)
                let filesInFolder = await fs.readdir(`./src/Packer/${folder}`);
                for (let file of filesInFolder) {

                    packerFiles.push(`${folder}/${file}`)
                }
            }
            console.log(packerFiles)
            // sort out the files that are not relevant (variables/preseed)
            let definitonFiles = [];
            for (let filename of packerFiles) {
                if (filename.includes("json")) {
                    if (!filename.includes("/variables.json")) {
                        definitonFiles.push(filename)
                    }
                }
            }
            if (!definitonFiles) {
                //Throw error because no config files are given/ is empty
            }

            // Get packer varaiables
            // We might have multiple files, so I should iterate through our config file and find the matching files
            console.log("getting packerconfig...")
            let packerConfig = config;
            for (let folder of packerFolders) {
                for (let isoConfig of packerConfig) {
                    console.log(isoConfig)
                    if (isoConfig["vm-name"].includes(folder)) {
                        fs.writeFile(`./src/packer/${folder}/variables.json`, JSON.stringify(packerConfig))
                    }
                }
            }
            console.log("validating packer files...")
            for (let definitonFile of definitonFiles) {
                console.log("->" + definitonFile)
                await this.validate(definitonFile);
            }

            console.log("building template...")
            let templates = [];
            for (let definitonFile of definitonFiles) {
                console.log("->" + definitonFile)
                templates.push(await this.build(definitonFile));
            }
            resolve(templates)


        })

    }

    validate = (definitonFile: any): Promise<void> => {
        return new Promise(async (resolve, reject) => {
            exec(`packer validate ./src/packer/${definitonFile}`, (error, stdout, stderr) => {

                // Set new variables.json if there is an error -> corrected file
                if (error !== null) {
                    console.log('exec error1: ' + error);
                } else {
                    if (stdout.length == 0) {
                        console.log(definitonFile + "✅")
                    } else {
                        // TODO CORRECT FILE!!!

                        console.log('stdout: ' + stdout.length)
                        console.log('stderr: ' + stderr);
                    }
                    resolve()
                }
            });
        });
    }

    build = (definitonFile: any): Promise<void> => {
        return new Promise(async (resolve, reject) => {
            exec(`packer build ./src/packer/${definitonFile}`, (error, stdout, stderr) => {
                console.log('stdout: ' + stdout);
                // Set new variables.json if there is an error -> corrected file
                console.log('stderr: ' + stderr);
                if (error !== null) {
                    if (stdout.includes("already exists,")) {
                        resolve();
                    } else {
                        console.log('exec error: ' + error);
                        reject(error);
                    }

                } else {
                    resolve();
                }
            });
        });
    }
}