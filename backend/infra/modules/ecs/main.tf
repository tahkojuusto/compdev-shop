locals {
  cluster_name = "${var.app_name}-${var.env}-ecs-cluster"
}

resource "aws_ecs_cluster" "ecs_cluster" {
  name = local.cluster_name
}

resource "aws_service_discovery_private_dns_namespace" "service_discovery" {
  name = "${var.app_name}.${var.env}"
  vpc  = var.vpc_id
}

resource "aws_key_pair" "ecs_key_pair" {
  key_name   = "ecs-key"
  public_key = var.ecs_public_key
}

resource "aws_launch_configuration" "ecs_launch_config" {
  name_prefix   = "${var.app_name}-${var.env}-ecs-launch-config-"
  image_id      = var.ec2_ami_id
  instance_type = var.ec2_instance_type
  key_name      = "ecs-key"
  security_groups = [
    aws_security_group.ec2_sg.id
  ]
  iam_instance_profile = aws_iam_instance_profile.ecs_instance_profile.name
  user_data            = <<EOF
#!/bin/bash
echo ECS_CLUSTER=${local.cluster_name} >> /etc/ecs/ecs.config
EOF

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_autoscaling_group" "asg" {
  name = "${var.app_name}-${var.env}-asg-${aws_launch_configuration.ecs_launch_config.name}"
  termination_policies = [
    "OldestInstance"
  ]
  min_size             = var.min_ec2_count
  max_size             = var.max_ec2_count
  desired_capacity     = var.min_ec2_count
  launch_configuration = aws_launch_configuration.ecs_launch_config.name
  vpc_zone_identifier  = var.subnet_ids
  target_group_arns    = [var.alb_target_group_arn]
  tags = [
    {
      key                 = "Name"
      value               = local.cluster_name
      propagate_at_launch = true
    }
  ]
  depends_on = [
    aws_launch_configuration.ecs_launch_config
  ]
}

resource "aws_autoscaling_policy" "asg_policy" {
  name                   = "${var.app_name}-${var.env}-asg-policy"
  policy_type            = "TargetTrackingScaling"
  adjustment_type        = "ChangeInCapacity"
  autoscaling_group_name = aws_autoscaling_group.asg.name

  target_tracking_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ASGAverageCPUUtilization"
    }
    target_value = var.cpu_auto_scaling_limit
  }
}

resource "aws_security_group" "ec2_sg" {
  name   = "${var.app_name}-${var.env}-ec2-sg"
  vpc_id = var.vpc_id
  tags = {
    Name        = "${var.app_name}-${var.env}-ec2-sg"
    AppName     = var.app_name
    Environment = var.env
  }
}

resource "aws_security_group_rule" "ec2_ssh_sg_rule_ingress" {
  type                     = "ingress"
  from_port                = 22
  to_port                  = 22
  protocol                 = "TCP"
  source_security_group_id = var.bastion_sg_id
  security_group_id        = aws_security_group.ec2_sg.id
}

resource "aws_security_group_rule" "ec2_ssh_sg_rule_egress" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.ec2_sg.id
}

resource "aws_security_group_rule" "ec2_http_sg_rule" {
  type                     = "ingress"
  from_port                = 80
  to_port                  = 80
  protocol                 = "TCP"
  source_security_group_id = var.alb_sg_id
  security_group_id        = aws_security_group.ec2_sg.id
}
