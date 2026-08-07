const mongoose = require("mongoose");
const categoryModel = require("../models/category.model")

const defaultCategories = [
    // Expense categories
    { name: "Food & Dining",    icon: "🍔", type: "expense", isDefault: true },
    { name: "Travel",           icon: "✈️", type: "expense", isDefault: true },
    { name: "Rent",             icon: "🏠", type: "expense", isDefault: true },
    { name: "Utilities",        icon: "💡", type: "expense", isDefault: true },
    { name: "Shopping",         icon: "🛍️", type: "expense", isDefault: true },
    { name: "Healthcare",       icon: "🏥", type: "expense", isDefault: true },
    { name: "Entertainment",    icon: "🎬", type: "expense", isDefault: true },
    { name: "Education",        icon: "📚", type: "expense", isDefault: true },
    { name: "Transport",        icon: "🚗", type: "expense", isDefault: true },
    { name: "Subscriptions",    icon: "📱", type: "expense", isDefault: true },
    { name: "Groceries",        icon: "🛒", type: "expense", isDefault: true },
    { name: "Other Expense",    icon: "💸", type: "expense", isDefault: true },

    // Income categories
    { name: "Salary",           icon: "💼", type: "income", isDefault: true },
    { name: "Freelance",        icon: "💻", type: "income", isDefault: true },
    { name: "Investment",       icon: "📈", type: "income", isDefault: true },
    { name: "Gift",             icon: "🎁", type: "income", isDefault: true },
    { name: "Other Income",     icon: "💰", type: "income", isDefault: true },
]

async function connectToDB(){
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to Database")

        const existing = await categoryModel.countDocuments({ isDefault: true })
        if (existing === 0) {
            await categoryModel.insertMany(defaultCategories)
            console.log(`✅ Default categories seeded (${defaultCategories.length} categories)`)
        }

    }
    catch(err){
        console.log(err)
    }
}


module.exports = connectToDB;