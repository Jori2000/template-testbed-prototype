## Configure the vSphere Provider
provider "vsphere" {
  vsphere_server       = "${var.vsphere_server}"
  user                 = "${var.vsphere_user}"
  password             = "${var.vsphere_password}"
  version              = "1.15"
  allow_unverified_ssl = true
}

## Build VM
data "vsphere_datacenter" "dc" {
  name = "ha-datacenter"
}

data "vsphere_datastore" "datastore" {
  name          = "datastore1"
  datacenter_id = "${data.vsphere_datacenter.dc.id}"
}

data "vsphere_resource_pool" "pool" {}

data "vsphere_network" "mgmt_lan" {
  name          = "VM Network"
  datacenter_id = "${data.vsphere_datacenter.dc.id}"
}

resource "vsphere_virtual_machine" "test2" {
  name             = "test2"
  resource_pool_id = "${data.vsphere_resource_pool.pool.id}"
  datastore_id     = "${data.vsphere_datastore.datastore.id}"

  num_cpus                   = 1
  memory                     = 1024
  wait_for_guest_net_timeout = 0
  guest_id                   = "centos7_64Guest"
  nested_hv_enabled          = true
  network_interface {
    network_id   = "${data.vsphere_network.mgmt_lan.id}"
    adapter_type = "vmxnet3"
  }

  disk {
    size             = 16
    label            = "test2.vmdk"
    eagerly_scrub    = false
    thin_provisioned = true
  }


}

resource "vsphere_file" "ubuntu_disk_upload" {
  datacenter       = "ha-datacenter"
  datastore        = "datastore1"
  source_file      = "${path.module}/iso/CentOS-7-x86_64-DVD-2003.iso"
  destination_file = "/vmfs/volumes/5f81e5bb-20e6c01a-bd7c-000c29f80fea/iso/CentOS-7-x86_64-DVD-2003.iso"
}

resource "local_file" "hosts_cfg" {
  content = templatefile("${path.module}/templates/hosts.tpl",
    {
      jori_test = vsphere_virtual_machine.test2.*.name
    }
  )
  filename = "${path.module}/ansible/hosts.cfg"
}
