variable "app_name" {}
variable "env" {}
variable "subnet_ids" {
  type = list
}
variable "vpc_id" {}
variable "health_check_path" {}
