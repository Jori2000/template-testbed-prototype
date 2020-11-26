import fs from "fs/promises";
import { exec } from "child_process"
import { settings } from "cluster";
import { PackerManager } from "./packer"

export class TerraformManager {
    constructor() {

    }

    setup = (config: any, templates:any): Promise<any> => {
        return new Promise(async (resolve, reject) => {

            // 
            //In Terraform Ordner gehen



            //read file names
            console.log("now this:")
            let terraformFiles = await fs.readdir("./src/terraform");
            if (!terraformFiles) {
                //throw error
            }

            console.log(terraformFiles)
            // sort out the files that are not relevant (variables/preseed)
            let definitonFiles = [];

            //Checken ob das so passt?
            for(let filename of terraformFiles){
                if (filename.includes("json")) {
                    if (!filename.includes("/variables.json")) {
                        definitonFiles.push(filename)
                    }
                }

            }
            
            if (!definitonFiles) {
                //Throw error because no config files are given/ is empty
            }

            // Variables.tf File erstellen

            // Terraform init
            exec(`terraform init ./src/terraform`, (error, stdout, stderr) => {
                // Set new variables.json if there is an error -> corrected file
                if (error !== null) {
                    console.log('exec error: ' + error);
                } else {
                    if(stdout == ""){
                        console.log( "✅")
                    }
                    console.log('stdout: ' + stdout)
                    console.log('stderr: ' + stderr);
                }
            });

            // Terraform plan
            exec(`terraform plan ./src/terraform`, (error, stdout, stderr) => {
                // Set new variables.json if there is an error -> corrected file
                if (error !== null) {
                    console.log('exec error: ' + error);
                } else {
                    if(stdout == ""){
                        console.log( "✅")
                    }
                    console.log('stdout: ' + stdout)
                    console.log('stderr: ' + stderr);
                }
            });

            // Terraform apply
            exec(`terraform apply ./src/terraform`, (error, stdout, stderr) => {
                // Set new variables.json if there is an error -> corrected file
                if (error !== null) {
                    console.log('exec error: ' + error);
                } else {
                    if(stdout == ""){
                        console.log( "✅")
                    }
                    console.log('stdout: ' + stdout)
                    console.log('stderr: ' + stderr);
                }
            });
        })
    }
}