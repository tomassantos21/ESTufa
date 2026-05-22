# ESTufa 🌿

**ESTufa** é uma aplicação web baseada na plataforma Microsoft Azure, dedicada à identificação de espécies botânicas com recurso à inteligência artificial. Desenvolvida para ser uma ferramenta indispensável no cuidado e conhecimento da biodiversidade botânica.

<br>

<img width="1899" height="910" alt="{7115CE0B-E69F-403C-84B9-363C0048B3EE}" src="https://github.com/user-attachments/assets/89333895-22a2-4258-90b2-a53d95dd3d66" />

<br>

## 📖 Sobre o Projeto
A ferramenta permite aos utilizadores submeter fotografias de plantas para obter, de forma imediata, a sua identificação científica e respetivas informações de cultivo. Além da componente analítica, a plataforma incentiva a vertente social e a partilha de conhecimento através de um feed comunitário de descobertas e da criação de coleções digitais que funcionam como herbários pessoais privados.

Este projeto foi desenvolvido no âmbito da unidade curricular Computação em Nuvem da licenciatura em Engenharia Informática, na Escola Superior de Tecnologia do Instituto Politécnico de Castelo Branco.

## ✨ Funcionalidades
* **Autenticação e Gestão de Perfil:** Sistema de registo e acesso seguro, com página de perfil personalizada que exibe as "Descobertas" do utilizador.
* **Identificação Botânica Inteligente:** Processamento na nuvem de imagens submetidas, retornando o nome comum, a identificação científica, uma breve descrição e a taxa de confiança da previsão da IA.
* **Feed Comunitário:** Uma página pública e filtrável onde são apresentadas as plantas recentemente identificadas pela comunidade da plataforma.
* **Coleções Digitais Pessoais:** Secção "Minhas Coleções" que serve como um herbário pessoal, guardando o histórico de todas as identificações bem-sucedidas.

<br>

<img width="1920" height="912" alt="{5FC045AD-4277-4AC9-8BEE-81CCC720CE1B}" src="https://github.com/user-attachments/assets/8ba6d9ab-c1dc-47c6-882e-cdd4d33192b6" />
<br>
<img width="1900" height="907" alt="{4137BABB-4E11-45B2-AF07-CEF7539FA6C3}" src="https://github.com/user-attachments/assets/7171ff9e-5b83-4562-b23e-aff347ecdef0" />
<br>
<img width="1920" height="911" alt="{173C8F16-E296-444D-9B2D-1E46EB1397A8}" src="https://github.com/user-attachments/assets/32a7fdcd-24a4-45b3-92ae-40a13ac33b43" />
<br>
<img width="1920" height="903" alt="{1978642F-0302-4DAD-84C6-2C7BC3DAA47C}" src="https://github.com/user-attachments/assets/9c0581dc-03d6-4842-b73b-07c1574663fd" />

<br>

## 🛠️ Tecnologias e Infraestrutura
A infraestrutura tecnológica assenta numa arquitetura moderna e escalável na nuvem Microsoft Azure.
* **Front-end:** Desenvolvido em React.
* **Alojamento e CI/CD:** Azure App Service com integração direta ao GitHub para alojamento contínuo e implementação automática do código.
* **Inteligência Artificial:** Azure Cognitive Services atuando como o motor central para a análise das fotografias e identificação das plantas.
* **Processamento:** Azure Functions (Serverless) responsáveis pelo back-end automático de processamento de submissão de imagens.
* **Base de Dados:** Azure Cosmos DB for NoSQL para a persistência não relacional dos dados de utilizadores e do feed.
* **Armazenamento:** Azure Blob Storage para guardar de forma segura e fiável as imagens submetidas.
* **Isolamento:** Docker Containers utilizados para isolar componentes específicos do sistema.
* **Automação:** Criação autónoma da infraestrutura baseada em scripts de PowerShell utilizando a Azure CLI.

## 👥 Autores
* Catarina Antunes (nº 20170667)
* Martim Martins (nº 20230327)
* Tomás Santos (nº 20220896)

## 📄 Licença
Este projeto encontra-se sob a licença MIT.
