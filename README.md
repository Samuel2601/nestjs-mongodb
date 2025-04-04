<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# Arquitectura Clean con RBAC para NestJS usando MongoDB

## Estructura de Carpetas

```
src/
├── domain/                             # Capa de dominio
│   ├── entities/                       # Entidades de negocio
│   │   ├── administration/             # Entidades para administración/RBAC
│   │   │   ├── user.entity.ts          # Usuario del sistema
│   │   │   ├── role.entity.ts          # Rol
│   │   │   ├── permission.entity.ts    # Permiso
│   │   ├── general/                    # Entidades generales
│   │   │   ├── person.entity.ts        # Persona (información personal)
│   │   │   ├── business.entity.ts      # Empresa
│   │   └── ...
│   ├── repositories/                   # Interfaces de repositorios
│   │   ├── administration/
│   │   │   ├── user.repository.ts
│   │   │   ├── role.repository.ts
│   │   │   ├── permission.repository.ts
│   │   ├── general/
│   │   │   ├── person.repository.ts
│   │   │   ├── business.repository.ts
│   │   └── ...
│   └── services/                       # Servicios de dominio
│       └── ...
│
├── application/                        # Capa de aplicación
│   ├── dtos/                           # DTOs
│   │   ├── administration/
│   │   │   ├── user/
│   │   │   ├── role/
│   │   │   ├── permission/
│   │   ├── general/
│   │   │   ├── person/
│   │   │   ├── business/
│   │   └── ...
│   ├── mappers/                        # Mappers
│   │   ├── administration/
│   │   │   ├── user.mapper.ts
│   │   │   ├── role.mapper.ts
│   │   │   ├── permission.mapper.ts
│   │   ├── general/
│   │   │   ├── person.mapper.ts
│   │   │   ├── business.mapper.ts
│   │   └── ...
│   ├── use-cases/                      # Casos de uso
│   │   ├── administration/
│   │   │   ├── users/
│   │   │   ├── roles/
│   │   │   ├── permissions/
│   │   ├── general/
│   │   │   ├── persons/
│   │   │   ├── businesses/
│   │   └── ...
│   └── ports/                          # Puertos
│       └── ...
│
├── infrastructure/                     # Capa de infraestructura
│   ├── database/                       # Configuración de MongoDB
│   │   ├── mongodb/
│   │   │   ├── schemas/               # Esquemas de Mongoose
│   │   │   │   ├── administration/
│   │   │   │   │   ├── user.schema.ts
│   │   │   │   │   ├── role.schema.ts
│   │   │   │   │   ├── permission.schema.ts
│   │   │   │   ├── general/
│   │   │   │   │   ├── person.schema.ts
│   │   │   │   │   ├── business.schema.ts
│   │   │   ├── seeds/                # Datos iniciales
│   │   │   ├── migration/            # Scripts de migración
│   │   │   ├── connections/          # Configuración de conexiones
│   │   │   │   ├── mongodb.connection.ts
│   │   │   ├── factories/            # Factories para testing
│   │   ├── unit-of-work.ts          # Patrón Unit of Work para transacciones
│   │   ├── database.module.ts       # Módulo de base de datos
│   │   └── database.service.ts      # Servicio para operaciones comunes
│   ├── repositories/                # Implementaciones de repositorios
│   │   ├── mongodb/
│   │   │   ├── administration/
│   │   │   │   ├── user.repository.impl.ts
│   │   │   │   ├── role.repository.impl.ts
│   │   │   │   ├── permission.repository.impl.ts
│   │   │   ├── general/
│   │   │   │   ├── person.repository.impl.ts
│   │   │   │   ├── business.repository.impl.ts
│   │   │   ├── base/
│   │   │   │   ├── base.repository.ts  # Repositorio base con operaciones comunes
│   │   └── ...
│   ├── services/                     # Implementaciones de servicios
│   │   ├── auth/
│   │   │   ├── strategies/
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   ├── google.strategy.ts
│   │   │   │   ├── facebook.strategy.ts
│   │   │   │   ├── apple.strategy.ts
│   │   │   │   └── microsoft.strategy.ts
│   │   ├── notifications/
│   │   │   ├── email/
│   │   │   ├── push/
│   │   ├── storage/
│   │   │   ├── local-storage.service.ts
│   │   │   ├── s3-storage.service.ts
│   │   ├── cache/
│   │   │   ├── redis-cache.service.ts
│   │   ├── i18n/
│   │   │   ├── messages/
│   │   │   │   ├── en.json
│   │   │   │   ├── es.json
│   │   ├── ai/
│   │   │   ├── openai.service.ts
│   │   │   ├── anthropic.service.ts
│   │   ├── messaging/
│   │   │   ├── whatsapp.service.ts
│   │   │   ├── telegram.service.ts
│   │   └── ...
│   ├── jobs/                        # Tareas programadas
│   │   ├── bull/
│   │   │   ├── processors/
│   │   │   ├── queues/
│   │   │   ├── jobs/
│   │   │   │   ├── backup.job.ts
│   │   └── ...
│   └── ...
│
├── presentation/                     # Capa de presentación
│   ├── controllers/                  # Controladores REST
│   │   ├── administration/
│   │   │   ├── users.controller.ts
│   │   │   ├── roles.controller.ts
│   │   │   ├── permissions.controller.ts
│   │   ├── general/
│   │   │   ├── persons.controller.ts
│   │   │   ├── businesses.controller.ts
│   │   ├── auth.controller.ts
│   │   └── ...
│   ├── middlewares/                  # Middlewares
│   │   ├── logging.middleware.ts
│   │   ├── request-tracker.middleware.ts
│   ├── filters/                      # Filtros de excepciones
│   │   ├── http-exception.filter.ts
│   ├── guards/                       # Guards de seguridad
│   │   ├── auth/
│   │   │   ├── auth.guard.ts
│   │   │   ├── jwt-auth.guard.ts
│   │   ├── roles.guard.ts
│   │   ├── permissions.guard.ts
│   ├── interceptors/                 # Interceptores
│   │   ├── transform.interceptor.ts
│   │   ├── cache.interceptor.ts
│   │   ├── timeout.interceptor.ts
│   ├── decorators/                   # Decoradores personalizados
│   │   ├── roles.decorator.ts
│   │   ├── permissions.decorator.ts
│   │   ├── user.decorator.ts
│   └── gateways/                     # Gateways WebSocket
│       ├── notifications.gateway.ts
│
├── config/                           # Configuración de la aplicación
│   ├── env/
│   │   ├── env.validation.ts
│   ├── database.config.ts           # Config MongoDB
│   ├── auth.config.ts
│   ├── redis.config.ts
│   ├── jwt.config.ts
│   ├── sentry.config.ts
│   ├── i18n.config.ts
│
├── modules/                          # Módulos NestJS
│   ├── administration/               # Módulo de administración (RBAC)
│   │   ├── users/
│   │   │   ├── users.module.ts
│   │   ├── roles/
│   │   │   ├── roles.module.ts
│   │   ├── permissions/
│   │   │   ├── permissions.module.ts
│   │   └── administration.module.ts
│   ├── general/                      # Módulo de entidades generales
│   │   ├── persons/
│   │   │   ├── persons.module.ts
│   │   ├── businesses/
│   │   │   ├── businesses.module.ts
│   │   └── general.module.ts
│   ├── auth/                         # Módulo de autenticación
│   │   ├── auth.module.ts
│   ├── webhooks/                     # Módulo de webhooks
│   │   ├── webhooks.module.ts
│   ├── ai/                           # Módulo de IA
│   │   ├── ai.module.ts
│   ├── storage/                      # Módulo de almacenamiento
│   │   ├── storage.module.ts
│   ├── jobs/                         # Módulo de tareas
│   │   ├── jobs.module.ts
│   ├── i18n/                         # Módulo de internacionalización
│   │   ├── i18n.module.ts
│   ├── websockets/                   # Módulo de WebSockets
│   │   ├── websockets.module.ts
│   ├── monitoring/                   # Módulo de monitoreo
│   │   ├── monitoring.module.ts
│   │   ├── health/
│   │   │   ├── health.controller.ts
│   │   │   ├── health.service.ts
│   │   ├── metrics/
│   │   │   ├── metrics.controller.ts
│   │   │   ├── metrics.service.ts
│
├── common/                           # Clases y utilidades comunes
│   ├── exceptions/                   # Excepciones personalizadas
│   │   ├── business-exception.ts
│   │   ├── validation-exception.ts
│   ├── validators/                   # Validadores personalizados
│   │   ├── is-valid-person.validator.ts
│   ├── enums/                        # Enumeraciones
│   │   ├── role.enum.ts
│   │   ├── permission.enum.ts
│   ├── constants/                    # Constantes
│   │   ├── error-messages.ts
│   │   ├── pagination.ts
│   ├── types/                        # Tipos personalizados
│   │   ├── pagination.type.ts
│
├── shared/                           # Código compartido entre módulos
│   ├── utils/                        # Utilidades generales
│   │   ├── string.utils.ts
│   │   ├── date.utils.ts
│   ├── middleware/                   # Middlewares compartidos
│   │   ├── logger.middleware.ts
│
├── app.module.ts                     # Módulo principal
└── main.ts                           # Punto de entrada
```
