terraform {
  required_version = "~> 0.12.28"
  required_providers {
    aws = "~> 2.7.0"
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
