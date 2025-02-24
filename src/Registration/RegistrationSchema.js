import * as Yup from "yup";

export const registrationSchema = Yup.object({
  name: Yup.string().min(2).max(20).required("name is required"),
  mobile: Yup.string().min(10).max(10).required("mobile is required"),
  email: Yup.string().min(2).max(50).optional(),
  productId: Yup.string().min(2).max(50).optional(),
  paymentMode: Yup.string().min(2).max(50).optional(),
  productDetails: Yup.string().min(2).max(50).optional(),
  soldBy: Yup.string().min(2).max(50).optional(),
  address: Yup.string().min(0).max(50).optional(),
});
