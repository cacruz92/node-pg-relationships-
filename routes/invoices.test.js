/** Tests for invoices. */

const request = require("supertest");

const app = require("../app");
const { createData } = require("../_test-common");
const db = require("../db");

// before each test, clean out data
beforeEach(createData);

afterAll(async () => {
  await db.end()
})

describe("GET /", function () {

  test("It should respond with array of invoices", async function () {
    const response = await request(app).get("/invoices");
    expect(response.body).toEqual({
      "invoices": [
        {id: 1, comp_code: "apple"},
        {id: 2, comp_code: "apple"},
        {id: 3, comp_code: "ibm"},
      ]
    });
  })

});


describe("GET /1", function () {

  test("It return invoice info", async function () {
    const response = await request(app).get("/invoices/1");
    expect(response.body).toEqual(
        {
          "invoice": {
            id: 1,
            amt: 100,
            add_date: '2018-01-01T08:00:00.000Z',
            paid: false,
            paid_date: null,
            company: {
              code: 'apple',
              name: 'Apple',
              description: 'Maker of OSX.',
            }
          }
        }
    );
  });

  test("It should return 404 for no-such-invoice", async function () {
    const response = await request(app).get("/invoices/999");
    expect(response.status).toEqual(404);
  })
});


describe("POST /", function () {

  test("It should add invoice", async function () {
    const response = await request(app)
        .post("/invoices")
        .send({amt: 400, comp_code: 'ibm'});

    expect(response.body).toEqual(
        {
          "invoice": {
            id: 4,
            comp_code: "ibm",
            amt: 400,
            add_date: expect.any(String),
            paid: false,
            paid_date: null,
          }
        }
    );
  });
});


describe("PUT /", function () {

  test("It should update an invoice", async function () {
    const response = await request(app)
        .put("/invoices/1")
        .send({amt: 1000, paid: false});

    expect(response.body).toEqual(
        {
          "invoice": {
            id: 1,
            comp_code: 'apple',
            paid: false,
            amt: 1000,
            add_date: expect.any(String),
            paid_date: null,
          }
        }
    );
  });

  test("It should return 404 for no-such-invoice", async function () {
    const response = await request(app)
        .put("/invoices/9999")
        .send({amt: 1000});

    expect(response.status).toEqual(404);
  });

  test("It should return 500 for missing data", async function () {
    const response = await request(app)
        .put("/invoices/1")
        .send({});

    expect(response.status).toEqual(500);
  })
});


describe("DELETE /", function () {

  test("It should delete invoice", async function () {
    const response = await request(app)
        .delete("/invoices/1");

    expect(response.body).toEqual({"status": "deleted"});
  });

  test("It should return 404 for no-such-invoices", async function () {
    const response = await request(app)
        .delete("/invoices/999");

    expect(response.status).toEqual(404);
  });
});




















































// // Tell Node that we're in test "mode"
// process.env.NODE_ENV = 'test';

// const request = require('supertest');
// const app = require('../app');
// const db = require('../db');

// let testInvoice;

// beforeEach(async() => {

//     const invoiceResult = await db.query(`INSERT INTO invoices(comp_code, amt) VALUES ('unique_code', 250) RETURNING id, comp_code, amt, paid, add_date, paid_date`);
//     testInvoice = invoiceResult.rows[0]    
// })

// afterEach(async() => {
//     await db.query(`DELETE FROM invoices`)
// })

// afterAll(async() => {
//     await db.end()
// })

// describe("GET /invoices", () => {
//     test("Get a list of all invoices", async() => {
//         const res = await request(app).get('/invoices')
//         expect(res.statusCode).toBe(200);
//         expect(res.body).toEqual({invoices: [{...testInvoice, add_date: new Date(testInvoice.add_date).toISOString()}]})
//     })
// })

// describe("GET /invoices/:code", () => {
//     test("Get information on one invoice", async() => {
//         const res = await request(app).get(`/invoices/${testInvoice.code}`)
//         expect(res.statusCode).toBe(200);
//         expect(res.body).toEqual({invoice: testInvoice})
//     })
//     test("Responds with 404 for invalid code", async () => {
//         const res = await request(app).get(`/invoices/xxx`)
//         expect(res.statusCode).toBe(404);
//       })
// })

// describe("POST /invoices", () => {
//     test("Creates a single invoice", async() => {
//         const res = await request(app).post('/invoices').send({
//             code: 'www', name: "Wrandy's Wild Ways", description:"Whirwind adventures with Wild Wrandy"
//         })
//         expect(res.statusCode).toBe(201);
//         expect(res.body).toEqual({code: "www", name: "Wrandy's Wild Ways", description:"Whirwind adventures with Wild Wrandy"})
//     })
// })

// describe("PUT /invoices/:code", () => {
//     test("Update a invoice", async() => {
//         const res = await request(app).put(`/invoices/${testInvoice.code}`).send({
//             name: "Wrandy's Wild Ways", description:"Whirwind adventures with Wild Wrandy"
//         })

//         expect(res.statusCode).toBe(200);
//         expect(res.body).toEqual({invoice: {code: "cgc", name: "Wrandy's Wild Ways", description:"Whirwind adventures with Wild Wrandy"}})
//     })
//     test("Responds with 404 for invalid code", async () => {
//         const res = await request(app).put(`/invoices/xxx`)
//         expect(res.statusCode).toBe(404);
//       })
// })

// describe("DELETE /invoices/:code", () => {
//     test("Deletes a invoice", async() => {
//         const res = await request(app).delete(`/invoices/${testInvoice.code}`).send({
//             name: "Wrandy's Wild Ways", description:"Whirwind adventures with Wild Wrandy"
//         })

//         expect(res.statusCode).toBe(200);
//         expect(res.body).toEqual({invoice: {code: "cgc", name: "Wrandy's Wild Ways", description:"Whirwind adventures with Wild Wrandy"}})
//     })
//     test("Responds with 404 for invalid code", async () => {
//         const res = await request(app).delete(`/invoices/xxx`)
//         expect(res.statusCode).toBe(404);
//       })
// })