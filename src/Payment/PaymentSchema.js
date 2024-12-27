import * as Yup from "yup";

export const paymentSchema = Yup.object({
  id: Yup.string().required("User id is required"),
  name: Yup.string().min(2).max(20).required("name is required"),
  mobile: Yup.string().min(10).max(10).required("mobile is required"),
  email: Yup.string().min(2).max(50).optional(),
  month: Yup.string().min(1).required("Please enter payment month"),
  amount: Yup.string().required("amount is required"),
  pendingAmount: Yup.string().optional()
});
