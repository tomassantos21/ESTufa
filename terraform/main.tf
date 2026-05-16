terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
  skip_provider_registration = true
}

resource "random_string" "sufixo" {
  length  = 6
  special = false
  upper   = false
}

# 1. Grupo de Recursos
resource "azurerm_resource_group" "rg" {
  name     = "estufa-rg"
  location = "switzerlandnorth"
}

# 2. Cosmos DB (NoSQL)
resource "azurerm_cosmosdb_account" "cosmos" {
  name                = "estufa-db-${random_string.sufixo.result}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  offer_type          = "Standard"
  kind                = "GlobalDocumentDB"
  capabilities { name = "EnableServerless" }
  consistency_policy { consistency_level = "Session" }
  geo_location {
    location          = azurerm_resource_group.rg.location
    failover_priority = 0
  }
}

resource "azurerm_cosmosdb_sql_database" "db" {
  name                = "estufa-db"
  resource_group_name = azurerm_resource_group.rg.name
  account_name        = azurerm_cosmosdb_account.cosmos.name
}

resource "azurerm_cosmosdb_sql_container" "plants" {
  name                  = "plants"
  resource_group_name   = azurerm_resource_group.rg.name
  account_name          = azurerm_cosmosdb_account.cosmos.name
  database_name         = azurerm_cosmosdb_sql_database.db.name
  partition_key_path    = "/id"
  partition_key_version = 1
  throughput            = 400
}

# 3. Storage Account (Blob Storage para fotos)
resource "azurerm_storage_account" "storage" {
  name                     = "saestufa${random_string.sufixo.result}"
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"

  blob_properties {
    cors_rule {
      allowed_headers    = ["*"]
      allowed_methods    = ["GET", "OPTIONS", "PUT", "POST"]
      allowed_origins    = ["*"]
      exposed_headers    = ["*"]
      max_age_in_seconds = 3600
    }
  }
}

resource "azurerm_storage_container" "fotos" {
  name                  = "fotos-plantas"
  storage_account_name  = azurerm_storage_account.storage.name
  container_access_type = "blob"
}


# 4. Azure AI Services (Computer Vision / Custom Vision)
resource "azurerm_cognitive_account" "ai" {
  name                = "estufa-ia-${random_string.sufixo.result}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  kind                = "ComputerVision" 
  sku_name            = "S1" # <--- MUDAR DE "F0" PARA "S1"
}

# 5. App Service Plan (Linux)
resource "azurerm_service_plan" "app_plan" {
  name                = "estufa-app-plan"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  os_type             = "Linux"
  sku_name            = "B1"
}

# 6. Front-end (Web App Nativo Node.js para build automático)
resource "azurerm_linux_web_app" "frontend" {
  name                = "estufa-frontend-${random_string.sufixo.result}"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  service_plan_id     = azurerm_service_plan.app_plan.id

  site_config {
    application_stack {
      node_version = "20-lts"
    }
    app_command_line = "pm2 serve /home/site/wwwroot/dist --no-daemon --spa"
  }

  app_settings = {
    "VITE_API_URL" = "https://estufa-backend-${random_string.sufixo.result}.azurewebsites.net"
  }
}

# Ligação ao Repo do Front-end
resource "azurerm_app_service_source_control" "fe_deploy" {
  app_id                 = azurerm_linux_web_app.frontend.id
  repo_url               = "https://github.com/tomassantos21/ESTufa"
  branch                 = "main"
  use_manual_integration = true
}

# 7. Back-end (Azure Functions Serverless)
resource "azurerm_linux_function_app" "backend" {
  name                       = "estufa-backend-${random_string.sufixo.result}"
  resource_group_name        = azurerm_resource_group.rg.name
  location                   = azurerm_resource_group.rg.location
  service_plan_id            = azurerm_service_plan.app_plan.id
  storage_account_name       = azurerm_storage_account.storage.name
  storage_account_access_key = azurerm_storage_account.storage.primary_access_key

  app_settings = {
    "COSMOS_DB_CONNECTION"   = azurerm_cosmosdb_account.cosmos.primary_sql_connection_string
    "BLOB_CONNECTION_STRING" = azurerm_storage_account.storage.primary_connection_string
    "AI_SERVICE_KEY"         = azurerm_cognitive_account.ai.primary_access_key
    "AI_SERVICE_ENDPOINT"    = azurerm_cognitive_account.ai.endpoint
  }

  site_config {
    application_stack { node_version = "20" }
    cors { allowed_origins = ["*"] } # Em produção, restringir ao domínio do frontend
  }
}

# Ligação ao Repo do Back-end (Functions)
resource "azurerm_app_service_source_control" "be_deploy" {
  app_id                 = azurerm_linux_function_app.backend.id
  repo_url               = "https://github.com/tomassantos21/ESTufa-API"
  branch                 = "main"
  use_manual_integration = true
}

# 8. Azure Container Instance (Para satisfazer o critério de Contentores Docker)
resource "azurerm_container_group" "cache" {
  name                = "estufa-cache-${random_string.sufixo.result}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  ip_address_type     = "Public"
  dns_name_label      = "estufa-cache-${random_string.sufixo.result}"
  os_type             = "Linux"

  container {
    name   = "redis"
    image  = "redis:alpine"
    cpu    = "0.5"
    memory = "1.5"
    ports {
      port     = 6379
      protocol = "TCP"
    }
  }
}