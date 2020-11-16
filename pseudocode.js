
//read input file
let fileToRead = "This is the file we should check"

//read config file
let credentials = "This is the file we should check"

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

// wait for build to end
/**
 * nun ist die Frage, der Nutzer definiert ohnehin die Packer File, also kennt er die Namen der Templates. Soll das Weiterleiten der Templatenamen automatisch passieren?
 * 
 */
// get path for the templates
// Finde ich hoffentlich jetzt gleich raus

// run Terraform 