import fs from "fs/promises";
import {Manager} from "./management/manager"

let start = async() =>{

        console.log("running")
        const manager = new Manager();
        //read input file
        let config;
        config = await fs.readFile("./config.json", "utf8");
        if(!config){
            //Throw error, no config is defined
        }
        let area = await fs.readdir("./")
        console.log(area)
        manager.setup(config);
}
start();



