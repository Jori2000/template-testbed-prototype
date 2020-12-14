import fs from "fs/promises";
import { spawn, exec } from "child_process"
import { settings } from "cluster";
import { resolve } from "path";

export class AnsibleManager {
    constructor() {

    }

    setup = (config: any): Promise<any> => {
        return new Promise(async (resolve, reject) => {
            this.createInventory(config);

            this.runPlaybook();
            resolve(true)
        });
    }

    runPlaybook = (): Promise<any> => {
        return new Promise(async (resolve, reject) => {

            const child = spawn('ansible-playbook playbook2.yml --ask-become-pass');
            
            process.stdin.pipe(child.stdin)
            
            for await (const data of child.stdout) {
              console.log(`stdout from the child: ${data}`);
            };
            
            // ansible-playbook sampleplaybook.yml -i ansible_hosts
            // Muss Python installiert sein? Falls ja dringend in die Doku schreiben!
            resolve(true)
        });
    }

    createInventory = (config: any): Promise<void> => {
        return new Promise(async (resolve, reject) => {
            // ALSO ADD THE USERNAME PROVIDED?!?!?!!? is that even possible?
            if (config.onePassForAll) {
                // Ask User if he wants to store combination?!

                //>yes
                const inventory = JSON.parse(await fs.readFile("src/terraform/terraform.tfstate", "utf-8"));

                // EInfach Split machen mit "%%" und dann check if includes -USER doer -PASS
                let newInventory = inventory.split("%%")
                for(let line in newInventory){
                    if(line.includes("-USER")){
                        line.replace("-USER", "jori")
                    } else if(line.includes("-PASS")){
                        line.replace("-PASS", "jori")
                    }
                }
                fs.writeFile(newInventory.join(), "utf8");

                // Otherwise wait for User to type it in 

                // Use Vault


            } else {
                //iterate
                //if ansibleInstance.name = iterationName
                //credentials = credentials;
            }
            resolve();
        })
    }
}