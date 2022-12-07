import {useEffect, useMemo, useState} from 'react';
import React from 'react'
import {CssBaseline} from "@mui/material";
import {Grid} from "@mui/material";
import axios from 'axios';
import Chart from 'react-apexcharts';



async function getStocks(query){
    const apiUrl=`https://api.polygon.io/v2/aggs/ticker/${query.query.toString()}/range/1/day/2021-07-21/2022-07-22?adjusted=true&sort=asc&limit=500&apiKey=QVcqDoOgvanAJx0Tjpj01BtguV0OLYoA`;
    const response=await fetch(apiUrl);
    return response.json()
}


async function getReal(query) {
    const finnhub=`https:finnhub.io/api/v1/quote?symbol=${query.query.toString()}&token=ce7ok3qad3i4pjr4oj10ce7ok3qad3i4pjr4oj1g`
    const response=await fetch(finnhub);
    return response.json()
}

function Aggregate (query){
    console.log(query.query.toString());
    const [series, setSeries]=useState( [{
        data: []
    }]);
    const [price, setPrice]=useState(-1);
    const [pastPrice, setPastPrice]=useState(-1);
    const [priceTime,setPriceTime]=useState(null);


    useEffect(()=>{
            getStocks(query)
                .then((data) => {
                    console.log(data);
                    const length = data.results.length;
                    const historical = [];
                    for (let i = 0; i < length; i++) {
                        const tix = data.results[i];
                        historical[i] = [tix.t, tix.o, tix.h, tix.l, tix.c];
                    }

                    const dispprice = data.results[length - 1];
                    console.log(dispprice);


                    setSeries([{
                        data: historical
                    }])

                })

    },[query])

    const chart= {
        options: {
            chart: {
                type: 'candlestick',
                height: 500
            },
            title: {
                text: query.query.toString(),
                align: 'center'
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

    useEffect(()=>{
        let timeoutID;
        async function getlive() {
            const livetix=await getReal(query)
            const liveprice=livetix.c
            console.log(liveprice)
            setPastPrice(price);
             setPrice(liveprice);
            // console.log('Price'+price);
            // console.log('Past'+pastPrice);
           timeoutID=setTimeout(getlive,2000);
        }
        timeoutID=setTimeout(getlive,2000);
        return()=>{
            clearTimeout(timeoutID);
        }

    },[price,query])
    console.log('Price'+price);
    console.log('Past'+pastPrice);

const direction= useMemo(()=>pastPrice<price?'up':pastPrice>price?'down':'',[pastPrice,price]);
    return (
        <h1>
    <div className="price">
        <div className={['price',direction].join(' ')}>
            ${price}
            <br/>
           {/*{pastPrice}*/}
        </div>
        {priceTime && priceTime.toLocaleDateString()}
        <Chart options={chart.options} series={series} type="candlestick" width="100%" height={320} />
    </div>
            </h1>
    );
}

export default Aggregate;