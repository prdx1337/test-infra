terraform {
  backend "s3" {
    bucket = "my-terraform-state-bucket"
    key    = "prod/terraform.tfstate"
    region = "us-east-1"
    dynamodb_table = "terraform-lock"
  }
}

module "vpc" {
  source = "../../modules/vpc"
  cidr_block = "10.2.0.0/16"
  name = "prod-vpc"
  public_subnets = ["10.2.1.0/24", "10.2.2.0/24", "10.2.3.0/24"]
  availability_zones = ["us-east-1a", "us-east-1b", "us-east-1c"]
}

module "kubernetes_cluster" {
  source = "../../modules/kubernetes-cluster"
  cluster_name = "prod-cluster"
  subnet_ids = module.vpc.public_subnet_ids
}

module "kafka" {
  source = "../../modules/kafka"
  cluster_name = "prod-kafka"
  kafka_version = "2.8.1"
  number_of_broker_nodes = 5
  instance_type = "kafka.m5.large"
  subnet_ids = module.vpc.public_subnet_ids
  vpc_id = module.vpc.vpc_id
}

module "monitoring" {
  source = "../../modules/monitoring"
  cluster_name = module.kubernetes_cluster.cluster_name
}