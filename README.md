# IA Educativa para Personas Sordas

Aplicación web interactiva que funciona como un **profesor virtual de programación**, diseñada específicamente para personas sordas. Ofrece lecciones sobre programación orientada a objetos con accesibilidad total.

## 🎯 Objetivo

Crear una plataforma educativa que:
- 📚 Enseñe programación de forma interactiva
- ♿ Sea completamente accesible para personas sordas
- 🤖 Utilice IA para personalizar el aprendizaje
- 💻 Comience con Programación Orientada a Objetos (POO)

## 🏗️ Estructura del Proyecto

Este es un **monorepo** con tres áreas principales:

```
IA_Educativa_Sordos/
├── frontend/          # Interfaz de usuario (React + TypeScript)
├── backend/           # API y lógica del profesor IA (Node.js + Express)
└── shared/            # Código compartido entre frontend y backend
```

## 🚀 Instalación Rápida

### Requisitos previos
- **Node.js** 16+
- **Yarn** (recomendado) o npm

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

| Aspecto | Tecnología |
|--------|-----------|
| **Frontend** | React 18, TypeScript, Tailwind CSS, Vite |
| **Backend** | Node.js, Express, TypeScript |
| **IA** | OpenAI API o Claude (próximamente) |
| **Base de datos** | MongoDB/PostgreSQL (configurar próximamente) |
| **Accesibilidad** | WCAG 2.1 AA compliant |

## ✨ Características Principales

- [ ] Interfaz de chat con profesor virtual
- [ ] Lecciones estructuradas de POO
- [ ] Sistema de seguimiento de progreso
- [ ] Ejercicios prácticos interactivos
- [ ] Subtítulos y accesibilidad completa
- [ ] Autenticación de usuarios
- [ ] Tema claro/oscuro accesible

## 📚 Temas Cubiertos (Fase 1)

### Programación Orientada a Objetos (POO)
- ✅ Clases y objetos
- ✅ Herencia
- ✅ Polimorfismo
- ✅ Encapsulación
- ✅ Abstracción

## 📊 Roadmap

### Fase 1: Fundamentos (Próximamente)
- Setup completo del monorepo
- Estructura base de carpetas
- Layout y componentes base
- Autenticación básica

### Fase 2: MVP (Core)
- Interfaz de chat funcional
- Integración con OpenAI/Claude
- Primeras lecciones de POO
- Sistema de progreso básico

### Fase 3: Expansión
- Ejercicios interactivos
- Sistema de calificaciones
- Gamificación
- Más temas de programación

## 📖 Documentación

- [Frontend Setup](frontend/SETUP.md)
- [Backend Setup](backend/SETUP.md)
- [Contributing Guide](CONTRIBUTING.md)

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Lee [CONTRIBUTING.md](CONTRIBUTING.md)
2. Crea una rama para tu feature: `git checkout -b feature/tu-feature`
3. Commit tus cambios: `git commit -m 'feat: descripción'`
4. Push a la rama: `git push origin feature/tu-feature`
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Ver [LICENSE](LICENSE) para más detalles.

## 📞 Contacto

- **Issues**: [GitHub Issues](https://github.com/pradameister/IA_Educativa_Sordos/issues)
- **Discussions**: [GitHub Discussions](https://github.com/pradameister/IA_Educativa_Sordos/discussions)

---

**¡Construyamos educación inclusiva juntos! 🌟**

*Proyecto dedicado a hacer la programación accesible para todas las personas, especialmente la comunidad sorda.*
