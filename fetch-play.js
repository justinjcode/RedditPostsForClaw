const mod = require('google-play-scraper');
const gplay = mod.default || mod;
const fs = require('fs');

(async () => {
  fs.mkdirSync('data', { recursive: true });
  for (const cc of ['us', 'jp', 'kr']) {
    try {
      const apps = await gplay.list({
        collection: 'TOP_FREE',
        category: 'APPLICATION',
        country: cc,
        num: 60,
      });
      const out = {
        updated_at: new Date().toISOString(),
        collection: 'TOP_FREE',
        country: cc,
        apps: apps.map((a, i) => ({
          rank: i + 1,
          appId: a.appId,
          title: a.title,
          developer: a.developer,
          score: a.score,
          installs: a.installs,
        })),
      };
      fs.writeFileSync(`data/play-${cc}-top_free.json`, JSON.stringify(out, null, 1));
      console.log(cc, 'ok', apps.length);
    } catch (e) {
      console.error(cc, 'failed', e.message);
      process.exitCode = 1;
    }
  }
})();
