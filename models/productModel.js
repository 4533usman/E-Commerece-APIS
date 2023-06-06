const mongoose = require("mongoose");


const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Name"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please Enter Product Description"]
    },
    price: {
        type: Number,
        required: [true, "Please Enter Product Price"],
        maxLength: [5, "Price Can Not Exceed 8 Figure"]
    },
    rating: {
        type: Number,
        default: 0
    },
    images: [
        {
            public_id: {
                type: String,
                require: true
            },
            url: {
                type: String,
                require: true
            }
        }
    ],
    category: {
        type: String,
        required: [true, "Please Enter Product Category"]
    },
    Stock: {
        type: Number,
        required: [true, "Please Enter Product Stock"],
        maxLength: [4, "Stock could Not Exceed 4 Character"],
        default: 1
    },
    numofReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true,
            },
            name: {
                type: String,
                require: true
            },
            rating: {
                type: Number,
                require: true
            },
            comment: {
                type: String,
                require: true
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Product", productSchema)