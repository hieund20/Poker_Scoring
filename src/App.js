import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ToastContainer } from "react-toastify";
import "./App.scss";
import { NewTurnAddModal } from "./components/Modals/AddNewTurn";
import { CalculateMoneyModal } from "./components/Modals/CalculateMoney";
import { enoughPlayerNotify, sameNameNotify } from "./helper/toastMessage";
import { AddUserSchema } from "./schemas/mainSchema";

function App() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(AddUserSchema),
  });

  const [tableHeads, setTableHeads] = useState([]);
  const [isOpenAddNewTurnModal, setOpenAddNewTurnModal] = useState(false);
  const [isOpenCalculateMoneyModal, setOpenCalculateMoneyModal] =
    useState(false);
  const [scoreRows, setScoreRows] = useState([[]]);

  const onAddPlayer = (data) => {
    // if (tableHeads.length === 4) {
    //   enoughPlayerNotify();
    //   return;
    // }

    if (tableHeads.includes(data?.name)) {
      sameNameNotify();
      return;
    }

    const tableHeadsClone = [...tableHeads];
    tableHeadsClone.push(data?.name);
    setTableHeads(tableHeadsClone);
    reset({ name: "" });
  };

  const handleClickOpenAddNewTurnModal = () => {
    setOpenAddNewTurnModal(true);
  };

  const handleCloseOpenAddNewTurnModal = () => {
    setOpenAddNewTurnModal(false);
  };

  const handleClickOpenCalculateModal = () => {
    setOpenCalculateMoneyModal(true);
  };

  const handleCloseCalculateMoneyModal = () => {
    setOpenCalculateMoneyModal(false);
  };

  const calculateColumnTotals = () => {
    if (scoreRows.length === 0) return [];

    let columnCount = scoreRows[1]?.length || 0;
    let totals = new Array(columnCount).fill(0);

    scoreRows.forEach((row) => {
      row.forEach((score, colIndex) => {
        let value = Number(score?.score) || 0;
        totals[colIndex] += value;
      });
    });

    return totals;
  };

  const onStartNewGame = () => {
    setScoreRows([[]]);
    setTableHeads([]);
    reset({});
  };

  return (
    <div className="App">
      <Container maxWidth="xl" sx={{ marginY: "32px" }}>
        <Box component="section">
          <Typography variant="h5" sx={{ marginY: "48px" }} fontWeight={"bold"}>
            Tính điểm Tiến lên miền nam ♠️♥️♦️♣️
          </Typography>

          <Box
            sx={{
              display: "flex",
              // alignItems: "center",
              justifyContent: "space-between",
              gap: "8px",
              marginY: "16px",
            }}
          >
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  id="outlined-basic"
                  label="Tên người chơi"
                  variant="outlined"
                  sx={{ width: "100%", height: "100%" }}
                  error={errors?.name}
                  helperText={errors?.name?.message}
                />
              )}
            />
            <Button
              variant="contained"
              sx={{ textTransform: "none", height: "100%" }}
              onClick={handleSubmit(onAddPlayer)}
            >
              Thêm người chơi
            </Button>
          </Box>

          <Box
            sx={{
              marginY: "16px",
            }}
          >
            <Button
              variant="outlined"
              sx={{ textTransform: "none", width: "100%" }}
              onClick={() => handleClickOpenAddNewTurnModal()}
              disabled={tableHeads.length === 0}
            >
              Thêm ván mới
            </Button>
          </Box>

          <Box>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    {tableHeads.map((item, index) => (
                      <TableCell align="center" key={index} width={"80%"}>
                        <Typography variant="h7" fontWeight={"bold"}>
                          {item}
                        </Typography>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {scoreRows.map((row, rowIndex) => (
                    <TableRow
                      key={rowIndex}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      {row.map((score, colIndex) => (
                        <TableCell align="center" key={colIndex}>
                          {score?.score}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    {calculateColumnTotals().map((total, colIndex) => (
                      <TableCell align="center" key={colIndex}>
                        <Typography variant="h6" fontWeight={"bold"}>
                          {total}
                        </Typography>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </Box>

          <Box
            sx={{
              marginY: "16px",
              display: "flex",
              gap: "8px",
            }}
          >
            <Button
              variant="outlined"
              sx={{ textTransform: "none", width: "100%" }}
              onClick={() => handleClickOpenCalculateModal()}
              disabled={tableHeads.length === 0 || scoreRows.length === 1}
            >
              Tính tiền
            </Button>
            <Button
              variant="outlined"
              sx={{ textTransform: "none", width: "100%" }}
              onClick={() => onStartNewGame()}
            >
              Bắt đầu ván chơi mới
            </Button>
          </Box>
        </Box>

        <Box className="footer">
          <Typography variant="h6" sx={{ marginY: "48px" }}>
            Developed by{" "}
            <a
              href="https://github.com/hieund20"
              target="_blank"
              rel="noreferrer"
            >
              Hieu Nguyen
            </a>
          </Typography>
        </Box>
      </Container>

      <NewTurnAddModal
        open={isOpenAddNewTurnModal}
        handleClose={handleCloseOpenAddNewTurnModal}
        players={tableHeads}
        scores={setScoreRows}
      />

      <CalculateMoneyModal
        open={isOpenCalculateMoneyModal}
        handleClose={handleCloseCalculateMoneyModal}
        scoreRows={scoreRows}
        players={tableHeads}
      />

      <ToastContainer />
    </div>
  );
}

export default App;
