const https = require('https');
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const Payment = require('../models/Payment');

exports.initializeTransaction = (req, res) => {
  // Get data from the request body
  const { email, amount } = req.body;

  // Prepare the request data
  const data = JSON.stringify({
    email,
    amount,
  });

  // Set up options for the Paystack API request
  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: '/transaction/initialize',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
  };

  // Initialize the Paystack transaction
  const paystackRequest = https.request(options, (paystackResponse) => {
    let data = '';

    paystackResponse.on('data', (chunk) => {
      data += chunk;
    });

    paystackResponse.on('end', () => {
      // Parse the Paystack API response
      const paystackResponseData = JSON.parse(data);

      // Check if the transaction was successfully initialized
      if (paystackResponseData.status) {
        // Transaction initialized successfully
        return res.json({ success: true, data: paystackResponseData.data });
      } else {
        // Transaction initialization failed
        return res.status(500).json({ success: false, message: paystackResponseData.message });
      }
    });
  });

  paystackRequest.on('error', (error) => {
    // Handle API request error
    console.error(error);
    return res.status(500).json({ success: false, message: 'Error initializing transaction' });
  });

  // Send the request data to Paystack
  paystackRequest.write(data);
  paystackRequest.end();
};

exports.verifyTransaction = (req, res) => {
  // Get the transaction reference from the route parameter
  const { reference } = req.params;

  // Set up options for the Paystack API request
  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: `/transaction/verify/${reference}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    },
  };

  // Verify the Paystack transaction
  const paystackRequest = https.request(options, (paystackResponse) => {
    let data = '';

    paystackResponse.on('data', (chunk) => {
      data += chunk;
    });

    paystackResponse.on('end', () => {
      // Parse the Paystack API response
      const paystackResponseData = JSON.parse(data);

      if (paystackResponseData.status) {
        // Transaction verification successful
        return res.json({ success: true, data: paystackResponseData.data });
      } else {
        // Transaction verification failed
        return res.status(400).json({ success: false, message: paystackResponseData.message });
      }
    });
  });

  paystackRequest.on('error', (error) => {
    // Handle API request error
    console.error(error);
    return res.status(500).json({ success: false, message: 'Error verifying transaction' });
  });

  paystackRequest.end();
};

exports.listTransactions = (req, res) => {
  // Set up options for Paystack API request
  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: '/transaction',
    method: 'GET',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    },
  };

  // List Paystack transactions
  const paystackRequest = https.request(options, (paystackResponse) => {
    let data = '';

    paystackResponse.on('data', (chunk) => {
      data += chunk;
    });

    paystackResponse.on('end', () => {
      // Parse the Paystack API response
      const paystackResponseData = JSON.parse(data);

      if (paystackResponseData.status) {
        // Transaction listing successful
        return res.json({ success: true, data: paystackResponseData.data });
      } else {
        // Transaction listing failed
        return res.status(400).json({ success: false, message: paystackResponseData.message });
      }
    });
  });

  paystackRequest.on('error', (error) => {
    // Handle API request error
    console.error(error);
    return res.status(500).json({ success: false, message: 'Error listing transactions' });
  });

  paystackRequest.end();
};

exports.fetchTransaction = (req, res) => {
  const transactionId = req.params.transactionId;

  // Set up options for the Paystack API request
  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: `/transaction/${transactionId}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    },
  };

  // Fetch Paystack transaction details
  const paystackRequest = https.request(options, (paystackResponse) => {
    let data = '';

    paystackResponse.on('data', (chunk) => {
      data += chunk;
    });

    paystackResponse.on('end', () => {
      // Parse the Paystack API response
      const paystackResponseData = JSON.parse(data);

      if (paystackResponseData.status) {
        // Transaction details fetched successfully
        return res.json({ success: true, data: paystackResponseData.data });
      } else {
        // Error in fetching transaction details
        return res.status(400).json({ success: false, message: paystackResponseData.message });
      }
    });
  });

  paystackRequest.on('error', (error) => {
    // Handle API request error
    console.error(error);
    return res.status(500).json({ success: false, message: 'Error fetching transaction details' });
  });

  paystackRequest.end();
};

