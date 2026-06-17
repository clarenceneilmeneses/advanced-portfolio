// =============================================================
// inspect-old-mongo.js  —  DISCOVERY pass
//
// Run this against your OLD portfolio's MongoDB. It prints every
// collection, how many docs it has, and one sample document each,
// so I can see the field names/shapes and map them to the new
// Supabase schema. Paste the whole output back to me.
//
// Usage (mongosh):
//   mongosh "<YOUR_OLD_CONNECTION_STRING>" scripts/inspect-old-mongo.js
//
// e.g.
//   mongosh "mongodb+srv://user:pass@cluster0.xxxx.mongodb.net/portfolio" scripts/inspect-old-mongo.js
// =============================================================

const collections = db.getCollectionNames();

print("=== DATABASE: " + db.getName() + " ===");
print("Collections (" + collections.length + "): " + collections.join(", "));
print("");

collections.forEach((name) => {
  const coll = db.getCollection(name);
  const count = coll.countDocuments();
  print("------------------------------------------------------------");
  print("COLLECTION: " + name + "   (" + count + " docs)");
  print("------------------------------------------------------------");
  // up to 2 sample docs so I can see the field shapes
  coll.find().limit(2).forEach((doc) => {
    print(JSON.stringify(doc, null, 2));
  });
  print("");
});
