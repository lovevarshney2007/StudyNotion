import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

import User from "../models/UserModel.js";
import Profile from "../models/ProfileModel.js";
import Category from "../models/CategoryModel.js";
import Course from "../models/CourseModel.js";
import Section from "../models/SectionModel.js";
import SubSection from "../models/SubSectionModel.js";

dotenv.config();

const sampleCategories = [
  {
    name: "Web Development",
    description: "Learn full-stack web development from HTML, CSS, JavaScript to React, Node.js, and MongoDB.",
  },
  {
    name: "Data Science & AI",
    description: "Master Machine Learning, Python, Deep Learning, Generative AI, and Data Analytics.",
  },
  {
    name: "Cloud & DevOps",
    description: "Explore AWS, Docker, Kubernetes, CI/CD pipelines, and cloud architecture.",
  },
  {
    name: "Mobile App Development",
    description: "Build iOS and Android apps using React Native and Flutter.",
  },
];

const sampleCoursesData = [
  {
    categoryName: "Web Development",
    courseName: "Full Stack Web Development Bootcamp 2026",
    courseDescription:
      "Become a full-stack developer by mastering HTML5, CSS3, modern JavaScript, React 19, Node.js, Express, MongoDB, and modern deployment practices.",
    whatYouWillLearn:
      "- Build scalable frontend applications with React and Tailwind CSS\n- Create robust REST APIs with Node.js and Express\n- Design secure authentication workflows using JWT and Bcrypt\n- Deploy applications to cloud platforms like Vercel and Render\n- Master state management using Redux Toolkit",
    price: 3499,
    thumbnail:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60",
    tags: ["Web Development", "React", "NodeJS", "FullStack", "JavaScript"],
    instructions: [
      "Basic understanding of computers and how the internet works",
      "No prior coding experience is required; we start from absolute scratch",
      "A computer with an internet connection and VS Code installed",
    ],
    status: "Published",
    sections: [
      {
        sectionName: "Module 1: Introduction to Web & Modern JavaScript",
        subSections: [
          {
            title: "How the Web Works & Environment Setup",
            description: "Understanding clients, servers, DNS, HTTP protocols, and configuring VS Code.",
            timeDuration: "1200", // 20 mins
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          },
          {
            title: "ES6+ Modern JavaScript Mastery",
            description: "Deep dive into arrow functions, destructuring, promises, async/await, and modules.",
            timeDuration: "2400", // 40 mins
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          },
        ],
      },
      {
        sectionName: "Module 2: Frontend Engineering with React 19 & Redux",
        subSections: [
          {
            title: "React Fundamentals: Components, Props & Hooks",
            description: "Building reactive UIs, understanding state vs props, and utilizing standard React hooks.",
            timeDuration: "3600", // 60 mins
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          },
          {
            title: "Global State Management with Redux Toolkit",
            description: "Creating slices, configuring the store, and connecting state with components.",
            timeDuration: "1800", // 30 mins
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
          },
        ],
      },
      {
        sectionName: "Module 3: Backend APIs with Node.js, Express & MongoDB",
        subSections: [
          {
            title: "REST API Architecture & Express Setup",
            description: "Designing RESTful endpoints, middleware routing, and error handling patterns.",
            timeDuration: "2700", // 45 mins
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
          },
          {
            title: "Database Modeling with Mongoose & Security Best Practices",
            description: "Schema validation, relations, indexing, and securing endpoints with JWT auth.",
            timeDuration: "3000", // 50 mins
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
          },
        ],
      },
    ],
  },
  {
    categoryName: "Data Science & AI",
    courseName: "Machine Learning & AI Masterclass: From Python to LLMs",
    courseDescription:
      "A comprehensive guide to Data Science, Machine Learning algorithms, Deep Learning with PyTorch, and building real-world AI applications with Large Language Models.",
    whatYouWillLearn:
      "- Master Python for Data Science (NumPy, Pandas, Matplotlib, Seaborn)\n- Implement Supervised and Unsupervised Machine Learning algorithms from scratch\n- Train Deep Neural Networks with PyTorch and TensorFlow\n- Build LLM applications with OpenAI API, LangChain, and vector databases\n- Deploy machine learning models as production REST APIs",
    price: 4999,
    thumbnail:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&auto=format&fit=crop&q=60",
    tags: ["Machine Learning", "Python", "Data Science", "Artificial Intelligence", "Deep Learning"],
    instructions: [
      "Basic math skills (high school algebra and basic statistics)",
      "Passion for learning data science and AI",
      "Any laptop or desktop with Python 3.10+ installed",
    ],
    status: "Published",
    sections: [
      {
        sectionName: "Module 1: Python for Data Science & Numerical Computing",
        subSections: [
          {
            title: "Python Data Structures, NumPy & Vectorization",
            description: "Mastering multi-dimensional arrays, matrix operations, and high-performance computation.",
            timeDuration: "1800",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
          },
          {
            title: "Data Wrangling & Analysis with Pandas",
            description: "Data manipulation, handling missing values, grouping, and exploratory data analysis (EDA).",
            timeDuration: "2400",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
          },
        ],
      },
      {
        sectionName: "Module 2: Core Machine Learning Algorithms",
        subSections: [
          {
            title: "Supervised Learning: Regression, Classification & Trees",
            description: "Linear & Logistic Regression, Decision Trees, Random Forests, and SVMs explained intuitively.",
            timeDuration: "3600",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4",
          },
          {
            title: "Model Evaluation, Hyperparameter Tuning & Cross-Validation",
            description: "Precision, Recall, ROC-AUC, GridSearch, and preventing overfitting in production models.",
            timeDuration: "2100",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
          },
        ],
      },
      {
        sectionName: "Module 3: Generative AI, Prompt Engineering & LLM Apps",
        subSections: [
          {
            title: "Introduction to Transformers & Large Language Models",
            description: "How attention mechanisms work, tokenizer pipelines, and embeddings.",
            timeDuration: "2700",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
          },
          {
            title: "Building RAG Applications with LangChain & Vector DBs",
            description: "Connecting private documents to LLMs with vector search and semantic retrieval.",
            timeDuration: "3300",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
          },
        ],
      },
    ],
  },
];

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB successfully!");

    // 1. Create or Find Categories
    const categoryMap = {};
    for (const catData of sampleCategories) {
      let category = await Category.findOne({ name: catData.name });
      if (!category) {
        category = await Category.create(catData);
        console.log(`Created category: ${catData.name}`);
      } else {
        console.log(`Found existing category: ${catData.name}`);
      }
      categoryMap[catData.name] = category;
    }

    // 2. Create or Find an Instructor
    let instructor = await User.findOne({ accountType: "Instructor" });
    if (!instructor) {
      const hashedPassword = await bcrypt.hash("Instructor@123", 10);
      const profile = await Profile.create({
        gender: "Male",
        dateOfBirth: "1995-05-15",
        about: "Senior Full Stack & AI Architect with 10+ years of industry experience teaching thousands of developers worldwide.",
        contactNumber: "9876543210",
      });

      instructor = await User.create({
        firstName: "Love",
        lastName: "Varshney",
        email: "instructor@studynotion.com",
        password: hashedPassword,
        accountType: "Instructor",
        additionalDetails: profile._id,
        image: "https://api.dicebear.com/7.x/initials/svg?seed=Love%20Varshney",
        active: true,
        approved: true,
      });
      console.log(`Created new default instructor: instructor@studynotion.com (Password: Instructor@123)`);
    } else {
      console.log(`Using existing instructor: ${instructor.email} (${instructor.firstName} ${instructor.lastName})`);
    }

    // 3. Create Sample Courses
    for (const courseData of sampleCoursesData) {
      const existingCourse = await Course.findOne({ courseName: courseData.courseName });
      if (existingCourse) {
        console.log(`Course "${courseData.courseName}" already exists. Skipping.`);
        continue;
      }

      const category = categoryMap[courseData.categoryName];
      if (!category) {
        console.error(`Category ${courseData.categoryName} not found. Skipping course.`);
        continue;
      }

      // Create sections and subsections
      const sectionIds = [];
      for (const secData of courseData.sections) {
        const subSectionIds = [];
        for (const subSecData of secData.subSections) {
          const newSubSection = await SubSection.create({
            title: subSecData.title,
            timeDuration: subSecData.timeDuration,
            description: subSecData.description,
            videoUrl: subSecData.videoUrl,
          });
          subSectionIds.push(newSubSection._id);
        }

        const newSection = await Section.create({
          sectionName: secData.sectionName,
          subSection: subSectionIds,
        });
        sectionIds.push(newSection._id);
      }

      // Create Course
      const newCourse = await Course.create({
        courseName: courseData.courseName,
        courseDescription: courseData.courseDescription,
        instructor: instructor._id,
        whatYouWillLearn: courseData.whatYouWillLearn,
        price: courseData.price,
        tags: courseData.tags,
        category: category._id,
        thumbnail: courseData.thumbnail,
        status: courseData.status,
        instructions: courseData.instructions,
        courseContent: sectionIds,
        studentEnrolled: [],
        ratingAndReview: [],
      });

      // Link course to Instructor
      await User.findByIdAndUpdate(instructor._id, {
        $push: { courses: newCourse._id },
      });

      // Link course to Category
      await Category.findByIdAndUpdate(category._id, {
        $push: { courses: newCourse._id },
      });

      console.log(` Successfully created and published course: "${newCourse.courseName}" (ID: ${newCourse._id})`);
    }

    console.log("\n Seeding completed successfully!");
  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB connection closed.");
    process.exit(0);
  }
}

seed();
