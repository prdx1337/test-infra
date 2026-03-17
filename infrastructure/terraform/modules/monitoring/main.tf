resource "aws_eks_addon" "prometheus" {
  cluster_name = var.cluster_name
  addon_name   = "amazon-cloudwatch-observability"
}

variable "cluster_name" {
  description = "EKS cluster name"
}