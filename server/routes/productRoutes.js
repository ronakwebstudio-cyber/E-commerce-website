import { Router } from "express";
import Product from "../models/Product.js";

const productRoutes = Router();

function getSortOrder(sort) {
  switch (sort) {
    case "price_asc":
      return { priceInr: 1 };
    case "price_desc":
      return { priceInr: -1 };
    case "newest":
    default:
      return { createdAt: -1 };
  }
}

function formatProduct(doc) {
  return {
    id: doc._id.toString(),
    name: doc.name,
    slug: doc.slug,
    description: doc.description,
    category: doc.category,
    priceInr: doc.priceInr,
    image: doc.image,
    badge: doc.badge,
    stock: doc.stock,
    featured: doc.featured,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  };
}

productRoutes.get("/", async (req, res, next) => {
  try {
    const { search = "", category = "all", sort = "newest" } = req.query;
    const filter = {};

    if (search.trim()) {
      filter.$or = [
        { name: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } }
      ];
    }

    if (category !== "all") {
      filter.category = category;
    }

    const items = await Product.find(filter).sort(getSortOrder(sort)).lean();

    res.json({
      items: items.map(formatProduct)
    });
  } catch (error) {
    next(error);
  }
});

productRoutes.get("/:slug", async (req, res, next) => {
  try {
    const item = await Product.findOne({ slug: req.params.slug }).lean();

    if (!item) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json({ item: formatProduct(item) });
  } catch (error) {
    next(error);
  }
});

export default productRoutes;
