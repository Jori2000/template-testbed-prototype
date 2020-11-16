
//read input file
let fileToRead = "This is the file we should check"

//split input file into several definition files (packer, terraform, ansible)
let tfDef = fileToRead.split("TF Part")[1];
let packerDef = fileToRead.split("Packer Part")[1];
let ansibleDef = fileToRead.split("Ansible Part")[1];

//run packer

let output = runConsole("cmd packer verify packerDef");
let building;

if (output.error){
    let fix = runConsole("cmd packer fix packerDef");
    if(fix.error){
        console.log("Error in your Packer Configuration: ", fix.error)
    } else {

        packerDef = fix;
        building = runConsole("cmd packer build packerDef");

    }
} else {
    building = runConsole("cmd packer build packerDef");
}
/**
 * cmd packer verify packerDef
 * cmd packer build packerDef
 */