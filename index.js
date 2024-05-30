const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors("*"));
const axios = require('axios');
app.use(express.json());

async function getAuthToken() {
    const axios = require('axios');
    let data = JSON.stringify({
        "companyName": "AffordMed",
        "clientID": "6da7d52d-2a55-4185-9bd1-de6c5c8a31a6",
        "clientSecret": "ijOeYGwlXHtJGIJX",
        "ownerName": "Arshidha U",
        "ownerEmail": "arshikumar499@gmail.com",
        "rollNo": "927621BEC013"
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://20.244.56.144/test/auth',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    return await axios.request(config)
        .then((response) => {
            return response.data["access_token"]
        })
        .catch((error) => {
            return error;
        });

}

app.get("/products", async (req, res) => {
    const companies = ["AMZ","FLP","SNP","MYN","AZO"];
    const categories = ["Phone", "Computer", "TV", "Earphone", "Tablet", "Charger", "Mouse", "Keypad", "Bluetooth", "Pendrive","Remote","Speaker","Headset","Laptop","PC"]
    const productLimit = req.body.limit;
    const minPrice = req.body.min;
    const maxPrice = req.body.max;
    const products = [];
    const auth_token = await getAuthToken();
    console.log(auth_token)


    companies.map(async (company, id) => {
        categories.map(async (category, cid) => {
            console.log(`http://20.244.56.144/test/companies/${company}/categories/${category}/products?top=${productLimit}&minPrice=${minPrice}&maxPrice=${maxPrice}`)
            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `http://20.244.56.144/test/companies/${company}/categories/${category}/products?top=${productLimit}&minPrice=${minPrice}&maxPrice=${maxPrice}`,
                headers: {
                    'Authorization': `Bearer ${auth_token}`
                }
            }

            await axios.request(config)
                .then((response) => {
                    console.log(JSON.stringify(response.data));
                    JSON.parse(response.data).map((product, index) => {
                        product["company"] = company;
                        product["category"] = category;
                        products.push(product)
                    })
                })
                .catch((error) => {
                    console.log(error);
                });

        })
    })

    // console.log(products)
res.json({status: 0, products: products});

})

app.listen(6000, () => {
    console.log("Conected")});