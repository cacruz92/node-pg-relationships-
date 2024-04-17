/** Tests for companies. */

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

  test("It should respond with array of companies", async function () {
    const response = await request(app).get("/companies");
    expect(response.body).toEqual({
      "companies": [
        {code: "apple", name: "Apple"},
        {code: "ibm", name: "IBM"},
      ]
    });
  })

});


describe("GET /apple", function () {

  test("It return company info", async function () {
    const response = await request(app).get("/companies/apple");
    expect(response.body).toEqual(
        {
          "company": {
            code: "apple",
            name: "Apple",
            description: "Maker of OSX.",
            invoices: [1, 2],
          }
        }
    );
  });

  test("It should return 404 for no-such-company", async function () {
    const response = await request(app).get("/companies/blargh");
    expect(response.status).toEqual(404);
  })
});


describe("POST /", function () {

  test("It should add company", async function () {
    const response = await request(app)
        .post("/companies")
        .send({name: "TacoTime", description: "Yum!"});

    expect(response.body).toEqual(
        {
          "company": {
            code: "tacotime",
            name: "TacoTime",
            description: "Yum!",
          }
        }
    );
  });

  test("It should return 500 for conflict", async function () {
    const response = await request(app)
        .post("/companies")
        .send({name: "Apple", description: "Huh?"});

    expect(response.status).toEqual(500);
  })
});


describe("PUT /", function () {

  test("It should update company", async function () {
    const response = await request(app)
        .put("/companies/apple")
        .send({name: "AppleEdit", description: "NewDescrip"});

    expect(response.body).toEqual(
        {
          "company": {
            code: "apple",
            name: "AppleEdit",
            description: "NewDescrip",
          }
        }
    );
  });

  test("It should return 404 for no-such-comp", async function () {
    const response = await request(app)
        .put("/companies/blargh")
        .send({name: "Blargh"});

    expect(response.status).toEqual(404);
  });

  test("It should return 500 for missing data", async function () {
    const response = await request(app)
        .put("/companies/apple")
        .send({});

    expect(response.status).toEqual(500);
  })
});


describe("DELETE /", function () {

  test("It should delete company", async function () {
    const response = await request(app)
        .delete("/companies/apple");

    expect(response.body).toEqual({"status": "deleted"});
  });

  test("It should return 404 for no-such-comp", async function () {
    const response = await request(app)
        .delete("/companies/blargh");

    expect(response.status).toEqual(404);
  });
});


























































// // Tell Node that we're in test "mode"
// process.env.NODE_ENV = 'test';

// const request = require('supertest');
// const app = require('../app');
// const db = require('../db');

// let testCompany;

// beforeEach(async() => {
//     const result = await db.query(`INSERT INTO companies(code, name, description) VALUES ('unique_code', 'Cruz Got Cakes', 'Maker of Cakes') RETURNING code, name, description`);
//     testCompany = result.rows[0]
//     console.log(testCompany)
// })

// afterEach(async() => {
//     await db.query(`DELETE FROM companies`)
// })

// afterAll(async() => {
//     await db.end()
// })

// describe("GET /companies", () => {
//     test("Get a list of all companies", async() => {
//         const res = await request(app).get('/companies')
//         expect(res.statusCode).toBe(200);
//         expect(res.body).toEqual({companies: [testCompany]})
//     })
// })

// describe("GET /companies/:code", () => {
//     test("Get information on one company", async() => {
//         const res = await request(app).get(`/companies/${testCompany.code}`)
//         expect(res.statusCode).toBe(200);
//         expect(res.body).toEqual({company: testCompany})
//     })
//     test("Responds with 404 for invalid code", async () => {
//         const res = await request(app).get(`/companies/xxx`)
//         expect(res.statusCode).toBe(404);
//       })
// })

// describe("POST /companies", () => {
//     test("Creates a single company", async() => {
//         const res = await request(app).post('/companies').send({
//             code: 'www', name: "Wrandy's Wild Ways", description:"Whirwind adventures with Wild Wrandy"
//         })
//         expect(res.statusCode).toBe(201);
//         expect(res.body).toEqual({code: "www", name: "Wrandy's Wild Ways", description:"Whirwind adventures with Wild Wrandy"})
//     })
// })

// describe("PUT /companies/:code", () => {
//     test("Update a company", async() => {
//         const res = await request(app).put(`/companies/${testCompany.code}`).send({
//             name: "Wrandy's Wild Ways", description:"Whirwind adventures with Wild Wrandy"
//         })

//         expect(res.statusCode).toBe(200);
//         expect(res.body).toEqual({company: {code: "unique_code", name: "Wrandy's Wild Ways", description:"Whirwind adventures with Wild Wrandy"}})
//     })
//     test("Responds with 404 for invalid code", async () => {
//         const res = await request(app).put(`/companies/xxx`)
//         expect(res.statusCode).toBe(404);
//       })
// })

// describe("DELETE /companies/:code", () => {
//     // test("Deletes a company", async() => {
//     //     const res = await request(app).delete(`/companies/${testCompany.code}`)
//     //     expect(res.statusCode).toBe(200);
//     //     expect(res.body).toEqual({msg: "Deleted!"})
//     // })
//     test("Responds with 404 for invalid code", async () => {
//         const res = await request(app).delete(`/companies/xxx`)
//         expect(res.statusCode).toBe(404);
//       })
// })