import Category from "../models/CategoryModel.js";

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newCategory = await Category.create({
      name,
      description,
    });

    return res.status(200).json({
      success: true,
      message: "Category created Successfully",
      data: newCategory,
    });
  } catch (error) {
    console.error("Create category error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const showAllCategory = async (req, res) => {
  try {
    const allCategories = await Category.find(
      {},
      { name: true, description: true }
    );
    return res.status(200).json({
      success: true,
      message: "All categories fetched Successfully",
      data: allCategories,
    });
  } catch (error) {
    console.error("Show all categories error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body;

    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: [
          { path: "ratingAndReview" },
          { path: "instructor", select: "firstName lastName email image" }
        ],
      })
      .exec();

    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId },
    });

    let differentCategory = null;
    if (categoriesExceptSelected.length > 0) {
      differentCategory = await Category.findById(
        categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]._id
      )
        .populate({
          path: "courses",
          match: { status: "Published" },
          populate: [
            { path: "ratingAndReview" },
            { path: "instructor", select: "firstName lastName email image" }
          ],
        })
        .exec();
    }

    const allCategories = await Category.find()
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: [
          { path: "ratingAndReview" },
          { path: "instructor", select: "firstName lastName email image" }
        ],
      })
      .exec();

    const allCourses = allCategories.flatMap((category) => category.courses || []);
    const mostSellingCourses = allCourses
      .sort((a, b) => (b.studentEnrolled?.length || 0) - (a.studentEnrolled?.length || 0))
      .slice(0, 10);

    return res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses,
      },
    });
  } catch (error) {
    console.error("Category page details error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
