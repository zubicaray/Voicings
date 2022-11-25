"use strict";

var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var paypal = require('paypal-rest-sdk');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

paypal.configure({
    'host': 'zubicaray@yahoo.com', //sandbox or live //add your own credentials
    'client_id': 'AcjInm0WPRMWkQcyVi0mFdmR-jQCU5R5uH-7wS_yAyWpNBU35D5BIk2E6EjuHuGsnX29oGBE_qVmMD6F',
    'client_secret': 'EMxJ1uMEKt31SE98aIQSIJjD0L_veG6jvs9AiyI-NhL2Yxn5fubb4yYOvW4FM5xjc_FU7aFld3hdvYqS'
});

app.globalAmount = 0;

app.post('/createPayment', function(req, res){
    app.globalAmount = req.body.amount;
    console.log('Amount' + app.globalAmount);

    //setting up a json with all the payment details

    var create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:3000/executePayment/",
            "cancel_url": "http://localhost:3000/cancelPayment/"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "item",
                    "sku": "item",
                    "price": req.body.amount,
                    "currency": "EUR",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "EUR",
                "total": req.body.amount
            },
            "description": "This is the payment description."
        }]
    };
    
    // calling the paypal create function to create the payment, this should return a payment confirmation
    // that is passed to executePay function if confirmed.
    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            console.log("Create Payment Response");
            console.log(payment);
            res.send(payment);
        };
    });
});

//execute payment after redirect
app.get('/executePayment/', function(req, res){
    var payment_Id = req.query.paymentId;
    var payer_id = req.query.PayerID;
    console.log(payment_Id + ' ' + payer_id);

    var execute_payment_json = {
        "payer_id": payer_id,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": app.globalAmount
            }
        }]
    };
    
    paypal.payment.execute(payment_Id, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log("Get Payment Response");
            console.log(JSON.stringify(payment));
            res.send(payment);
        }
    });
});

app.get('/cancelPayment', function(req, res){
    res.send('Transaction cancelled');
});

app.listen('3000', function(){
    console.log('Server Running on port 3000');
});