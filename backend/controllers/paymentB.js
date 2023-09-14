const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
	environment: braintree.Environment.Sandbox,
	merchantId: "v9q2x9xg6zvqdxtx",
	publicKey: "xgm8gndmcf3dwd2c",
	privateKey: "37f2d02b358fdd8d798233625ce6d59a",
});

exports.getToken = (req, res) => {
	gateway.clientToken.generate({}, (err, response) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.send(response);
		}
	});
};

exports.processPayment = (req, res) => {
	let nonceFromTheClient = req.body.paymentMenthodNonce;
	let amountFromTheClient = req.body.amount;
	gateway.transaction.sale(
		{
			amount: amountFromTheClient,
			paymentMethodNonce: nonceFromTheClient,
			options: {
				submitForSettlement: true,
			},
		},
		(err, result) => {
			if (err) {
				res.status(500).send(err);
			} else {
				res.json(result);
			}
		}
	);
};
