require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.SECRETKEY)

const cors  = require('cors');

const app = express();


app.use(cors());
app.use(express.json());


app.post('/stripe_checkout', async (req, res)=>{
    const stripeToken = req.body.stripeToken;
    const cantidad = req.body.cantidad;

    const cantidadInEur = Math.round(cantidad* 100);

    // Se crea la transaccion
    const chargeObject = await stripe.charges.create({
        amount: cantidadInEur,
        currency: 'eur',
        source: stripeToken,
        capture: false,
        description: 'Mi camino al millon',
        receipt_email: 'jdongllau@gmail.com'
    });

    // Agregar la transaccion anuestra BD
    //Comprobaciones sobre el pago

    try {
        await stripe.charges.capture(chargeObject.id);
        res.json(chargeObject);
    } catch(error){
        await stripe.refunds.create({charge: chargeObject.id});
        res.json(chargeObject);
    }

});


app.get('/get_products', async (req, res)=>{
    
    let data_fake = [
    {
      "idProducto": 2,
      "idCategoria_fk": 1,
      "nombre": {
          "S": "Computadora Gamer Xtreme PC"
        },
    "descripcion": {
        "S": "Gaming CM-05306, AMD Ryzen 3 3200G 3.60GHz, 8GB, 240GB SSD, Radeon Vega 8, FreeDOS"
      },
    "precio": 8999,
    "cantidad": 3,
    "imgUrl": {
      "S": "https://www.cyberpuerta.mx/img/product/M/CP-XTREMEPCGAMING-XTBRR38GBVEGA3-1.png"
      }
    },
    {
    "idProducto": 1,
    "idCategoria_fk": 1,
    "nombre": {
    "S": "Alienware 17 r4"
    },
    "descripcion": {
    "S": "Computadora Alienware de 17 pulgadas"
    },
    "precio": 38999,
    "cantidad": 2,
    "imgUrl": {
    "S": "https://www.cyberpuerta.mx/img/product/XL/CP-ALIENWARE-A17SR_I7K16112860W10S_520-1.jpg"
    }
    }
    ];

    res.json(data_fake);

});






// const port = process.env.PORT || 3000
const port = process.env.PORT || 3000
app.listen(port, () => console.log('Server is running...'))