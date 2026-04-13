import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import { createApp } from "../app.js";
import products from "../data/products.js";
import { connectDB, disconnectDB } from "../lib/db.js";
import Product from "../models/Product.js";

let mongod;
let app;

before(async () => {
  process.env.NODE_ENV = "test";
  mongod = await MongoMemoryServer.create();
  await connectDB(mongod.getUri());
  app = createApp({ corsOrigin: "*" });
});

beforeEach(async () => {
  await Product.deleteMany({});
  await Product.insertMany(products);
});

after(async () => {
  await disconnectDB();
  if (mongod) {
    await mongod.stop();
  }
});

describe("GET /api/health", () => {
  it("returns service status", async () => {
    const response = await request(app).get("/api/health").expect(200);
    assert.equal(response.body.status, "ok");
    assert.ok(response.body.timestamp);
  });
});

describe("GET /api/products", () => {
  it("returns items with the expected API contract", async () => {
    const response = await request(app).get("/api/products").expect(200);

    assert.ok(Array.isArray(response.body.items));
    assert.equal(response.body.items.length, products.length);

    const item = response.body.items[0];
    const contractKeys = [
      "id",
      "name",
      "slug",
      "description",
      "category",
      "priceInr",
      "image",
      "badge",
      "stock",
      "featured"
    ];

    contractKeys.forEach((key) => assert.ok(Object.hasOwn(item, key)));
  });

  it("supports search and category filters", async () => {
    const response = await request(app)
      .get("/api/products")
      .query({ search: "wireless", category: "Audio" })
      .expect(200);

    assert.ok(response.body.items.length >= 1);
    const slugs = response.body.items.map((item) => item.slug);
    assert.ok(slugs.includes("wireless-headphones"));
  });

  it("supports price_desc sorting", async () => {
    const response = await request(app)
      .get("/api/products")
      .query({ sort: "price_desc" })
      .expect(200);

    const [first, second] = response.body.items;
    assert.ok(first.priceInr >= second.priceInr);
  });
});

describe("GET /api/products/:slug", () => {
  it("returns a single product by slug", async () => {
    const response = await request(app)
      .get("/api/products/wireless-headphones")
      .expect(200);

    assert.equal(response.body.item.slug, "wireless-headphones");
  });

  it("returns 404 when slug is unknown", async () => {
    const response = await request(app)
      .get("/api/products/not-a-real-product")
      .expect(404);

    assert.equal(response.body.message, "Product not found");
  });
});
