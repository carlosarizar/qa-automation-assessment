# QA Automation Assessment

Proyecto de pruebas automatizadas con Playwright para aplicaciones Angular y APIs REST.

## Configuración Inicial

### Prerrequisitos

- Node.js 18 o superior
- npm 9 o superior

### Instalación

1. Clonar el repositorio:
```bash
git clone 
cd qa-automation-assessment
```

2. Instalar dependencias:
```bash
npm install
```

3. Instalar navegadores de Playwright:
```bash
npx playwright install
```

## 📁 Estructura del Proyecto

```
qa-automation-assessment/
├── .github/workflows/     # CI/CD con GitHub Actions
├── pages/                 # Page Object Model
├── builders/              # Test Data Builders
├── tests/                 # Test cases
│   ├── login.spec.ts     # UI tests
│   └── api/              # API tests
├── playwright.config.ts   # Configuración de Playwright
└── package.json
```

## Ejecutar Tests

### Todos los tests
```bash
npm test
```

### Tests en modo headed (con UI visible)
```bash
npm run test:headed
```

### Tests con UI de Playwright
```bash
npm run test:ui
```

### Tests en modo debug
```bash
npm run test:debug
```

### Solo tests de API
```bash
npm run test:api
```

### Ver reporte HTML
```bash
npm run test:report
```

## Patrones de Diseño Implementados

### Page Object Model (POM)
- **BasePage**: Clase base abstracta con funcionalidad común
- **LoginPage**: Encapsula interacciones con el formulario de login
- **DashboardPage**: Encapsula interacciones con el dashboard

### Builder Pattern
- **UserBuilder**: Construcción fluida de objetos de usuario para tests

## Arquitectura de Tests

### UI Tests (`tests/login.spec.ts`)
- Login exitoso con credenciales válidas
- Error con credenciales inválidas
- Validación de campos vacíos
- Navegación a "Forgot Password"
- Toggle de "Remember Me"

### API Tests (`tests/api/users.api.spec.ts`)
- GET requests con validación de estructura
- POST requests para crear recursos
- PUT/DELETE requests
- Casos negativos (404, datos inválidos)
- Edge cases (payload vacío, caracteres especiales)

## Mejores Prácticas Implementadas

### Selectores
1. **getByRole()** - Primera opción (accesible)
2. **getByTestId()** - Para casos específicos
3. **getByLabel()** - Para formularios
4. Evitar CSS selectors complejos

### Auto-waiting
- Playwright espera automáticamente por elementos
- Uso de `waitForLoadState()` cuando es necesario
- Screenshots y videos solo en fallos

### Test Isolation
- Cada test es independiente
- Sin dependencias compartidas
- Datos únicos por test (timestamps, builders)

## CI/CD

### GitHub Actions
El proyecto incluye un workflow completo que:
- Se ejecuta en push/PR
- Usa sharding (4 workers paralelos)
- Instala dependencias y navegadores
- Ejecuta tests
- Sube artifacts en caso de fallo:
  - Screenshots
  - Videos
  - Traces
  - Reportes HTML

### Triggers
- **Push** a `main` o `develop`
- **Pull Requests**
- **Schedule**: Diariamente a las 2 AM UTC
- **Manual**: Desde la UI de GitHub Actions

### Ver resultados
Los reportes y artifacts están disponibles en:
```
GitHub → Actions → Workflow run → Artifacts
```

## Reportes

### HTML Report
```bash
npm run test:report
```

### JSON Report
Generado automáticamente en `test-results/results.json`

### JUnit Report
Generado automáticamente en `test-results/results.xml`

## Debugging

### Modo Debug
```bash
npm run test:debug
```

### Codegen (Grabar tests)
```bash
npm run test:codegen
```

### Ver Trace
Cuando un test falla con retry, se genera un trace:
```bash
npx playwright show-trace test-results/.zip
```

## Personalización

### Cambiar navegador
Editar `playwright.config.ts` y comentar/descomentar projects:
```typescript
projects: [
  { name: 'chromium' },
  // { name: 'firefox' },
  // { name: 'webkit' },
]
```

### Cambiar número de workers
```typescript
workers: process.env.CI ? 2 : 4
```

### Cambiar retries
```typescript
retries: process.env.CI ? 2 : 0
```

## Recursos

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Page Object Model](https://playwright.dev/docs/pom)

## Contribuir

1. Fork el proyecto
2. Crear una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## Notas

### API de Prueba
Los tests de API usan [JSONPlaceholder](https://jsonplaceholder.typicode.com/), un API REST falsa para testing y prototipos.

### Aplicación Angular
Los tests de UI asumen una aplicación Angular corriendo en `http://localhost:4200`. Ajusta la `baseURL` en `playwright.config.ts` según tu configuración.

## Troubleshooting

### Los navegadores no se instalan
```bash
npx playwright install --with-deps
```

### Error de permisos en Linux
```bash
sudo npx playwright install-deps
```

### Tests fallan por timeout
Aumentar timeout en `playwright.config.ts`:
```typescript
timeout: 30000, // 30 segundos