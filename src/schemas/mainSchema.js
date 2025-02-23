import * as yup from "yup";

export const AddUserSchema = yup
  .object()
  .shape({
    name: yup.string().required("Tên người chơi bắt buộc điền!"),
  })
  .required();

export const AddNewTurnSchema = yup.object().shape({
  scores: yup.array().of(
    yup.object().shape({
      //   playerName: yup.string().required(),
      score: yup
        .number()
        .typeError("Điểm phải là số")
        .required("Điểm bắt buộc điền!"),
    })
  ),
});
