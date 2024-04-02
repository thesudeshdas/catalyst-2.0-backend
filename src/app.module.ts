import { Module } from '@nestjs/common';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';
import { BlogController } from './blog/blog.controller';
import { BlogModule } from './blog/blog.module';
import { AppConfigurationModule } from './infrastructure/configuration/app-configuration.module';
import { AppConfigurationService } from './infrastructure/configuration/app-configuration.service';
import { PowstController } from './powst/powst.controller';
import { PowstModule } from './powst/powst.module';
import { UsersModule } from './users/users.module';
import { WorkController } from './work/work.controller';
import { WorkModule } from './work/work.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    AppConfigurationModule,
    MongooseModule.forRootAsync({
      imports: [AppConfigurationModule],
      inject: [AppConfigurationService],
      useFactory: (appConfigService: AppConfigurationService) => {
        const options: MongooseModuleOptions = {
          uri: appConfigService.connectionString,
        };
        return options;
      },
    }),
    AuthModule,
    UsersModule,
    PowstModule,
    BlogModule,
    WorkModule,
  ],
  controllers: [AppController, PowstController, BlogController, WorkController],
  providers: [AppService],
})
export class AppModule {}
