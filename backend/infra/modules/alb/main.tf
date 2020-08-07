resource "aws_alb" "alb" {
  name            = "${var.app_name}-${var.env}-alb"
  subnets         = var.subnet_ids
  security_groups = [aws_security_group.alb_sg.id]
}

resource "aws_alb_target_group" "ecs_target_group" {
  name     = "${var.app_name}-${var.env}-alb-ecs-target-group"
  port     = 80
  protocol = "HTTP"
  vpc_id   = var.vpc_id

  health_check {
    path     = var.health_check_path
    protocol = "HTTP"
  }

  tags = {
    AppName     = var.app_name
    Environment = var.env
  }
}

resource "aws_alb_listener" "alb_http_listener" {
  port              = "80"
  protocol          = "HTTP"
  load_balancer_arn = aws_alb.alb.id
  default_action {
    target_group_arn = aws_alb_target_group.ecs_target_group.id
    type             = "forward"
  }
}

resource "aws_security_group" "alb_sg" {
  name   = "${var.app_name}-${var.env}-alb-sg"
  vpc_id = var.vpc_id
  tags = {
    Name        = "${var.app_name}-${var.env}-alb-sg"
    AppName     = var.app_name
    Environment = var.env
  }
}

resource "aws_security_group_rule" "sg_ingress_rule" {
  type              = "ingress"
  from_port         = 80
  to_port           = 80
  protocol          = "TCP"
  security_group_id = aws_security_group.alb_sg.id
  cidr_blocks       = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "sg_egress_rule" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  security_group_id = aws_security_group.alb_sg.id
  cidr_blocks       = ["0.0.0.0/0"]
}
