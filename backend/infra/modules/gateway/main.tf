resource "aws_internet_gateway" "igw" {
  vpc_id = var.vpc_id
  tags = {
    Name        = "${var.app_name}-${var.env}-igw"
    Environment = var.env
  }
}

resource "aws_nat_gateway" "ngw" {
  allocation_id = aws_eip.eip.id
  subnet_id     = var.subnet_id
  tags = {
    Name        = "${var.app_name}-${var.env}-ngw"
    Environment = var.env
  }
  depends_on = [aws_internet_gateway.igw]
}

resource "aws_eip" "eip" {
  vpc = true
  tags = {
    Name        = "${var.app_name}-${var.env}-eip"
    Environment = var.env
  }
  depends_on = [aws_internet_gateway.igw]
}
