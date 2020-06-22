/*jshint esversion: 6 */
import React, { useState, useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import { AlarmOutlined, PersonOutline } from "@material-ui/icons";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import logo from "./assets/images/assets_logo.png";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";

import accents from "remove-accents";

import moment from "moment";
import "./App.css";

const useStyles = makeStyles((theme) => ({
  main: {
    backgroundColor: "#1C2F57",
    minHeight: "100vh",
  },
  margin: {
    margin: theme.spacing(1),
    backgroundColor: "white",
    width: "400px",
    maxWidth: "100vh",
  },
  icon: {
    marginRight: theme.spacing(2),
  },
  card: {
    fontWeight: "bold",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  sucursalOnline: {
    backgroundColor: "#2D4F83",
    color: "#FCFCFD",
  },
  sucursalOffline: {
    backgroundColor: "rgb(226, 226, 226)",
    color: "rgb(139, 139, 139)",
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  detalleOnline: {
    backgroundColor: "rgb(0, 184, 134)",
    color: "white",
  },
  detalleOffline: {
    backgroundColor: "#8B8B8B",
    color: "white",
  },
  center: {
    margin: "auto",
  },
  search: {
    backgroundColor: "#2D4F83",
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  AppBar: {
    backgroundColor: "#1C2F57",
  },
}));

const sumPerson = (lines) => {
  const sumObj = Object.values(lines).reduce((a, b) => +a + b.waiting, 0);
  return sumObj;
};
const avgTime = (lines) => {
  const items = Object.values(lines);
  const avgTime =
    Object.values(lines).reduce((a, b) => +a + b.elapsed, 0) / items.length;
  return moment.utc().startOf("day").add(avgTime, "seconds").format("H:mm:ss");
  //return avgTime;
};

export default function Panel() {
  const classes = useStyles();
  const [filtro, setFilter] = useState("");
  const [datos, setDatos] = useState([]);
  const [sucursales, setSucursales] = useState(datos);

  const handleChange = (e) => {
    setFilter(e.target.value);
  };

  useEffect(() => {
    buscarDatos();
  }, []);
  useEffect(() => {
    filtrarDatos();
  }, [filtro]);

  const buscarDatos = async () => {
    const api = await fetch(
      `https://boiling-mountain-49639.herokuapp.com/desafio-frontend`,
      {
        method: "GET",
        headers: new Headers({
          "Content-Type": "application/json",
        }),
      }
    );
    const _datos = await api.json();
    setDatos(_datos);
    setSucursales(_datos);
  };
  const filtrarDatos = () => {
    const filterData = datos.filter((data) => {
      if (filtro == null) return data;
      else if (
        accents(data.name.toLowerCase()).includes(filtro.toLowerCase())
      ) {
        return data;
      }
    });
    setSucursales(filterData);
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="relative" className={classes.AppBar}>
        <Toolbar className={classes.center}>
          <img src={logo} className="App-logo" alt="logo" />
        </Toolbar>
        <Container className={classes.search} maxWidth="xl">
          <Container maxWidth="lg">
            <TextField
              className={classes.margin}
              onChangeCapture={handleChange}
              id="input-with-icon-textfield"
              placeholder="Buscar sucursal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Container>
        </Container>
      </AppBar>
      <main className={classes.main}>
        <Container className={classes.cardGrid} maxWidth="lg">
          <Grid container spacing={2}>
            {sucursales.map((data) => (
              <Grid item key={data.name} xs={12} sm={6} md={3}>
                <Card
                  className={`${classes.card} ${
                    data.online === true
                      ? classes.sucursalOnline
                      : classes.sucursalOffline
                  }`}
                >
                  <CardContent className={classes.cardContent}>
                    <Box fontWeight="fontWeightBold" fontSize="h5.fontSize">
                      {data.name}
                    </Box>
                  </CardContent>
                  <CardActions
                    className={`${
                      data.online === true
                        ? classes.detalleOnline
                        : classes.detalleOffline
                    }`}
                    spacing={100}
                  >
                    <PersonOutline />
                    {sumPerson(data.lines)}
                    <AlarmOutlined />
                    {avgTime(data.lines)}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
    </React.Fragment>
  );
}
