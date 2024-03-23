/* eslint-disable react/jsx-key */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
  _id,

  title: currentTitle,
  description: currentDescription,
  prix: currentPrix,
  images: currentImages,
  category: assignedCategory,
  properties: assignedProperties,
}) {
  const [title, setTitle] = useState(currentTitle || "");
  const [description, setDescription] = useState(currentDescription || "");
  const [category, setCategory] = useState(assignedCategory || "");
  const [productProperties, setProductProperties] = useState(
    assignedProperties || {}
  );
  const [prix, setPrix] = useState(currentPrix || "");
  const [images, setImages] = useState(currentImages || []);
  const [goToProducts, setGoToProducts] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const router = useRouter();
  // Fetch categories in "add new product" page
  useEffect(() => {
    axios
      .get("/api/categories")
      .then((result) => {
        setCategories(result.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);
  async function saveProduct(ev) {
    ev.preventDefault();
    const data = {
      title,
      description,
      prix,
      images,
      category,
      properties: productProperties,
    };
    if (_id) {
      // update
      await axios.put("/api/products", { ...data, _id });
    } else {
      // create
      await axios.post("/api/products", data);
    }
    setGoToProducts(true);
  }

  if (goToProducts) {
    router.push("/products");
  }

  // Upload photos
  async function uploadImages(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }

      const res = await axios.post("/api/upload", data);
      setImages((oldImages) => {
        return [...oldImages, ...res.data.links];
      });
      setIsUploading(false);
    }
  }

  function updateImagesOrder(images) {
    setImages(images);
  }

  function setProductProp(propName, value) {
    setProductProperties((prev) => {
      const newProductProps = { ...prev };
      newProductProps[propName] = value;
      return newProductProps;
    });
  }

  // Find categories parent properties
  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({ _id }) => _id === category);
    propertiesToFill.push(...catInfo.properties);
    while (catInfo?.parent?._id && catInfo.parent._id !== catInfo._id) {
      const parentCat = categories.find(
        ({ _id }) => _id === catInfo?.parent?._id
      );
      propertiesToFill.push(...parentCat.properties);
      catInfo = parentCat;
    }
    // console.log("catInfo:", catInfo);
  }

  return (
    <form onSubmit={saveProduct}>
      <label>Nom</label>
      <input
       
        type="text"
        placeholder="Nom"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
        className="border-transparent focus:outline-none"
      />

      <label >Catégorie</label>
      <select
      
        value={category}
        onChange={(ev) => setCategory(ev.target.value)}
        className="outline-none border-transparent"
      >
        <option value="">Produit non catégorisé</option>
        {categories.length > 0 &&
          categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
      </select>

      {/* Find categories parent properties  */}
      {propertiesToFill.length > 0 &&
        propertiesToFill.map((p) => (
          <div className="">
            <label>{p.name}</label>
            <div>
              <select
                value={productProperties[p.name]}
                onChange={(ev) => setProductProp(p.name, ev.target.value)}
              >
                {p.values.map((v) => (
                  <option value={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>
        ))}

      <label>Photos</label>
      <div className="mb-2 flex flex-wrap gap-1">
        <ReactSortable
          list={images}
          className="flex flex-wrap gap-1"
          setList={updateImagesOrder}
        >
          {!!images?.length &&
            images.map((link) => (
              <div
                key={link}
                className="h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200"
              >
                <img src={link} alt="" className="rounded-lg" />
              </div>
            ))}
        </ReactSortable>
        {isUploading && (
          <div className="h-24 p-1 flex items-center">
            <Spinner />
          </div>
        )}
        <label className="w-24 h-24 cursor-pointer  text-center flex  items-center justify-center gap-1 text-gray-500 rounded-sm bg-white shadow-sm border border-gray-200  hover:opacity-80">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          Upload
          <input type="file" onChange={uploadImages} className="hidden" />
        </label>
      </div>

      <label>Description</label>
      <textarea
        placeholder="Description"
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
      ></textarea>

      <label>Prix (euro)</label>
      <input
        type="number"
        placeholder="prix"
        value={prix}
        onChange={(ev) => setPrix(ev.target.value)}
      />
      <button type="submit" className="btn-primary">
        Enregistrer
      </button>
    </form>
  );
}
