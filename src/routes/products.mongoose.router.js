import { Router } from "express";
import productsControllers from "../controllers/products.controllers.js";
import { passportCall } from "../utils.js";
import { authRoles } from "../middlewares/auth.js";

const router = Router();

export default router;

router.get("/", productsControllers.getProducts);

router.post(
  "/",
  passportCall("jwt"),
  authRoles(["admin", "premium"]),
  productsControllers.postProduct
);

router.post(
  "/addProduct",
  passportCall("jwt"),
  authRoles(["usuario", "premium", "admin"]),
  productsControllers.addProduct
);

router.get("/:pid", productsControllers.getProductsById);

router.put("/:pid", productsControllers.putProduct);

router.delete("/:pid", productsControllers.deleteProduct);
