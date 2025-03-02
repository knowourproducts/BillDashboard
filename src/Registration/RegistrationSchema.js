import * as Yup from "yup";

export const registrationSchema = Yup.object({
  productCode: Yup.string().min(1).max(50).optional(),
  productBrand: Yup.string().min(1).max(20).required("brand name is required"),
  mrp: Yup.string().min(1).max(30).required("mrp is required"),
  size: Yup.string().min(1).max(50).optional(),
  color: Yup.string().min(1).max(50).optional(),
  costPrice: Yup.string().min(1).max(50).optional(),
  paymentMode: Yup.string().min(1).max(50).optional(),
});
