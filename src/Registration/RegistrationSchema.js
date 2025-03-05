import * as Yup from "yup";

export const registrationSchema = Yup.object({
  customerName: Yup.string().min(1).max(50).required("name is required"),
  customerMobile: Yup.string().min(10).max(10).required("mobile number is required"),
  productCode: Yup.string().min(1).max(50).optional(),
  productBrand: Yup.string().min(1).max(20).required("brand name is required"),
  productCategory: Yup.string().min(1).max(20).required("category is required"),
  mrp: Yup.string().min(1).max(30).required("mrp is required"),
  size: Yup.string().min(1).max(50).optional(),
  color: Yup.string().min(1).max(50).optional(),
  paymentMode: Yup.string().min(1).max(50).optional(),
  discountRate: Yup.string().min(1).max(50).optional(),
  discountAmount: Yup.string().min(1).max(50).optional(),
});
