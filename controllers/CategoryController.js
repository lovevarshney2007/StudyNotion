import Tag from "../models/CategoryModel";

// crreate tag handler function

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
    const tagDetails = await Tag.create({
      name: name,
      description: description,
    });
    console.log(tagDetails);

    // return response
    return res.status(200).json({
      success: true,
      message: "Tag created Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// getAlltags

export const showAllCategory = async (req, res) => {
  try {
    const allTags = await Tag.find({}, { name: true, description: true });
    res.status(200).json({
      success: true,
      message: "All tags fetched Successfully",
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
      .populate("courses")
      .exec();
    // validation
    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "Data not found",
      });
    }
    // get courses for different categories
    const differentCategories = await Category.find({
      _id: { $ne: categoryId },
    })
      .populate("courses")
      .exec();
    // get 'top selling course
    // Hw write this code
    // return response
    return res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategories,
      },
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    }) 
  }
};
