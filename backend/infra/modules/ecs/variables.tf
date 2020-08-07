variable "app_name" {}
variable "env" {}
variable "ec2_ami_id" {}
variable "ec2_instance_type" {}
variable "min_ec2_count" {}
variable "max_ec2_count" {}
variable "subnet_ids" {
  type = list
}
variable "cpu_auto_scaling_limit" {}
variable "vpc_id" {}
variable "alb_sg_id" {}
variable "bastion_sg_id" {}
variable "alb_target_group_arn" {}
variable "ecs_public_key" {}
