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
            await this.getIp();

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

                //Do not auto approve! -> ask user!

                // Set new variables.json if there is an error -> corrected file
                console.log('stdout: ' + stdout)
                console.log('stderr: ' + stderr);
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

            const inventory = JSON.parse(await fs.readFile("src/terraform/terraform.tfstate", "utf-8"));

            //copy out all names with respective ip addresses
            let instances = [];
            for(let resource of inventory.resources){
                if(resource.mode == "managed" && resource.type == "vsphere_virtual_machine"){
                    // We need the name/type/ip
                    let type = resource.name;
                    for(let singleInstance in resource.instances){
                        let instObj = JSON.parse(singleInstance);
                        let name = instObj.attributes.name;
                        let ip = instObj.attributes.default_ip_address
                        instances.push({type: type, name: name, ip: ip})
                    }
                }
            }

            //create new ansible inventory
            let ansibleInventory = "";
            let index = 0;
            let newGroup = true;
            for(let singleInstance of instances){
                if(index == 0 || newGroup){
                    ansibleInventory = `[${singleInstance.type}]
                    `;
                    newGroup = false;
                }
                index++;

                ansibleInventory = ansibleInventory + singleInstance.ip + `ansible_ssh_user=${singleInstance.name + "-USER"} ansible_ssh_pass=${singleInstance.name + "-PASS"}
                `;

                if(singleInstance.type != instances[index].type){
                    newGroup = true;
                }
            }
            fs.writeFile(ansibleInventory, "utf8");
            resolve();
        })
    }
}