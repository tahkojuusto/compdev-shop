output "public_subnet_ids" {
  value = module.public_subnet.subnet_ids
}

output "private_subnet_ids" {
  value = module.private_subnet.subnet_ids
}

output "vpc_id" {
  value = aws_vpc.vpc.id
}
