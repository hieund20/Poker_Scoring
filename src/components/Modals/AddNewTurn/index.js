import { yupResolver } from "@hookform/resolvers/yup";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { AddNewTurnSchema } from "../../../schemas/mainSchema";

export const NewTurnAddModal = ({ open, handleClose, players, scores }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(AddNewTurnSchema),
    defaultValues: {
      scores: players?.map(() => ({ score: "" })) || [],
    },
  });

  const onSave = (data) => {
    scores((prev) => [...prev, data?.scores]);
    handleClose();
    reset({});
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            handleClose();
          },
        },
      }}
    >
      <DialogTitle>Nhập điểm ván mới</DialogTitle>
      <DialogContent>
        <DialogContentText>Nhập điểm cho ván mới của bạn!</DialogContentText>
        <Box sx={{ marginY: "16px" }}>
          {players?.map((player, index) => (
            <Box sx={{ marginY: "16px" }} key={index}>
              <Controller
                name={`scores[${index}].score`} // Ensure scores are mapped correctly
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    id={`score-${index}`}
                    label={player}
                    variant="outlined"
                    sx={{ width: "100%", height: "100%" }}
                    error={!!errors?.scores?.[index]?.score}
                    helperText={errors?.scores?.[index]?.score?.message}
                  />
                )}
              />
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Hủy bỏ</Button>
        <Button onClick={handleSubmit(onSave)}>Lưu</Button>
      </DialogActions>
    </Dialog>
  );
};
