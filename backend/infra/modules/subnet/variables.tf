variable "app_name" {}
variable "env" {}
variable "prefix" {}
variable "availability_zones" {}
variable "vpc_id" {}
variable "vpc_cidr_block" {}
variable "subnet_cidr_blocks" {
  type = list
}
