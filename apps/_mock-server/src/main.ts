import { VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

import { AppModule } from './app.module'

const PORT = process.env.PORT || 4000

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors()

  // Enable versioning
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
  })

  const config = new DocumentBuilder()
    .setTitle('Mock Server API')
    .setDescription('Mock API for workspace applications')
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  await app.listen(PORT)
}

bootstrap()
