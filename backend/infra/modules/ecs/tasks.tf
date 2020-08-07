resource "aws_ecs_task_definition" "test_ecs_task" {
  family                = "test_ecs_task"
  container_definitions = file("task-definitions/test-ecs-task.json")
}

resource "aws_ecs_service" "test_ecs_service" {
  name            = "${var.app_name}-${var.env}-ecs-service"
  cluster         = aws_ecs_cluster.ecs_cluster.id
  task_definition = aws_ecs_task_definition.test_ecs_task.arn
  desired_count   = 1

  load_balancer {
    target_group_arn = var.alb_target_group_arn
    container_name   = "test-ecs-task"
    container_port   = 8080
  }
}
