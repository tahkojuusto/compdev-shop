resource "aws_subnet" "subnet" {
  vpc_id            = var.vpc_id
  cidr_block        = element(var.subnet_cidr_blocks, count.index)
  availability_zone = element(var.availability_zones, count.index)
  count             = length(var.subnet_cidr_blocks)

  tags = {
    Name        = "${var.app_name}-${var.env}-${var.prefix}-subnet"
    Environment = var.env
  }
}

resource "aws_route_table" "subnet_route_table" {
  vpc_id = var.vpc_id
  count  = length(var.subnet_cidr_blocks)

  tags = {
    Name        = "${var.app_name}-${var.env}-${var.prefix}-route-table"
    Environment = var.env
  }
}

resource "aws_route_table_association" "subnet_route_table_assoc" {
  subnet_id      = element(aws_subnet.subnet.*.id, count.index)
  route_table_id = element(aws_route_table.subnet_route_table.*.id, count.index)
  count          = length(var.subnet_cidr_blocks)
}
