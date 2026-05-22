# ESTufa 🌿

**ESTufa** é uma aplicação web de última geração baseada na plataforma Microsoft Azure, dedicada à identificação inteligente de espécies botânicas através de inteligência artificial. Desenvolvida para ser uma ferramenta indispensável no cuidado, catalogação e partilha de conhecimento sobre biodiversidade botânica.

<br>

<img width="1899" height="910" alt="{7115CE0B-E69F-403C-84B9-363C0048B3EE}" src="https://github.com/user-attachments/assets/89333895-22a2-4258-90b2-a53d95dd3d66" />

<br>

---

## 📖 Sobre o Projeto
A ferramenta permite aos utilizadores submeter fotografias de plantas para obter, de forma imediata, a sua identificação científica e respetivas informações de cultivo. Além da componente analítica, a plataforma incentiva a vertente social e a partilha de conhecimento através de um feed comunitário de descobertas e da criação de coleções digitais que funcionam como herbários pessoais privados.

Este projeto foi desenvolvido no âmbito da unidade curricular **Computação em Nuvem** da licenciatura em Engenharia Informática, na Escola Superior de Tecnologia do **Instituto Politécnico de Castelo Branco (IPCB)**.

---

## 📱 Páginas e Fluxo do Utilizador (SPA)

A aplicação do lado do cliente é uma Single Page Application (SPA) moderna, reativa e fluida, estruturada em torno de seis ecrãs principais:

1.  **Apresentação (`Landing.tsx`)**: Ecrã de entrada cativante com micro-animações, transições suaves e chamadas para ação.
2.  **Autenticação (`Login.tsx` / `Register.tsx`)**: Formulários polidos com validações animadas em tempo real para registo e acesso seguro (com passwords cifradas via `bcryptjs` no servidor).
3.  **Feed Comunitário (`Feed.tsx`)**: Apresenta em tempo real as plantas identificadas por toda a comunidade. As consultas são otimizadas na cloud através de uma camada Redis super rápida.
4.  **Scanner de Plantas com IA (`Scan.tsx`)**:
    *   Solicita um token SAS (Shared Access Signature) temporário e seguro do Azure Blob Storage.
    *   Efetua o upload seguro da fotografia diretamente do browser para o Blob Storage.
    *   Chama a análise de IA do Azure para processar a imagem e identificar a planta.
5.  **Perfil e Herbário Digital (`Profile.tsx`)**: Apresenta as informações do utilizador e uma galeria pessoal organizada contendo o histórico de todas as identificações bem-sucedidas.

---

## ✨ Funcionalidades e Ecrãs

*   **Autenticação e Gestão de Perfil**: Sistema de registo e acesso seguro, com página de perfil personalizada que exibe as "Descobertas" do utilizador.
*   **Identificação Botânica Inteligente**: Processamento na nuvem de imagens submetidas, retornando o nome comum, a identificação científica, uma breve descrição e a taxa de confiança da previsão da IA.
*   **Feed Comunitário**: Uma página pública e filtrável onde são apresentadas as plantas recentemente identificadas pela comunidade da plataforma.
*   **Coleções Digitais Pessoais**: Secção "Minhas Coleções" que serve como um herbário pessoal, guardando o histórico de todas as identificações bem-sucedidas.

<br>

<img width="1920" height="912" alt="{5FC045AD-4277-4AC9-8BEE-81CCC720CE1B}" src="https://github.com/user-attachments/assets/8ba6d9ab-c1dc-47c6-882e-cdd4d33192b6" />
<br>
<img width="1900" height="907" alt="{4137BABB-4E11-45B2-AF07-CEF7539FA6C3}" src="https://github.com/user-attachments/assets/7171ff9e-5b83-4562-b23e-aff347ecdef0" />
<br>
<img width="1920" height="911" alt="{173C8F16-E296-444D-9B2D-1E46EB1397A8}" src="https://github.com/user-attachments/assets/32a7fdcd-24a4-45b3-92ae-40a13ac33b43" />
<br>
<img width="1920" height="903" alt="{1978642F-0302-4DAD-84C6-2C7BC3DAA47C}" src="https://github.com/user-attachments/assets/9c0581dc-03d6-4842-b73b-07c1574663fd" />

<br>

---

## 🛠️ Tecnologias e Infraestrutura Cloud-Native

A arquitetura tecnológica da solução assenta em serviços modernos e totalmente integrados na nuvem **Microsoft Azure**:

