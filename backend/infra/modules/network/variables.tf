variable "app_name" {}
variable "env" {}
variable "availability_zones" {}
variable "vpc_cidr_block" {}
variable "public_subnet_cidr_blocks" {
  type = list
}
variable "private_subnet_cidr_blocks" {
  type = list
}
