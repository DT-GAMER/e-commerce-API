const Payment = require('../models/Payment'); // Import the Payment model
const https = require('https');
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY; // Replace with your Paystack Secret Key

class PaymentService {
  // Initialize a new payment transaction
  async initializePayment(orderID, paymentAmount, email) {
    try {
      // Use Paystack API to initialize the payment
      const paystackResponse = await this.paystackInitializeTransaction(orderID, paymentAmount, email);

      // Create a new Payment document in your database
      const payment = new Payment({
        orderID,
        paymentMethod: 'paystack',
        transactionID: paystackResponse.data.reference,
        paymentStatus: 'pending',
        paymentAmount,
        currency: 'NGN',
        paystackReference: paystackResponse.data.reference,
        paystackStatus: 'pending',
      });

      // Save payment information to the database
      const savedPayment = await payment.save();

      return savedPayment;
    } catch (error) {
      throw new Error('Payment initialization failed.');
    }
  }

  // Verify a payment transaction
  async verifyPayment(reference) {
    try {
      // Use the Paystack API to verify the payment
      const paystackResponse = await this.paystackVerifyTransaction(reference);

      // Update the Payment document in your database with the verification status
      const payment = await Payment.findOne({ paystackReference: reference });
      if (payment) {
        // Update the payment status and other details based on the verification result
        if (paystackResponse.data.status === 'success') {
          payment.paymentStatus = 'successful';
        } else {
          payment.paymentStatus = 'failed';
        }
        payment.paystackStatus = paystackResponse.data.status;
        await payment.save();
      }

      return paystackResponse; // You can return the Paystack response or a custom response.
    } catch (error) {
      throw new Error('Payment verification failed.');
    }
  }

  // Helper function to send requests to Paystack for initializing a transaction
  async paystackInitializeTransaction(orderID, paymentAmount, email) {
    try {
      const params = {
        email,
        amount: paymentAmount * 100, // Paystack amount is in kobo, so convert to kobo
        reference: 'your_unique_reference', // Generate a unique reference for each transaction
        // Other Paystack parameters as needed
      };

      // Construct and send the API request to Paystack for transaction initialization
      const response = await this.sendPaystackRequest('/transaction/initialize', 'POST', params);
      return response;
    } catch (error) {
      throw new Error('Paystack initialization request failed.');
    }
  }

  // Helper function to send requests to Paystack for verifying a transaction
  async paystackVerifyTransaction(reference) {
    try {
      // Construct and send the API request to Paystack for transaction verification
      const response = await this.sendPaystackRequest(`/transaction/verify/${reference}`, 'GET');
      return response;
    } catch (error) {
      throw new Error('Paystack verification request failed.');
    }
  }

  // Helper function to send requests to Paystack
  async sendPaystackRequest(path, method, data = null) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.paystack.co',
        port: 443,
        path: path,
        method: method,
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      };

      const req = https.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', () => {
          try {
            const response = JSON.parse(responseData);
            resolve(response);
          } catch (error) {
            reject(error);
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      if (data) {
        req.write(JSON.stringify(data));
      }

      req.end();
    });
  }

  // Helper function to send requests to Paystack for charging a reusable authorization
  async paystackChargeAuthorization(params) {
    try {
      return await this.sendPaystackRequest('/transaction/charge_authorization', 'POST', params);
    } catch (error) {
      throw new Error('Paystack charge authorization request failed.');
    }
  }

  // Helper function to send requests to Paystack for getting a transaction's timeline
  async paystackGetTransactionTimeline(idOrReference) {
    try {
      const path = `/transaction/timeline/${idOrReference}`;
      return await this.sendPaystackRequest(path, 'GET');
    } catch (error) {
      throw new Error('Paystack get transaction timeline request failed.');
    }
  }

  // Helper function to send requests to Paystack for getting transaction totals
  async paystackGetTransactionTotals() {
    try {
      return await this.sendPaystackRequest('/transaction/totals', 'GET');
    } catch (error) {
      throw new Error('Paystack get transaction totals request failed.');
    }
  }

  // Helper function to send requests to Paystack for exporting transactions
  async paystackExportTransactions() {
    try {
      return await this.sendPaystackRequest('/transaction/export', 'GET');
    } catch (error) {
      throw new Error('Paystack export transactions request failed.');
    }
  }
}

module.exports = PaymentService;
