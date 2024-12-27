import * as Yup from "yup";

export const registrationSchema = Yup.object({
  name: Yup.string().min(2).max(20).required("name is required"),
  mobile: Yup.string().min(10).max(10).required("mobile is required"),
  email: Yup.string().min(2).max(50).optional(),
  identityNo: Yup.string().min(2).max(50).optional(),
  preparingFor: Yup.string().min(2).max(50).optional(),
  type: Yup.string().min(3).required("Please enter seat type"),
  seatNo: Yup.string().min(2).max(50).optional(),
  timeSlot: Yup.string().min(3).required("Please enter time slot"),
  address: Yup.string().min(0).max(50).optional(),
});
