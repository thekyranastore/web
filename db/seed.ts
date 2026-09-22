import { db } from "./index";
import { shopCategories } from "./schema";

const categories = [
  { name: "Grocery", slug: "grocery" },
  { name: "Fashion", slug: "fashion" },
  { name: "Electronics", slug: "electronics" },
  { name: "Home & Kitchen", slug: "home-kitchen" },
  { name: "Beauty", slug: "beauty" },
  { name: "Stationery", slug: "stationery" },
  { name: "Pharmacy", slug: "pharmacy" },
  { name: "Other", slug: "other" },
];

async function main() {
  await db.insert(shopCategories).values(categories).onConflictDoNothing();
  console.log(`Seeded ${categories.length} shop categories`);
}

main();
