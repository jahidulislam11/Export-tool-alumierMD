const express = require('express');
const app = express();
const { Pool } = require('pg');
require('dotenv').config(); // Load environment variables from .env file
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Hello, this is a Node.js + Express.js API!' });
});

app.get('/products', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM spree_products LIMIT 10');

        const csvWriter = createCsvWriter({
            path: 'public/alumiermd_products.csv',
            header: [
                { id: 'handle', title: 'Handle' },
                { id: 'title', title: 'Title' },
                { id: 'body', title: 'Body (HTML)' },
                { id: 'vendor', title: 'Vendor' },
                { id: 'category', title: 'Product Category' },
                { id: 'type', title: 'Type' },
                { id: 'tags', title: 'Tags' },
                { id: 'published', title: 'Published' },
                { id: 'option1_name', title: 'Option1 Name' },
                { id: 'option1_value', title: 'Option1 Value' },
                { id: 'option2_name', title: 'Option2 Name' },
                { id: 'option2_value', title: 'Option2 Value' },
                { id: 'option3_name', title: 'Option3 Name' },
                { id: 'option3_value', title: 'Option3 Value' },
                { id: 'variant_sku', title: 'Variant SKU' },
                { id: 'variant_grams', title: 'Variant Grams' },
                { id: 'variant_inventory_tracker', title: 'Variant Inventory Tracker' },
                { id: 'variant_inventory_qty', title: 'Variant Inventory Qty' },
                { id: 'variant_inventory_policy', title: 'Variant Inventory Policy' },
                { id: 'variant_fulfillment_service', title: 'Variant Fulfillment Service' },
                { id: 'variant_price', title: 'Variant Price' },
                { id: 'variant_compared_at_price', title: 'Variant Compare At Price' },
                { id: 'variant_requires_shipping', title: 'Variant Requires Shipping' },
                { id: 'variant_taxable', title: 'Variant Taxable' },
                { id: 'variant_barcode', title: 'Variant Barcode' },
                { id: 'image_src', title: 'Image Src' },
                { id: 'image_position', title: 'Image Position' },
                { id: 'image_alt_text', title: 'Image Alt Text' },
                { id: 'gift_card', title: 'Gift Card' },
                { id: 'seo_title', title: 'SEO Title' },
                { id: 'seo_description', title: 'SEO Description' },
                { id: 'google_shopping_or_product_category', title: 'Google Shopping / Google Product Category' },
                { id: 'google_shopping_or_gender', title: 'Google Shopping / Gender' },
                { id: 'google_shopping_or_age_group', title: 'Google Shopping / Age Group' },
                { id: 'google_shopping_or_mpn', title: 'Google Shopping / MPN' },
                { id: 'google_shopping_or_mpn', title: 'Google Shopping / AdWords Grouping' },
                { id: 'google_shopping_or_mpn', title: 'Google Shopping / AdWords Labels' },
                { id: 'google_shopping_or_mpn', title: 'Google Shopping / Condition' },
                { id: 'google_shopping_or_mpn', title: 'Google Shopping / Custom Product' },
                { id: 'google_shopping_or_custom_label_0', title: 'Google Shopping / Custom Label 0' },
                { id: 'google_shopping_or_custom_label_1', title: 'Google Shopping / Custom Label 1' },
                { id: 'google_shopping_or_custom_label_2', title: 'Google Shopping / Custom Label 2' },
                { id: 'google_shopping_or_custom_label_3', title: 'Google Shopping / Custom Label 3' },
                { id: 'google_shopping_or_custom_label_4', title: 'Google Shopping / Custom Label 4' },
                { id: 'variant_image', title: 'Variant Image' },
                { id: 'variant_weight_unit', title: 'Variant Weight Unit' },
                { id: 'variant_tax_code', title: 'Variant Tax Code' },
                { id: 'cost_per_item', title: 'Cost per item' },
                { id: 'price_international', title: 'Price / International' },
                { id: 'compared_at_price_international', title: 'Compare At Price / International' },
                { id: 'status', title: 'Status' }
            ]
        });


        let records = [];

        rows.map((row, index) => {
            // console.log(row, "row")
            let item = {
                title: row.name,
                handle: row.slug,
                body: row.description
            }

            records.push(item);
        })

        csvWriter.writeRecords(records)
            .then(() => {
                console.log('Exporting is done!');
                // console.log(records, "records")
                // res.json(records);
                res.json({
                    error: "false",
                    message: "Exporting is done!",
                    results: records
                })
            })
            .catch((err) => {
                res.json({
                    error: "true",
                    errorMessage: err
                })
            });

    } catch (error) {
        console.error('Error fetching users', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

