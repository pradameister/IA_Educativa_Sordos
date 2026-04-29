# IA Educativa para Personas Sordas

Aplicación web interactiva que funciona como un profesor virtual de programación, diseñada específicamente para personas sordas. Ofrece lecciones sobre programación orientada a objetos y otros temas de programación con una interfaz accesible y clara.

## 🎯 Objetivo

Crear una plataforma educativa que:
- Enseñe programación de forma interactiva
- Sea completamente accesible para personas sordas
- Utilice IA para personalizar el aprendizaje
- Comience con Programación Orientada a Objetos (POO)

## 🏗️ Estructura del Proyecto

Este es un **monorepo** con tres áreas principales:

```
IA_Educativa_Sordos/
├── frontend/          # Interfaz de usuario (React + TypeScript)
├── backend/           # API y lógica del profesor IA (Node.js + Express)
└── shared/            # Código compartido entre frontend y backend
```

## 🚀 Instalación

### Requisitos previos
- Node.js 16+
- Yarn (recomendado) o npm

### Pasos

```bash
# Clonar el repositorio
git clone https://github.com/pradameister/IA_Educativa_Sordos.git
cd IA_Educativa_Sordos

# Instalar dependencias de todo el monorepo
yarn install

# Configurar variables de entorno
cp backend/.env.example backend/.env.local
cp frontend/.env.example frontend/.env.local
```

## 📝 Desarrollo

```bash
# Ejecutar frontend y backend simultáneamente
yarn dev

# O trabajar en un área específica
cd frontend && yarn dev
cd backend && yarn dev
```

## 🔧 Stack Tecnológico

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, TypeScript
- **IA**: Integración con OpenAI API o Claude (próximamente)
- **Base de datos**: MongoDB/PostgreSQL (configurar próximamente)
- **Accesibilidad**: WCAG 2.1 AA compliant

## ✨ Características Principales

- [ ] Interfaz de chat con profesor virtual
- [ ] Lecciones estructuradas de POO
- [ ] Sistema de seguimiento de progreso
- [ ] Ejercicios prácticos interactivos
- [ ] Subtítulos y accesibilidad completa
- [ ] Autenticación de usuarios

## 📚 Temas Cubiertos (Fase 1)

- Programación Orientada a Objetos (POO)
  - Clases y objetos
  - Herencia
  - Polimorfismo
  - Encapsulación
  - Abstracción

## 🤝 Contribuir

Las contribuciones son bienvenidas.

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

---

**¡Construyamos educación inclusiva juntos! 🌟**
