import fs from "fs/promises";
import { exec } from "child_process"
import { settings } from "cluster";
import { PackerManager } from "./packer"
import { TerraformManager } from "./terraform"

export class Manager {
    constructor() {

    }

    setup = (config: any): Promise<any> => {
        return new Promise(async (resolve, reject) => {




            config = JSON.parse(config)
            console.log(config.settings.singleFile)
            let templates = [];
            if (config.settings.singleFile) {
                //split input file into several definition files (packer, terraform, ansible)
                // Support for multiple files!

                // let tfDef = fileToRead.split("TF Part")[1];
                // let packerDef = fileToRead.split("Packer Part")[1];
                // let ansibleDef = fileToRead.split("Ansible Part")[1];

            } else {

                // Es muss einen Weg geben Packer zu deaktivieren, falls man nur mit TF und Ansible arbeiten möchte
                
                let packer = new PackerManager();
                templates = await packer.setup(config.packer).catch((err) =>{
                    console.log(err)
                    console.log("Check you Packer Definition file and try again")
                } );

            }

            //read config file
            let credentials = config.vsphere;

            //create variables.json for packer



            //get

            // wait for build to end
            /**
             * nun ist die Frage, der Nutzer definiert ohnehin die Packer File, also kennt er die Namen der Templates. Soll das Weiterleiten der Templatenamen automatisch passieren?
             * 
             */
            // get path for the templates
            // Finde ich hoffentlich jetzt gleich raus

            // run Terraform 
            let terraform = new TerraformManager();
            terraform.setup(config.terraform, templates);


            resolve(true);
        })

    }

}