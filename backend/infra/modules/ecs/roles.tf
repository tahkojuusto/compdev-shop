resource "aws_iam_role" "ecs_instance_role" {
  name               = "${var.app_name}-${var.env}-ecs-instance-role"
  assume_role_policy = data.aws_iam_policy_document.ecs_assume_instance_role_policy.json
}

resource "aws_iam_role_policy_attachment" "ecs_instance_role_ec2_attachment" {
  role       = aws_iam_role.ecs_instance_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role"
}

resource "aws_iam_role_policy_attachment" "ecs_instance_role_cloudwatch_attachment" {
  role       = aws_iam_role.ecs_instance_role.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess"
}

resource "aws_iam_instance_profile" "ecs_instance_profile" {
  name_prefix = local.cluster_name
  role        = aws_iam_role.ecs_instance_role.name
}
