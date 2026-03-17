resource "aws_vpc" "main" {
  cidr_block = var.cidr_block
  tags = {
    Name = var.name
  }
}

resource "aws_subnet" "public" {
  count             = length(var.public_subnets)
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.public_subnets[count.index]
  availability_zone = var.availability_zones[count.index]
  tags = {
    Name = "${var.name}-public-${count.index}"
  }
}

variable "cidr_block" {
  description = "CIDR block for VPC"
}

variable "name" {
  description = "Name of the VPC"
}

variable "public_subnets" {
  description = "List of public subnet CIDR blocks"
}

variable "availability_zones" {
  description = "List of availability zones"
}

output "vpc_id" {
  value = aws_vpc.main.id
}

output "public_subnet_ids" {
  value = aws_subnet.public[*].id
}