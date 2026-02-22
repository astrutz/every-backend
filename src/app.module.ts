import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CountriesModule } from './countries/countries.module';
import { ContestsModule } from './contests/contests.module';
import { EntriesModule } from './entries/entries.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_URL}`,
    ),
    CountriesModule,
    ContestsModule,
    EntriesModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
