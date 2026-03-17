terraform {
  backend "s3" {
    bucket = "my-terraform-state-bucket"
    key    = "staging/terraform.tfstate"
    region = "us-east-1"
    dynamodb_table = "terraform-lock"
  }
}

module "vpc" {
  source = "../../modules/vpc"
  cidr_block = "10.1.0.0/16"
  name = "staging-vpc"
  public_subnets = ["10.1.1.0/24", "10.1.2.0/24"]
  availability_zones = ["us-east-1a", "us-east-1b"]
}

module "kubernetes_cluster" {
  source = "../../modules/kubernetes-cluster"
  cluster_name = "staging-cluster"
  subnet_ids = module.vpc.public_subnet_ids
}

module "kafka" {
  source = "../../modules/kafka"
  cluster_name = "staging-kafka"
  kafka_version = "2.8.1"
  number_of_broker_nodes = 3
  instance_type = "kafka.m5.large"
  subnet_ids = module.vpc.public_subnet_ids
  vpc_id = module.vpc.vpc_id
}

module "monitoring" {
  source = "../../modules/monitoring"
  cluster_name = module.kubernetes_cluster.cluster_name
}