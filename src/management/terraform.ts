import fs from "fs/promises";
import { exec } from "child_process"
import { settings } from "cluster";
import { PackerManager } from "./packer"

export class TerraformManager {
    constructor() {

    }

    setup = (config: any, templates:any): Promise<any> => {
        return new Promise(async (resolve, reject) => {

            let terraformConfig = config;
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
            fs.writeFile(`./src/terraform/terraform.tfvars.json`, JSON.stringify(terraformConfig))

            // Terraform init
            console.log("Initialize Terraform")
            await this.init();

            // Terraform plan
            console.log("Plan Terraform")
            await this.plan()

            /**
             * TODO
             * make an output.tf or build something that makes this work
             * 
             * In Konfig kann man eventuell einfach festlegen, welche Variablen zusätzlich zur IP ausgegeben werden.
             * Erzeugen der Der Output.TF auf Basis der Eingaben
             * 
             */
            
            // Terraform apply
            console.log("Apply Terraform")
            await this.apply()

            resolve(true);
        })
    }

    init = () =>{
        return new Promise(async (resolve, reject) => {
            exec(`terraform init`, {cwd: 'src/terraform'}, (error, stdout, stderr) => {
                // Set new variables.json if there is an error -> corrected file
                if (error !== null) {
                    console.log('exec error: ' + error);
                    reject();
                } else {
                    if(stdout == ""){
                        console.log( "✅")
                    }
                    console.log('stdout: ' + stdout)
                    console.log('stderr: ' + stderr);
                    resolve(true);
                }
            });
        })
    }

    plan = () =>{
        return new Promise(async (resolve, reject) => {
            exec(`terraform plan`, {cwd: 'src/terraform'}, (error, stdout, stderr) => {
                // Set new variables.json if there is an error -> corrected file
                if (error !== null) {
                    console.log('exec error: ' + error);
                    reject();
                } else {
                    if(stdout == ""){
                        console.log( "✅")
                    }
                    console.log('stdout: ' + stdout)
                    console.log('stderr: ' + stderr);
                    resolve(true);
                }
            });
        })
    }

    apply = () =>{
        return new Promise(async (resolve, reject) => {
            exec(`terraform apply -auto-approve`, {cwd: 'src/terraform'}, (error, stdout, stderr) => {
                // Set new variables.json if there is an error -> corrected file
                if (error !== null) {
                    console.log('exec error: ' + error);
                    reject();
                } else {
                    if(stdout == ""){
                        console.log( "✅")
                    }
                    console.log('stdout: ' + stdout)
                    console.log('stderr: ' + stderr);
                    resolve(true);
                }
            });
        })
    }
    /**
     * Destroy Infrastructure
     */
    destroy = () =>{
        return new Promise(async (resolve, reject) => {
            exec(`terraform destroy -auto-approve`, {cwd: 'src/terraform'}, (error, stdout, stderr) => {
                // Set new variables.json if there is an error -> corrected file
                if (error !== null) {
                    console.log('exec error: ' + error);
                    reject();
                } else {
                    if(stdout == ""){
                        console.log( "✅")
                    }
                    console.log('stdout: ' + stdout)
                    console.log('stderr: ' + stderr);
                    resolve(true);
                }
            });
        })
    }
    /**
     * Get IP Address the TF way
     */
    getIp = () =>{
        return new Promise(async (resolve, reject) => {
            exec(`terraform output ip`, {cwd: 'src/terraform'}, (error, stdout, stderr) => {
                // Set new variables.json if there is an error -> corrected file
                if (error !== null) {
                    console.log('exec error: ' + error);
                    reject();
                } else {
                    if(stdout == ""){
                        console.log( "✅")
                    }
                    console.log('stdout: ' + stdout)
                    console.log('stderr: ' + stderr);
                    resolve(true);
                }
            });
        })
    }
}