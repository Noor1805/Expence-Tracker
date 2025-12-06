import Category from "../models/Category.js";
import Transaction from "../models/Transaction.js";
import { categorySchema } from "../validations/categoryValidation.js";

export const createCategory = async (req, res) => {
  try {
    const userId = req.user.id;

    const { error } = categorySchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { name, type, color, icon } = req.body;

    const existing = await Category.findOne({ name, user: userId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const newCategory = await Category.create({
      name,
      type,
      color,
      icon,
      user: userId,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: newCategory,
    });
  } catch (error) {
    console.error("Create Category Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    const userId = req.user.id;

    const categories = await Category.find({ user: userId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    console.error("Get Categories Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const updateCategory = async (req, res) => {
  try {
    const userId = req.user.id;
    const categoryId = req.params.id;

    const { error } = categorySchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { name, type, color, icon } = req.body;

    const category = await Category.findOne({
      _id: categoryId,
      user: userId,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    category.name = name;
    category.type = type;
    category.color = color;
    category.icon = icon;

    await category.save();

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    console.error("Update Category Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const userId = req.user.id;
    const categoryId = req.params.id;

    const category = await Category.findOne({
      _id: categoryId,
      user: userId,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    const usedInTransactions = await Transaction.findOne({
      category: category.name,
      user: userId,
    });

    if (usedInTransactions) {
      return res.status(400).json({
        success: false,
        message:
          "Category cannot be deleted because it is linked with existing transactions",
      });
    }

    await Category.findByIdAndDelete(categoryId);

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete Category Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