exports.chargeAuthorization = (req, res) => {
  const chargeData = {
    email: req.body.email,
    amount: req.body.amount,
    authorization_code: req.body.authorization_code,
  };

  // Set up options for Paystack API request
  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: '/transaction/charge_authorization',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
  };

  // Create a request to charge the authorization
  const paystackRequest = https.request(options, (paystackResponse) => {
    let data = '';

    paystackResponse.on('data', (chunk) => {
      data += chunk;
    });

    paystackResponse.on('end', () => {
      // Parse the Paystack API response
      const paystackResponseData = JSON.parse(data);

      if (paystackResponseData.status) {
        // Authorization charged successfully
        return res.json({ success: true, data: paystackResponseData.data });
      } else {
        // Error in charging the authorization
        return res.status(400).json({ success: false, message: paystackResponseData.message });
      }
    });
  });

  paystackRequest.on('error', (error) => {
    // Handle API request error
    console.error(error);
    return res.status(500).json({ success: false, message: 'Error charging the authorization' });
  });

  // Send charge data in the request body
  paystackRequest.write(JSON.stringify(chargeData));
  paystackRequest.end();
};

exports.viewTransactionTimeline = (req, res) => {
  const idOrReference = req.params.id_or_reference;

  // Set up options for Paystack API request
  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: `/transaction/timeline/${idOrReference}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    },
  };

  // Create a request to view the transaction timeline
  const paystackRequest = https.request(options, (paystackResponse) => {
    let data = '';

    paystackResponse.on('data', (chunk) => {
      data += chunk;
    });

    paystackResponse.on('end', () => {
      // Parse the Paystack API response
      const paystackResponseData = JSON.parse(data);

      if (paystackResponseData.status) {
        // Transaction timeline retrieved successfully
        return res.json({ success: true, data: paystackResponseData.data });
      } else {
        // Error in retrieving the transaction timeline
        return res.status(400).json({ success: false, message: paystackResponseData.message });
      }
    });
  });

  paystackRequest.on('error', (error) => {
    // Handle API request error
    console.error(error);
    return res.status(500).json({ success: false, message: 'Error retrieving the transaction timeline' });
  });

  paystackRequest.end();
};

exports.getTransactionTotals = (req, res) => {
  // Set up options for the Paystack API request
  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: '/transaction/totals',
    method: 'GET',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    },
  };

  // Create a request to get transaction totals
  const paystackRequest = https.request(options, (paystackResponse) => {
    let data = '';

    paystackResponse.on('data', (chunk) => {
      data += chunk;
    });

    paystackResponse.on('end', () => {
      // Parse the Paystack API response
      const paystackResponseData = JSON.parse(data);

      if (paystackResponseData.status) {
        // Transaction totals retrieved successfully
        return res.json({ success: true, data: paystackResponseData.data });
      } else {
        // Error in retrieving transaction totals
        return res.status(400).json({ success: false, message: paystackResponseData.message });
      }
    });
  });

  paystackRequest.on('error', (error) => {
    // Handle API request error
    console.error(error);
    return res.status(500).json({ success: false, message: 'Error retrieving transaction totals' });
  });

  paystackRequest.end();
};

exports.exportTransactions = (req, res) => {
  // Set up options for the Paystack API request
  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: '/transaction/export',
    method: 'GET',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    },
  };

  // Create a request to export transactions
  const paystackRequest = https.request(options, (paystackResponse) => {
    let data = '';

    paystackResponse.on('data', (chunk) => {
      data += chunk;
    });

    paystackResponse.on('end', () => {
      // Parse the Paystack API response
      const paystackResponseData = JSON.parse(data);

      if (paystackResponseData.status) {
        // Transactions exported successfully
        return res.json({ success: true, data: paystackResponseData.data });
      } else {
        // Error in exporting transactions
        return res.status(400).json({ success: false, message: paystackResponseData.message });
      }
    });
  });

  paystackRequest.on('error', (error) => {
    // Handle API request error
    console.error(error);
    return res.status(500).json({ success: false, message: 'Error exporting transactions' });
  });

  paystackRequest.end();
};
