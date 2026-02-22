import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { CountriesService } from '../src/countries/countries.service';
import { ContestsService } from '../src/contests/contests.service';
import { EntriesService } from '../src/entries/entries.service';

// Import your data
import { countries } from './data/countries.data';
import {
  contest2017,
  contest2018,
  contest2019,
  contest2021,
  contest2022,
  contest2023,
  contest2024,
  contest2025,
} from './data/contests.data';
import { entries } from './data/entries.data';

async function migrate() {
  console.log('🚀 Starting Eurovision Migration to MongoDB...\n');

  const app = await NestFactory.createApplicationContext(AppModule);

  const countriesService = app.get(CountriesService);
  const contestsService = app.get(ContestsService);
  const entriesService = app.get(EntriesService);

  try {
    // =====================================================
    // STEP 1: Migrate Countries
    // =====================================================
    console.log('📥 Step 1: Migrating Countries...\n');
    const countryMap = new Map<string, string>(); // code -> MongoDB ID

    for (const country of countries) {
      try {
        const existing = await countriesService.findByCode(country.code);

        if (existing) {
          countryMap.set(country.code, existing._id.toString());
          console.log(
            `⏭️  Country ${country.code} (${country.name}) already exists`,
          );
        } else {
          const created = await countriesService.create({
            code: country.code,
            name: country.name,
            primaryColor: country.primaryColor,
            secondaryColor: country.secondaryColor,
          });
          countryMap.set(country.code, created._id.toString());
          console.log(`✅ Created country: ${country.code} (${country.name})`);
        }
      } catch (error) {
        console.error(`❌ Error with country ${country.code}:`, error.message);
      }
    }

    console.log(`\n✅ Completed: ${countryMap.size} countries processed\n`);

    // =====================================================
    // STEP 2: Migrate Contests
    // =====================================================
    console.log('📥 Step 2: Migrating Contests...\n');
    const contestMap = new Map<number, string>(); // year -> MongoDB ID

    const contests = [
      contest2017,
      contest2018,
      contest2019,
      contest2021,
      contest2022,
      contest2023,
      contest2024,
      contest2025,
    ];

    for (const contest of contests) {
      try {
        const existingContest = await contestsService.findByYear(contest.year);

        if (existingContest) {
          contestMap.set(contest.year, existingContest._id.toString());
          console.log(`⏭️  Contest ${contest.year} already exists`);
        } else {
          const hostCountryId = countryMap.get(contest.hostCountry.code);

          if (!hostCountryId) {
            console.error(
              `❌ Host country not found for contest ${contest.year}: ${contest.hostCountry.code}`,
            );
            continue;
          }

          const created = await contestsService.create({
            year: contest.year,
            hostCountry: hostCountryId,
            colours: contest.colours,
            entries: [], // Will be populated later
          });

          contestMap.set(contest.year, created._id.toString());
          console.log(
            `✅ Created contest: ${contest.year} (Host: ${contest.hostCountry.name})`,
          );
        }
      } catch (error) {
        if (error.status === 404) {
          // Contest doesn't exist, that's expected
          try {
            const hostCountryId = countryMap.get(contest.hostCountry.code);

            if (!hostCountryId) {
              console.error(
                `❌ Host country not found for contest ${contest.year}: ${contest.hostCountry.code}`,
              );
              continue;
            }

            const created = await contestsService.create({
              year: contest.year,
              hostCountry: hostCountryId,
              colours: contest.colours,
              entries: [],
            });

            contestMap.set(contest.year, created._id.toString());
            console.log(
              `✅ Created contest: ${contest.year} (Host: ${contest.hostCountry.name})`,
            );
          } catch (createError) {
            console.error(
              `❌ Error creating contest ${contest.year}:`,
              createError.message,
            );
          }
        } else {
          console.error(
            `❌ Error with contest ${contest.year}:`,
            error.message,
          );
        }
      }
    }

    console.log(`\n✅ Completed: ${contestMap.size} contests processed\n`);

    // =====================================================
    // STEP 3: Migrate Entries
    // =====================================================
    console.log('📥 Step 3: Migrating Entries...\n');
    let successCount = 0;
    let skipCount = 0;
    let failCount = 0;

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const countryId = countryMap.get(entry.country.code);
      const contestId = contestMap.get(entry.year);

      if (!countryId) {
        console.error(
          `❌ [${i + 1}/${entries.length}] Country not found for ${entry.artist}: ${entry.country.code}`,
        );
        failCount++;
        continue;
      }

      if (!contestId) {
        console.error(
          `❌ [${i + 1}/${entries.length}] Contest not found for ${entry.artist}: ${entry.year}`,
        );
        failCount++;
        continue;
      }

      try {
        const created = await entriesService.create({
          country: countryId,
          contest: contestId,
          year: entry.year,
          place: entry.place,
          artist: entry.artist,
          title: entry.title,
          link: entry.link || '',
          energyRating: entry.rating.energy,
          stagingRating: entry.rating.staging,
          studioRating: entry.rating.studio,
          funRating: entry.rating.fun,
          vocalsRating: entry.rating.vocals,
        });

        // Add entry to contest
        await contestsService.addEntryToContest(
          entry.year,
          created._id.toString(),
        );

        console.log(
          `✅ [${i + 1}/${entries.length}] ${entry.artist} - ${entry.title} (${entry.year})`,
        );
        successCount++;
      } catch (error) {
        if (error.code === 11000) {
          // Duplicate key error - entry already exists
          console.log(
            `⏭️  [${i + 1}/${entries.length}] ${entry.artist} - ${entry.title} (${entry.year}) already exists`,
          );
          skipCount++;
        } else {
          console.error(
            `❌ [${i + 1}/${entries.length}] Failed to migrate ${entry.artist}:`,
            error.message,
          );
          failCount++;
        }
      }
    }

    // =====================================================
    // SUMMARY
    // =====================================================
    console.log('\n======================================');
    console.log('🎉 Migration Complete!');
    console.log('======================================');
    console.log(`📊 Countries: ${countryMap.size} processed`);
    console.log(`📊 Contests: ${contestMap.size} processed`);
    console.log(`📊 Entries:`);
    console.log(`   ✅ Successfully migrated: ${successCount}`);
    console.log(`   ⏭️  Skipped (already exist): ${skipCount}`);
    console.log(`   ❌ Failed: ${failCount}`);
    console.log('======================================\n');

    await app.close();
    process.exit(0);
  } catch (error) {
    console.error('💥 Fatal error during migration:', error);
    await app.close();
    process.exit(1);
  }
}

// Run migration
migrate();
