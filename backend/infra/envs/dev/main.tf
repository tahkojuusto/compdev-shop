terraform {
  required_version = "~> 0.12.28"
  required_providers {
    aws = "~> 2.70.0"
  }
  backend "s3" {
    bucket         = "cs-dev-tf-backend"
    key            = "terraform-dev.tfstate"
    dynamodb_table = "cs-dev-tf-backend-table"
    region         = "eu-west-1"
  }
}

locals {
  app_name = "cs"
  env      = "dev"
  region   = "eu-west-1"
}

provider "aws" {
  region = local.region
}

module "network" {
  source   = "../../modules/network"
  app_name = local.app_name
  env      = local.env
  availability_zones = [
    "${local.region}a",
    "${local.region}b"
  ]
  vpc_cidr_block = "10.0.0.0/16"
  public_subnet_cidr_blocks = [
    "10.0.0.0/24",
    "10.0.1.0/24"
  ]
  private_subnet_cidr_blocks = [
    "10.0.2.0/24",
    "10.0.3.0/24"
  ]
}

module "alb" {
  source            = "../../modules/alb"
  app_name          = local.app_name
  env               = local.env
  subnet_ids        = module.network.public_subnet_ids
  vpc_id            = module.network.vpc_id
  health_check_path = "/"
}

module "ecs" {
  source                 = "../../modules/ecs"
  app_name               = local.app_name
  env                    = local.env
  ec2_ami_id             = "ami-0bb01c7d2705a4800"
  ec2_instance_type      = "t3.nano"
  min_ec2_count          = 1
  max_ec2_count          = 1
  subnet_ids             = module.network.private_subnet_ids
  alb_sg_id              = module.alb.alb_sg_id
  bastion_sg_id          = module.bastion.bastion_sg_id
  cpu_auto_scaling_limit = 70
  vpc_id                 = module.network.vpc_id
  alb_target_group_arn   = module.alb.alb_target_group_arn
  ecs_public_key         = var.ecs_public_key
}

module "bastion" {
  source              = "../../modules/bastion"
  app_name            = local.app_name
  env                 = local.env
  ec2_ami_id          = "ami-0a74b2559fb675b98"
  ec2_instance_type   = "t3.nano"
  subnet_id           = module.network.public_subnet_ids[0]
  vpc_id              = module.network.vpc_id
  allowed_cidr_blocks = var.allowed_bastion_cidr_blocks
  bastion_public_key  = var.bastion_public_key
}
