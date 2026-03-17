resource "aws_msk_cluster" "main" {
  cluster_name           = var.cluster_name
  kafka_version          = var.kafka_version
  number_of_broker_nodes = var.number_of_broker_nodes
  broker_node_group_info {
    instance_type   = var.instance_type
    client_subnets  = var.subnet_ids
    security_groups = [aws_security_group.kafka.id]
  }
}

resource "aws_security_group" "kafka" {
  name   = "${var.cluster_name}-kafka-sg"
  vpc_id = var.vpc_id
}

variable "cluster_name" {
  description = "Name of the MSK cluster"
}

variable "kafka_version" {
  description = "Kafka version"
}

variable "number_of_broker_nodes" {
  description = "Number of broker nodes"
}

variable "instance_type" {
  description = "Instance type for brokers"
}

variable "subnet_ids" {
  description = "List of subnet IDs"
}

variable "vpc_id" {
  description = "VPC ID"
}

output "bootstrap_brokers" {
  value = aws_msk_cluster.main.bootstrap_brokers
}