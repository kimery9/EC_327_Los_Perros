import {useEffect, useState} from 'react';
import React from 'react'
import {CssBaseline} from "@mui/material";
import {Grid} from "@mui/material";
import Header from "./components/Header/Header";
import Aggregate from "./components/Aggregate/Aggregate";
import Details from "./components/Details/Details";
import List from "./components/List/List";
import News from "./components/News/News";
import axios from 'axios';
import Chart from 'react-apexcharts';

//TODO stock is the correct ticker
const apiUrl='https://api.polygon.io/v2/aggs/ticker/AAPL/range/1/day/2021-07-21/2022-07-22?adjusted=true&sort=asc&limit=500&apiKey=QVcqDoOgvanAJx0Tjpj01BtguV0OLYoA';
async function getStocks(){
 const response=await fetch(apiUrl);
return response.json()
}
const chart= {
    options: {
        chart: {
            type: 'candlestick',
            height: 500
        },
        title: {
            text: 'CandleStick Chart',
            align: 'left'
        },
        xaxis: {
            type: 'datetime'
        },
        yaxis: {
            tooltip: {
                enabled: true
            }
        }
    },
};


function App() {
    const [series, setSeries]=useState( [{
        data: []
    }]);
    const [price, setPrice]=useState(-1);
    const [pastPrice, setPastPrice]=useState(-1);
    const [priceTime,setPriceTime]=useState(null);


    useEffect(()=>{
        getStocks()
            .then((data)=>{
                console.log(data);
                const length= data.results.length;
                console.log(length);
                const historical=[];
                for(let i=0; i<length; i++){
                    const tix=data.results[i];
                    historical[i]=[tix.t,tix.o,tix.h,tix.l,tix.c];
                }

                // const tix=data.results[0];
                // console.log(tix);
                // setPrice(tix.vw);
                // setPriceTime(new Date(tix.t*1000));
                // const plotprices=historical.map((t,index)=>({
                //     x: new Date(t*1000),
                //     y:[tix.o[index],tix.h[index],tix.l[index],tix.c[index]]
                // }));
                setSeries([{
                     data:historical
                 }])
            })
    },[]);
  return (
<>
  <CssBaseline/>
{/*  <Header/>*/}
{/*  <Grid container spacing = {3} style = {{width:'100%'}}>*/}
{/*    <Grid item xs = {12} md = {2} >*/}
{/*      <List/>*/}
{/*    </Grid>*/}
{/*    <Grid item xs = {12} md = {4} >*/}
{/*      <Aggregate/>*/}
{/*    </Grid>*/}
{/*    <Grid item xs = {12} md = {2} >*/}
{/*      <Details/>*/}
{/*    </Grid>*/}
{/*    <Grid item xs = {12} md = {4} >*/}
{/*      <News/>*/}
{/*    </Grid>*/}
{/*  </Grid>*/}
  <Header/>
<Details/>
    <Divider
        primaryColor="red"
        secondaryColor="grey"
        heightValue={2}
    ></Divider>
    <Aggregate/>
<div className="price">
    {price}
    <br/>
    {priceTime && priceTime.toLocaleDateString()}
</div>
    <div>
        <Chart options={chart.options} series={series} type="candlestick" width="100%" height={320} />
    </div>
    <Divider
        primaryColor="red"
        secondaryColor="grey"
        heightValue={2}
    ></Divider>
    <News/>
</>
  );
}

function Divider(props) {
  const { primaryColor, secondaryColor, heightValue } = props;
  console.log(heightValue);
  return (
      <hr
          style={{
            color: primaryColor,
            backgroundColor: secondaryColor,
            height: heightValue
          }}
      />
  );
}

export default App;