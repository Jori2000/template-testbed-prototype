import fs from "fs/promises";
import { exec } from "child_process"
import { settings } from "cluster";

export class PackerManager {
    constructor() {

    }

    setup = (config: any): Promise<any> => {
        return new Promise(async (resolve, reject) => {
            config = JSON.parse(config)

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
            for(let definitonFile of definitonFiles){
                exec(`packer validate ./src/packer/${definitonFile}`, (error, stdout, stderr) => {
                    // Set new variables.json if there is an error -> corrected file
                    if (error !== null) {
                        console.log('exec error: ' + error);
                    } else {
                        if(stdout == ""){
                            console.log(definitonFile + "✅")
                        }
                        console.log('stdout: ' + stdout)
                        console.log('stderr: ' + stderr);
                    }
                });
            }

            console.log("building templates...")
            exec(`packer build ./src/packer/${definitonFiles}`, (error, stdout, stderr) => {
                console.log('stdout: ' + stdout);
                // Set new variables.json if there is an error -> corrected file
                console.log('stderr: ' + stderr);
                if (error !== null) {
                    
                    console.log('exec error: ' + error);
                    reject(error);
                } else {
                    resolve();
                }
            });


        })

    }
}