*   **Front-end (Vite + React)**: Desenvolvido em **React (v18)** com build super rápido via **Vite**, estilizado com **Tailwind CSS v4** (variáveis HSL e glassmorphism), icons **Lucide React** e animações fluidas com **Motion**.
*   **Back-end Serverless (Azure Functions v4)**: API desenvolvida no modelo de programação v4 Node.js, com 7 endpoints serverless isolados para gestão de feeds, perfis, tokens SAS e análises de IA.
*   **Identificação por Inteligência Artificial**: **Azure AI Vision (Image Analysis v4.0)** integrado para extração de tags, legendagem automática de fotos e validação de espécies botânicas.
*   **Base de Dados**: **Azure Cosmos DB (NoSQL)** configurado em modo Serverless para guardar de forma escalável e com latência mínima os metadados de utilizadores e plantas.
*   **Armazenamento Multimédia**: **Azure Blob Storage** com permissões seguras e regras de CORS ativas para gerir o ciclo de vida e upload direto das fotos das plantas.
*   **Cache de Alto Desempenho (Redis em ACI)**: Um contentor Docker Alpine com **Redis** hospedado no **Azure Container Instances (ACI)** que serve como cache de alto rendimento. Implementa um sistema robusto de *lazy-connection* no back-end para evitar bloqueios de gRPC no arranque e invalidar caches de feed e galeria de forma instantânea quando novas plantas são detetadas.
*   **Infraestrutura como Código (Terraform)**: Toda a arquitetura Azure é provisionada de forma 100% automatizada e declarativa através dos ficheiros na pasta `/terraform`.

---

## ☁️ Como Implementar e Executar na Nuvem (Microsoft Azure)

Esta plataforma foi desenhada especificamente para correr de forma nativa na nuvem Microsoft Azure. O front-end (React SPA) é servido por um **Azure Linux Web App** nativo e integrado com um pipeline automatizado de CI/CD via GitHub Actions.

### Pré-requisitos
*   Uma conta ativa na **Microsoft Azure** com subscrição válida.
*   [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli) instalada e autenticada (`az login`).
*   [Terraform](https://developer.hashicorp.com/terraform/downloads) instalado para automatizar a criação da infraestrutura.
*   Repositórios GitHub configurados para ativação automática do pipeline CI/CD.

---

### Passo 1: Criar a Infraestrutura na Nuvem (Terraform)
Os ficheiros na pasta `/terraform` configuram e ligam automaticamente a base de dados, a storage account, o serviço de IA, a cache Redis, a Web App de front-end e o backend de Azure Functions.

1.  Aceda à pasta do Terraform:
    ```bash
    cd terraform
    ```
2.  Inicialize o Terraform para descarregar o provider da Azure:
    ```bash
    terraform init
    ```
3.  Visualize as alterações de infraestrutura planeadas:
    ```bash
    terraform plan
    ```
4.  Crie a infraestrutura na nuvem:
    ```bash
    terraform apply -auto-approve
    ```
    *Isto cria a Web App Linux do Front-end (ex: `estufa-frontend-jge55d`) e configura a variável `VITE_API_URL` para apontar de forma imediata para o endpoint da Function App.*

---

### Passo 2: Publicação e Execução Automática (CI/CD)
O front-end está ligado à Azure Web App utilizando pipelines do **GitHub Actions** (`.github/workflows`) para efetuar a compilação de produção e a publicação automática no Azure App Service a cada push na branch `main`:

1.  O pipeline do GitHub Action é acionado ao efetuar commit e push para o repositório principal:
    ```bash
    git add .
    git commit -m "Deploy production client"
    git push origin main
    ```
2.  O GitHub Actions encarrega-se de:
    *   Descarregar o código e configurar a versão estável do Node.js (v22).
    *   Resolver e descarregar as dependências de produção (`npm install`).
    *   Compilar os recursos estáticos do React com Vite (`npm run build`).
    *   Enviar o pacote final compilado diretamente para o Azure Linux Web App utilizando as credenciais seguras de publicação.
3.  O Azure App Service recebe o pacote final no diretório `/home/site/wwwroot/dist` e executa o servidor de ficheiros PM2 em modo SPA:
    ```bash
    pm2 serve /home/site/wwwroot/dist --no-daemon --spa
    ```
    *O front-end fica imediatamente ativo e disponível de forma segura através do URL público disponibilizado pelo App Service (ex: `https://estufa-frontend-jge55d.azurewebsites.net`).*

---

## 👥 Autores
Trabalho académico realizado por:
*   **Catarina Antunes** (nº 20170667)
*   **Martim Martins** (nº 20230327)
*   **Tomás Santos** (nº 20220896)

---

## 📄 Licença
Este projeto encontra-se sob a licença MIT. Para mais informações, consulte o ficheiro [LICENSE](LICENSE).
