resource "aws_key_pair" "bastion_key_pair" {
  key_name   = "bastion-key"
  public_key = var.bastion_public_key
}

resource "aws_instance" "bastion" {
  ami           = var.ec2_ami_id
  instance_type = var.ec2_instance_type
  vpc_security_group_ids = [
    aws_security_group.bastion_sg.id
  ]
  key_name                    = aws_key_pair.bastion_key_pair.key_name
  iam_instance_profile        = aws_iam_instance_profile.bastion_instance_profile.name
  associate_public_ip_address = true
  subnet_id                   = var.subnet_id
  tags = {
    Name        = "${var.app_name}-${var.env}-bastion"
    Environment = var.env
  }
}

resource "aws_security_group" "bastion_sg" {
  name   = "${var.app_name}-${var.env}-bastion-sg"
  vpc_id = var.vpc_id

  ingress {
    protocol    = "TCP"
    from_port   = 22
    to_port     = 22
    cidr_blocks = var.allowed_cidr_blocks
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    "Name" = "cs-dev-bastion-sg"
  }
}

data "aws_iam_policy_document" "bastion_assume_policy" {
  statement {
    effect = "Allow"
    actions = [
      "sts:AssumeRole",
    ]
    principals {
      type = "Service"
      identifiers = [
        "ec2.amazonaws.com"
      ]
    }
  }
}

resource "aws_iam_instance_profile" "bastion_instance_profile" {
  name = "${var.app_name}-${var.env}-bastion-instance-profile"
  role = aws_iam_role.bastion_role.name
}

resource "aws_iam_role_policy_attachment" "bastion_instance_role_ssm_attachment" {
  role       = aws_iam_role.bastion_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_role" "bastion_role" {
  name               = "${var.app_name}-${var.env}-bastion-role"
  assume_role_policy = data.aws_iam_policy_document.bastion_assume_policy.json
}
