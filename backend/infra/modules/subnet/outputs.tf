output "subnet_ids" {
  value = aws_subnet.subnet.*.id
}

output "route_table_ids" {
  value = aws_route_table.subnet_route_table.*.id
}
