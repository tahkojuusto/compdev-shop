resource "aws_vpc" "vpc" {
  cidr_block = var.vpc_cidr_block
  tags = {
    Name        = "${var.app_name}-${var.env}-vpc"
    Environment = var.env
  }
}

module "public_subnet" {
  source             = "../subnet"
  app_name           = var.app_name
  env                = var.env
  prefix             = "public"
  availability_zones = var.availability_zones
  vpc_id             = aws_vpc.vpc.id
  vpc_cidr_block     = var.vpc_cidr_block
  subnet_cidr_blocks = var.public_subnet_cidr_blocks
}

module "private_subnet" {
  source             = "../subnet"
  app_name           = var.app_name
  env                = var.env
  prefix             = "private"
  availability_zones = var.availability_zones
  vpc_id             = aws_vpc.vpc.id
  vpc_cidr_block     = var.vpc_cidr_block
  subnet_cidr_blocks = var.private_subnet_cidr_blocks
}

module "gateway" {
  source    = "../gateway"
  app_name  = var.app_name
  env       = var.env
  vpc_id    = aws_vpc.vpc.id
  subnet_id = module.public_subnet.subnet_ids[0]
}

resource "aws_route" "igw_route" {
  route_table_id         = element(module.public_subnet.route_table_ids, count.index)
  gateway_id             = module.gateway.internet_gateway_id
  destination_cidr_block = "0.0.0.0/0"
  count                  = length(var.public_subnet_cidr_blocks)
}

resource "aws_route" "nat_route" {
  route_table_id         = element(module.private_subnet.route_table_ids, count.index)
  nat_gateway_id         = module.gateway.nat_gateway_id
  destination_cidr_block = "0.0.0.0/0"
  count                  = length(var.private_subnet_cidr_blocks)
}

resource "null_resource" "null" {
  depends_on = [module.gateway]
}
