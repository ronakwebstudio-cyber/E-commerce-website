import mongoose from "mongoose";

const badgeValues = ["HOT", "SALE", "NEW", null];

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    priceInr: {
      type: Number,
      required: true,
      min: 0
    },
    image: {
      type: String,
      required: true,
      trim: true
    },
    badge: {
      type: String,
      enum: badgeValues,
      default: null
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

productSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform(_doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
  }
});

const Product = mongoose.model("Product", productSchema);

export default Product;
