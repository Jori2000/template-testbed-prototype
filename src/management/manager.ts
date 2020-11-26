import fs from "fs/promises";
import { exec } from "child_process"
import { settings } from "cluster";

export class Manager {
    constructor() {

    }

    setup = (config: any): Promise<any> => {
        return new Promise(async (resolve, reject) => {
            config = JSON.parse(config)
            console.log(config.settings.singleFile)
            if (config.settings.singleFile) {
                //split input file into several definition files (packer, terraform, ansible)
                // Support for multiple files!

                // let tfDef = fileToRead.split("TF Part")[1];
                // let packerDef = fileToRead.split("Packer Part")[1];
                // let ansibleDef = fileToRead.split("Ansible Part")[1];

            } else {
                //read file names
                let packerFiles = [];
                console.log("now this:")
                let packerFolders = await fs.readdir("./src/Packer");
                if(!packerFolders){
                    //throw error
                }
                // get single files in folder
                for(let folder of packerFolders){
                    console.log(folder)
                    let filesInFolder = await fs.readdir(`./src/Packer/${folder}`);
                    for(let file of filesInFolder){

                        packerFiles.push(`${folder}/${file}`)
                    }
                }
                console.log(packerFiles)
                // sort out the files that are not relevant (variables/preseed)
                let definitonFiles = [];
                for(let filename of packerFiles){
                    if(filename.includes("json")){
                        if(!filename.includes("/variables.json")){
                            definitonFiles.push(filename)
                        }
                    }
                }
                if(!definitonFiles){
                    //Throw error because no config files are given/ is empty
                }

                // Get packer varaiables
                // We might have multiple files, so I should iterate through our config file and find the matching files
                let packerConfig = config.packer;
                for(let folder of packerFolders){
                    for(let isoConfig of packerConfig){
                        console.log(isoConfig)
                        if(isoConfig["vm-name"].includes(folder)){
                            fs.writeFile(`./src/packer/${folder}/variables.json`, JSON.stringify(packerConfig))
                        }
                    }
                }
                exec(`packer validate ./src/packer/${definitonFiles}`, (error, stdout, stderr) => {
                    console.log('stdout: ' + stdout);
                    // Set new variables.json if there is an error -> corrected file
                    console.log('stderr: ' + stderr); 
                    if (error !== null) {
                         console.log('exec error: ' + error);
                    }
                });
                exec(`packer build ./src/packer/${definitonFiles}`, (error, stdout, stderr) => {
                    console.log('stdout: ' + stdout);
                    // Set new variables.json if there is an error -> corrected file
                    console.log('stderr: ' + stderr);
                    if (error !== null) {
                         console.log('exec error: ' + error);
                    }
                });
                let tfFiles = [];
                let ansibleFiles = [];

            }

            //read config file
            let credentials = config.vsphere;

            //create variables.json for packer



            //get

            //run packer
            // exec("packer validate ")
            // let output = runConsole("cmd packer verify packerDef");
            // let building;

            // if (output.error) {
            //     let fix = runConsole("cmd packer fix packerDef");
            //     if (fix.error) {
            //         console.log("Error in your Packer Configuration: ", fix.error)
            //     } else {

            //         packerDef = fix;
            //         building = runConsole("cmd packer build packerDef");

            //     }
            // } else {
            //     building = runConsole("cmd packer build packerDef");
            // }

            // wait for build to end
            /**
             * nun ist die Frage, der Nutzer definiert ohnehin die Packer File, also kennt er die Namen der Templates. Soll das Weiterleiten der Templatenamen automatisch passieren?
             * 
             */
            // get path for the templates
            // Finde ich hoffentlich jetzt gleich raus

            // run Terraform 
            resolve(true);
        })

    }

}