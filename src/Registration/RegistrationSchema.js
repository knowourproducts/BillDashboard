import * as Yup from "yup";

export const registrationSchema = Yup.object({
  customerName: Yup.string().min(1).max(50).optional(),
  customerMobile: Yup.string().min(10).max(10).optional(),
  productCode: Yup.string().min(1).max(50).optional(),
  productBrand: Yup.string().min(1).max(20).optional(),
  productCategory: Yup.string().min(1).max(100).optional(),
  mrp: Yup.string().min(1).max(30).optional(),
  size: Yup.string().min(1).max(50).optional(),
  color: Yup.string().min(1).max(50).optional(),
  paymentMode: Yup.string().min(1).max(50).optional(),
  discountRate: Yup.string().min(1).max(50).optional(),
  discountAmount: Yup.string().min(1).max(50).optional(),
});
