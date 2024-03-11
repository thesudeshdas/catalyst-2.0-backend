import { AppConfigurationModule } from './infrastructure/configuration/app-configuration.module';
import { AppConfigurationService } from './infrastructure/configuration/app-configuration.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PowstController } from './powst/powst.controller';
import { PowstModule } from './powst/powst.module';
import { BlogController } from './blog/blog.controller';
import { BlogModule } from './blog/blog.module';
import { WorkService } from './work/work.service';
import { WorkController } from './work/work.controller';
import { WorkModule } from './work/work.module';

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
