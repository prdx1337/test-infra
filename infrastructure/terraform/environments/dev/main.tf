terraform {
  backend "s3" {
    bucket = "my-terraform-state-bucket"
    key    = "dev/terraform.tfstate"
    region = "us-east-1"
    dynamodb_table = "terraform-lock"
  }
}

module "vpc" {
  source = "../../modules/vpc"
  cidr_block = "10.0.0.0/16"
  name = "dev-vpc"
  public_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  availability_zones = ["us-east-1a", "us-east-1b"]
}

module "kubernetes_cluster" {
  source = "../../modules/kubernetes-cluster"
  cluster_name = "dev-cluster"
  subnet_ids = module.vpc.public_subnet_ids
}

module "kafka" {
  source = "../../modules/kafka"
  cluster_name = "dev-kafka"
  kafka_version = "2.8.1"
  number_of_broker_nodes = 2
  instance_type = "kafka.t3.small"
  subnet_ids = module.vpc.public_subnet_ids
  vpc_id = module.vpc.vpc_id
}

module "monitoring" {
  source = "../../modules/monitoring"
  cluster_name = module.kubernetes_cluster.cluster_name
}