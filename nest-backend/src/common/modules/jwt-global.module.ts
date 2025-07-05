// src/common/modules/jwt-global.module.ts
import { Global, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule], // for access to env
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("jwtSecret"),
        signOptions: { expiresIn: "1d" },
      }),
    }),
  ],
  exports: [JwtModule],
})
export class JwtGlobalModule {}
