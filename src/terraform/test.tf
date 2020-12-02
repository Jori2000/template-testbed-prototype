## Configure the vSphere Provider
provider "vsphere" {
  vsphere_server       = var.vsphere_server
  user                 = var.vsphere_user
  password             = var.vsphere_password
  version              = "1.15"
  allow_unverified_ssl = true
}

## Build VM
data "vsphere_datacenter" "dc" {
  name = "datacenter1"
}

data "vsphere_datastore" "datastore" {
  name          = "datastore1"
  datacenter_id = data.vsphere_datacenter.dc.id
}
data "vsphere_compute_cluster" "cluster" {
  name          = "cluster-1"
  datacenter_id = data.vsphere_datacenter.dc.id
}

data "vsphere_network" "mgmt_lan" {
  name          = "VM Network"
  datacenter_id = data.vsphere_datacenter.dc.id
}

data "vsphere_virtual_machine" "template" {
  name          = "Ubuntu-1804-Template1"
  datacenter_id = data.vsphere_datacenter.dc.id
}
data "vsphere_resource_pool" "pool" {
  name          = "cluster-1/Resources/"
  datacenter_id = data.vsphere_datacenter.dc.id
}

resource "vsphere_virtual_machine" "cloned_virtual_machine" {
  name             = "cloned_virtual_machine"
  resource_pool_id = data.vsphere_compute_cluster.cluster.resource_pool_id
  datastore_id     = data.vsphere_datastore.datastore.id

  num_cpus                   = 1
  memory                     = 1024
  wait_for_guest_net_timeout = 0
  guest_id                   = "ubuntu64Guest"
  nested_hv_enabled          = true
  network_interface {
    network_id   = data.vsphere_network.mgmt_lan.id
    adapter_type = "vmxnet3"
  }

  disk {
    size             = data.vsphere_virtual_machine.template.disks.0.size
    label            = "cloned_virtual_machine.vmdk"
    eagerly_scrub    = false
    thin_provisioned = true
  }

  clone {
    template_uuid = data.vsphere_virtual_machine.template.id
  }
}


resource "local_file" "hosts_yml" {
  content = templatefile("${path.module}/templates/hosts.tpl",
    {
      jori_test = vsphere_virtual_machine.cloned_virtual_machine.*.name
    }
  )
  filename = "${path.module}/ansible/hosts.yml"
}
