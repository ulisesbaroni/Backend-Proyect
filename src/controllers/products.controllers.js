import { cartService, productService } from "../services/index.js";
import productModel from "../dao/mongo/models/products.js";
import { pid } from "process";
import { generateProducts } from "../mocks/products.mocks.js";
import ErrorService from "../services/ErrorService.js";
import { productErrorIncompleteValues } from "../constants/productsErrors.js";
import EErrors from "../constants/EErrors.js";
import mailService from "../services/mailingService.js";
import { log } from "console";
import DTemplates from "../constants/DTemplates.js";

const getProducts = async (req, res) => {
  const { page = 1 } = req.query;
  const {
    docs,
    totalPages,
    hasPrevPage,
    hasNextpage,
    prevPage,
    nextPage,
    ...rest
  } = await productModel.paginate({}, { page, limit: 3, lean: true });
  const products = docs;
  req.io.emit("updateProducts", products);
  res.send({
    status: "succes",
    payload: products,
    totalPages: totalPages,
    prevPage: prevPage,
    nextPage: nextPage,
    page: page,
    hasPrevPage: hasPrevPage,
    hasNextPage: hasNextpage,
  });
};

const postProduct = async (req, res) => {
  const {
    title,
    description,
    thumbnail = [],
    code,
    price,
    status = true,
    category,
    stock,
    owner,
  } = req.body;

  if (!title || !description || !code || !price || !stock || !category) {
    ErrorService.createError({
      name: "Product Creator error",
      cause: productErrorIncompleteValues({ title, description, code }),
      message: "error intentando agregar Productos",
      code: EErrors.INCOMPLETE_VALUES,
      status: 400,
    });
    req.logger.error(`Product Creator error`);
    return res
      .status(400)
      .send({ status: "error", error: "Incomplete Values" });
  }

  const product = {
    title,
    description,
    thumbnail,
    code,
    price,
    stock,
    status,
    category,
    owner: req.user.role == "admin" ? "admin" : req.user.email,
  };
  console.log(product);
  const result = await productService.createProductService(product);
  const products = await productService.getProductsService();
  req.io.emit("updateProducts", products);

  res.send({ status: "success" });
};

const getProductsById = async (req, res) => {
  const { pid } = req.params;
  const products = await productService.getProductsByIdService({ _id: pid });
  if (!products)
    res.status(404).send({ status: "error", error: "product not found" });
  res.send({ status: "succes", payload: products });
};

const putProduct = async (req, res) => {
  const { pid } = req.params;
  const updateProduct = req.body;
  const result = await productService.updateproductService(pid, updateProduct);
  const products = await productService.getProductsService();
  req.io.emit("updateProducts", products);

  res.sendStatus(201);
};

const deleteProduct = async (req, res) => {
  const { pid } = req.params;

  try {
    const products = await productService.getProductsByIdService({ _id: pid });

    if (products.owner) {
      const mailingService = new mailService();
      const result = await mailingService.sendMail(
        products.owner,
        DTemplates.PRODUCTOELIMINADO,
        { user: req.user }
      );
      console.log(result);
    }

    await productService.deleteProductService(pid);

    req.io.emit("updateProducts", products);

    res.send({ status: "success", message: "Product deleted" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ status: "error", message: "Error deleting product" });
  }
};

const addProduct = async (req, res) => {
  try {
    const pId = req.body.productId;
    const cId = req.user.cart;
    const comprador = req.user.email;
    const products = await productService.getProductsService();
    const selected = products.filter((prod) => prod._id == pId);
    if (comprador == selected[0].owner) {
      console.log();
      res.send({
        status: "error",
        message: `no puedes agregar este producto `,
      });
    } else {
      const result = await cartService.addProductToCartService(pId, cId);
      res.send({
        status: "success",
        message: `llego el id del producto ${pId} `,
        payload: result,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export default {
  getProducts,
  postProduct,
  getProductsById,
  putProduct,
  deleteProduct,
  addProduct,
};
