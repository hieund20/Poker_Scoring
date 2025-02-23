import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

export const CalculateMoneyModal = ({
  open,
  handleClose,
  scoreRows,
  players,
}) => {
  const [moneyPerPoint, setMoneyPerPoint] = useState(1000);

  const calculatePayments = (
    scoreRows,
    players,
    pointValue = moneyPerPoint
  ) => {
    if (scoreRows.length === 0) return [];

    let columnTotals = new Array(players.length).fill(0);

    scoreRows.forEach((row) => {
      row.forEach((score, colIndex) => {
        let value = Number(score?.score) || 0; // Convert to number, default 0
        columnTotals[colIndex] += value;
      });
    });

    let maxScore = Math.max(...columnTotals);
    let winnerIndex = columnTotals.indexOf(maxScore);
    let winnerName = players[winnerIndex];

    let payments = players.map((player, index) => {
      let amount = (maxScore - columnTotals[index]) * pointValue;
      return {
        name: player,
        score: columnTotals[index],
        amount: index === winnerIndex ? `+ ${amount}đ` : `- ${amount}đ`,
      };
    });

    return { payments, winner: { name: winnerName, maxScore } };
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
      <DialogTitle>Tính tiền</DialogTitle>

      <DialogContent>
        <Box sx={{ marginY: "16px" }}>
          <TextField
            id="outlined-basic"
            label="Nhập số tiền (vnđ) tương ứng với 1 điểm"
            variant="outlined"
            sx={{ width: "100%", height: "100%" }}
            onChange={(e) => setMoneyPerPoint(e.target.value)}
          />
        </Box>

        <DialogContentText>
          <Typography variant="h6" fontWeight={"bold"}>
            Người chơi có điểm số cao nhất là{" "}
            {calculatePayments(scoreRows, players, moneyPerPoint)?.winner?.name}{" "}
            với số điểm{" "}
            {
              calculatePayments(scoreRows, players, moneyPerPoint)?.winner
                ?.maxScore
            }
          </Typography>

          <Box
            sx={{
              border: "1px dashed black",
              borderRadius: "4px",
              padding: "8px",
              marginY: "16px",
            }}
          >
            <Typography variant="h6">
              Công thức tiền tiền: (Điểm người chơi cao nhất - điểm của người
              chơi đó) * Số tiền tương ứng với 1 điểm
            </Typography>
          </Box>

          <Typography variant="h6" fontWeight={"bold"}>
            Số tiền các người chơi phải trả:
          </Typography>
          <Typography>
            {calculatePayments(
              scoreRows,
              players,
              moneyPerPoint
            )?.payments?.map((item, index) => (
              <Box key={index} sx={{ padding: "8px" }}>
                <Typography variant="h6">Người chơi: {item?.name}</Typography>
                <Typography variant="h6">Điểm số: {item?.score}</Typography>
                <Typography variant="h6">Tiền: {item?.amount}</Typography>
                <Divider />
              </Box>
            ))}
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};
