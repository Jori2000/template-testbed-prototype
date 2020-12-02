# template-testbed-prototype




# how to run
- Set hosts.INI in ansible.cfg as inventory standard



to run:
npm start
oder run start

# todo
Example for folder structure,
then gitignore files in folders



"
provider "vsphere" {
  # If you use a domain set your login like this "MyDomain\\MyUser"
  user           = "intra\\username"
  password       = "secret"
  vsphere_server = "my-little-vcenter-or-esxi-dnsname"

  # if you have a self-signed cert
  allow_unverified_ssl = true
}
"