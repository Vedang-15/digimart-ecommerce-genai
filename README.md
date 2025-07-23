# 🛍️ Digimart (AI-Powered E-Commerce Web Application)

This is a full-stack e-commerce web application built using **Angular**, **Spring Boot**, and **MySQL**, with integrated **AI-powered features** for enhanced user experience. The application includes secure authentication, order history, and product catalog management. It also demonstrates cutting-edge **Generative AI integration** using **local LLMs** and **mock AI** for production deployment.

---

## 🚀 Live Demo (Mock AI)
🔗 **Deployed Version on Azure**

> 🧪 For actual AI-generated responses, please run the local version with **Ollama + LM Studio** (details below).

---

## 📌 Features

### 🌐 Frontend (Angular)
- User registration & login via **Auth0**
- Product listing, cart, and checkout flow
- View past orders (requires login)
- Responsive and modern UI
- Secure **HTTPS** communication

### 🧠 GenAI Features

#### 📝 Product Description Generator
- Takes product name and category as input
- Returns rich, persuasive AI-generated description
- Uses **Mistral 7B Instruct** model via **LM Studio**

#### ❓ Smart FAQ Generator *(Optional Second Feature)*
- Generates potential FAQs based on product context
- In deployed version, AI responses are **mocked** to simulate realistic outputs without requiring cloud hosting

---

## 🛠️ Backend (Spring Boot)
- RESTful APIs for products, orders, and user data
- **Auth0 JWT** validation & role-based access control
- **MongoDB** integration
- CORS and HTTPS support

---

## 🧑‍💻 Tech Stack

| Layer     | Technologies Used                                            |
|-----------|--------------------------------------------------------------|
| Frontend  | Angular, TypeScript, HTML/CSS                                |
| Backend   | Java, Spring Boot, Spring Security, Auth0, Stripe (Payemnts)                    |
| Database  | MySQL                                                    |
| AI Engine | Mistral 7B Instruct, LM Studio                      |
| Hosting   | Azure App Service (HTTPS-enabled), Azure Static Web Apps     |
| Auth      | Auth0 OAuth2 with JWT Bearer tokens                          |

---

### 📁 Project Structure

```plaintext
ecommerce-project/
├── mock-ai/
│   ├── frontend-angular/
│   ├── backend-springboot/
│   └── starter-files/
├── genai-local/
│   ├── frontend-angular/
│   ├── backend-springboot/
│   └── starter-files/
├── .gitignore
└── README.md
```




---

## 🔐 Authentication (Auth0)
- Auth0 handles login/signup securely.
- JWTs are sent from Angular frontend and validated by Spring Boot backend.
- User session is persisted via refresh tokens and Angular interceptors.

---

## 🧠 Running GenAI Locally

To run the real AI version locally:

1. **Download [LM Studio](https://lmstudio.ai/)**
2. **Install the Mistral 7B Instruct** model
3. Start LM Studio server at: http://localhost:1234/v1/chat
4. Run the local `genai-local` Angular frontend and Spring Boot backend together.
5. Interact with the description generator and see **live responses**!

---

## 🛠️ Local Setup Instructions
```bash
# Clone the repository
git clone https://github.com/yourusername/ecommerce-ai-app.git
cd ecommerce-ai-app

# Start backend
cd backend-springboot
./mvnw spring-boot:run

# Start frontend (Mock AI Version)
cd ../frontend-angular/mock-ai
npm install
ng serve --ssl true --ssl-key ./sslcert/key.pem --ssl-cert ./sslcert/cert.pem

# For local GenAI version, instead use:
cd ../genai-local
```

---

### 🧪 Testing

- Backend APIs tested via **Postman**  
- Frontend tested using **Angular CLI** with mocked services  
- **JWT and role-based access** thoroughly validated  

---

### 🌐 Deployment

- Frontend hosted on **Azure Static Web Apps** (mock AI version)  
- Backend deployed on **Azure App Service**  
- **CORS** and **HTTPS** enabled  
- Uses **real SSL certificates**, not self-signed  

---

### 🧾 License

This project is licensed under the **MIT License**. See [LICENSE](./LICENSE) for details.

---

### 💬 Contact

For queries or collaboration:  
📧 [vedanghatekar@gmail.com](mailto:vedanghatekar@gmail.com)


