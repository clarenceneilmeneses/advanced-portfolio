// =============================================================
// export-old-mongo.js  —  FULL EXPORT pass
//
// Run this against your OLD portfolio's MongoDB to dump EVERYTHING
// (every collection, every document) into a single JSON file.
// Send me that file and I'll write the migration/seed script that
// loads it into the new Supabase schema.
//
// Usage (mongosh):
//   mongosh "<YOUR_OLD_CONNECTION_STRING>" --quiet scripts/export-old-mongo.js > old-portfolio-dump.json
//
// e.g.
//   mongosh "mongodb+srv://user:pass@cluster0.xxxx.mongodb.net/portfolio" --quiet scripts/export-old-mongo.js > old-portfolio-dump.json
//
// The output is one JSON object: { "<collectionName>": [ ...docs ], ... }
// =============================================================

const out = {};
db.getCollectionNames().forEach((name) => {
  out[name] = db.getCollection(name).find().toArray();
});

// EJSON keeps ObjectIds / Dates intact and is valid JSON I can parse
print(EJSON.stringify(out, null, 2));
