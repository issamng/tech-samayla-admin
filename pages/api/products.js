import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
  await mongooseConnect();
  const { method } = req;
  await isAdminRequest(req, res);

  if (method === "GET") {
    if (req.query?.id) {
      res.json(await Product.findOne({ _id: req.query.id }));
    } else {
      res.json(await Product.find());
    }
  }

  if (method === "POST") {
    const { title, description, prix, images, category, properties } = req.body;
    const productDoc = await Product.create({
      title,
      description,
      prix,
      images,
      category,
      properties,
    });
    res.json(productDoc);
  }

  if (method === "PUT") {
    const { title, description, prix, images, category, properties, _id } =
      req.body;

    await Product.updateOne(
      { _id },
      { title, description, prix, images, category, properties }
    );
    res.json(true);
  }

  if (method === "DELETE") {
    if (req.query?.id) {
      await Product.deleteOne({ _id: req.query?.id });
      res.json(true);
    }
  }
}
