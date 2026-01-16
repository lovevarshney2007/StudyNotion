import Category from "../models/CategoryModel.js";
import Tag from "../models/CategoryModel.js";

function getRandomInt(max){
  return Math.floor(Math.random()*max);
}

// crreate Category handler function
export const createCategory = async (req, res) => {
  try {
    // fetch data
    const { name, description } = req.body;

    //validation
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        messageL: "All fields are required",
      });
    }
    // create entry in db
    const categoryDetails = await Category.create({
      name: name,
      description: description,
    });
    console.log(categoryDetails);

    // return response
    return res.status(200).json({
      success: true,
      message: "Category created Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// showAll Category

export const showAllCategory = async (req, res) => {
  try {
    const allCategories = await Category.find(
      {},
      { name: true, description: true }
    );
    res.status(200).json({
      success: true,
      message: "All tags fetched Successfully",
      data: allCategories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Category PageDetail
export const categoryPageDetails = async (req, res) => {
  try {
    // get categoryId
    const { categoryId } = req.body;
    // get courses for specified category id
    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: "ratingAndReview",
      })
      .exec();
    console.log("SELECTED COURSE", selectedCategory);
    // validation
    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // when there are no courses
    if (selectedCategory.course.length === 0) {
      console.log("No courses found for the selected category");
      return res.status(404).json({
        success: false,
        message: "No courses found for the selected category.",
      });
    }

    // Get courses for other categories
    const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId },
    });

    // get courses for different categories
    let differentCategories = await Category.findOne(
      categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
        ._id
    )
      .populate({
        path: "courses",
        match: { status: "Pub;ished" },
      })
      .exec();
    console.log();
    // get 'top selling course
    const allCategories = await Category.find()
      .populate({
        path: "courses",
        match: { status: "Published" },
      })
      .exec();
    console.log();

    const allCourses = allCategories.flatMap((category) => category.courses);
    const mostSellingCourses = allCourses
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10);
    // return response
    return res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategories,
        mostSellingCourses,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      message: error.message,
    });
  }
};
