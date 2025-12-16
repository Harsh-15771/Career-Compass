import logo from "./logo.png";
import gradientBackground from "./gradientBackground.png";
import star from "./star.svg";
import upload_area from "./upload_area.svg";

export const assets = {
  logo,
  gradientBackground,
  star,
  upload_area,
};

export const blogCategories = [
  "All",
  "Software",
  "Product",
  "Consulting",
  "Finance",
  "Core",
  "Data",
];

export const blog_data = [
  // --- CS (Computer Science) ---
  {
    _id: "cs001",
    title: "Acing the FAANG Interview: 4 Essential Data Structures",
    description:
      "<p>Landing a role at a top tech company like Google or Amazon requires mastery of DSA. Focus on these four core structures: Hash Maps, Trees, Graphs, and Heaps. We break down the type of questions you'll face for each one.</p><h2>Phase 1: Hash Maps & Sets</h2><p>Used for efficient lookups and duplicates. Practice problems on two-sum, grouping anagrams, and counting frequencies.</p><h2>Phase 2: Trees & Traversal</h2><p>Understand Binary Search Trees (BSTs) and tree traversal algorithms (Inorder, Preorder, Postorder). Practice boundary traversal and finding the lowest common ancestor (LCA).</p>",
    category: "CS",
    image: "blog_pic_CS_01.jpg",
    createdAt: "2025-10-21T10:00:00.000Z",
    isPublished: true,
    subTitle: "Deep Dive into Data Structures for Top Tech Roles",
  },
  {
    _id: "cs002",
    title: "My Non-Coding Internship Journey at Microsoft: Program Management",
    description:
      "<p>Not every CS role is about coding! I interned as a Program Manager at Microsoft. This required strong communication, project planning, and product sense, not just Python mastery. Here's how I prepped my non-technical resume and tackled the behavioral interviews.</p><h2>The 'Product Sense' Interview</h2><p>Learn to structure your answers around user needs, feature prioritization, and measuring success. Example question: 'How would you improve Microsoft Teams?'</p>",
    category: "CS",
    image: "blog_pic_CS_02.jpg",
    createdAt: "2025-10-15T10:00:00.000Z",
    isPublished: true,
    subTitle: "Shifting Focus from Code to Communication in Tech Interviews",
  },
  // --- ECE (Electronics & Communication Engineering) ---
  {
    _id: "ece003",
    title: "From Chip Design to Placement: Must-Know VLSI Concepts",
    description:
      "<p>For ECE students targeting core companies, VLSI (Very Large Scale Integration) is key. We cover the fundamental interview topics: CMOS logic, timing analysis (setup/hold), and low-power techniques. I secured a role at Qualcomm by focusing on these areas.</p><h2>Timing Constraints</h2><p>Be ready to draw and explain the clock-to-Q, propagation delay, and how to fix setup and hold violations.</p>",
    category: "ECE",
    image: "blog_pic_ECE_01.jpg",
    createdAt: "2025-09-28T10:00:00.000Z",
    isPublished: true,
    subTitle: "A Guide to Acing Core Electronics Interviews",
  },
  {
    _id: "ece004",
    title: "How I Landed an Intern Role at a Telecom Major (Jio/Airtel)",
    description:
      "<p>Telecom interviews often test practical knowledge of 4G/5G architecture, signal processing fundamentals, and networking protocols (OSI model). My journey focused less on coding and more on real-world systems.</p><h2>Networking Deep Dive</h2><p>Understand the difference between TCP and UDP, and be able to explain the three-way handshake.</p>",
    category: "ECE",
    image: "blog_pic_ECE_02.jpg",
    createdAt: "2025-09-10T10:00:00.000Z",
    isPublished: true,
    subTitle: "Preparing for Practical and Theoretical Telecom Interviews",
  },
  // --- Mechanical Engineering ---
  {
    _id: "mech005",
    title:
      "The Big 3: Thermodynamics, Strength of Materials, and Machine Design",
    description:
      "<p>Every core Mechanical placement hinges on these three subjects. I walked into my Tata Motors interview prepared to answer complex problems on heat transfer cycles and stress-strain curves. Focus on clarity over rote memorization.</p><h2>Machine Design Focus</h2><p>Practice problems on gear design, bearing selection, and fatigue failure criteria (Goodman, Soderberg).</p>",
    category: "Mechanical",
    image: "blog_pic_MECH_01.jpg",
    createdAt: "2025-11-01T10:00:00.000Z",
    isPublished: true,
    subTitle: "Core Mechanical Subjects You Cannot Skip for Placements",
  },
  {
    _id: "mech006",
    title: "My Experience as an R&D Intern at a Robotics Startup",
    description:
      "<p>Securing an R&D role requires showcasing practical projects. My portfolio included a custom 3D printer and a simple robotic arm. The interview focused heavily on my CAD software skills and FEA (Finite Element Analysis) knowledge.</p><h2>Project Presentation Tips</h2><p>Dedicate 60% of your time to explaining the *problem* and the *design choices*, not just the final result.</p>",
    category: "Mechanical",
    image: "blog_pic_MECH_02.jpg",
    createdAt: "2025-11-05T10:00:00.000Z",
    isPublished: true,
    subTitle: "Leveraging CAD and FEA for Robotics Interviews",
  },
  // --- Civil Engineering ---
  {
    _id: "civil007",
    title: "Structures and Surveying: Keys to a Successful Civil Placement",
    description:
      "<p>Civil Engineering placements often require detailed knowledge of structural analysis, concrete technology, and surveying principles. I used online courses to supplement my university lectures, which helped me land a site engineer role at L&T.</p><h2>Concrete Mix Design</h2><p>Know the difference between various concrete grades and how admixtures affect workability and strength.</p>",
    category: "Civil",
    image: "blog_pic_CIVIL_01.jpg",
    createdAt: "2025-10-25T10:00:00.000Z",
    isPublished: true,
    subTitle: "The Must-Knows for Core Civil Engineering Interviews",
  },
  // --- Electrical Engineering ---
  {
    _id: "ee008",
    title:
      "Power Systems vs. Control Systems: Choosing Your EE Placement Focus",
    description:
      "<p>Electrical Engineering offers diverse paths. This post compares the preparation strategies for Power Grid/Distribution roles versus Industrial Automation/Control roles. I chose Controls and focused on PID controllers and stability analysis (Bode plots).</p><h2>PID Controller Tuning</h2><p>Be prepared to discuss Ziegler-Nichols tuning method and the practical effect of changing P, I, and D parameters.</p>",
    category: "Electrical",
    image: "blog_pic_EE_01.jpg",
    createdAt: "2025-11-12T10:00:00.000Z",
    isPublished: true,
    subTitle: "A Comparative Guide to Electrical Engineering Placement Streams",
  },
  // --- Chemical Engineering ---
  {
    _id: "chem009",
    title:
      "Landing an Internship at a Refinery (Reliance/BPCL): Process Safety Focus",
    description:
      "<p>For Chemical Engineering, the interview focus often shifts to practical application of thermodynamics and process safety. My successful internship required me to clearly explain concepts like HAZOP and the importance of interlocks in a P&ID diagram.</p><h2>Thermodynamics in Practice</h2><p>Brush up on your knowledge of distillation columns, heat exchangers, and P-V-T diagrams for real processes.</p>",
    category: "Chemical",
    image: "blog_pic_CHEM_01.jpg",
    createdAt: "2025-10-30T10:00:00.000Z",
    isPublished: true,
    subTitle: "Key Concepts for Oil, Gas, and Process Industry Interviews",
  },
  // --- Architecture ---
  {
    _id: "arch010",
    title:
      "Portfolio Perfection: 5 Essential Tips for Getting Noticed by Top Firms",
    description:
      "<p>In Architecture, your portfolio *is* your resume. Learn how to curate projects, prioritize presentation flow, and balance academic work with practical experience. I landed a coveted position at a global firm by showcasing digital fabrication skills.</p><h2>Digital Fabrication Showcase</h2><p>Include clear images and descriptions of any 3D printing, laser cutting, or CNC work you have done.</p>",
    category: "Architecture",
    image: "blog_pic_ARCH_01.jpg",
    createdAt: "2025-09-01T10:00:00.000Z",
    isPublished: true,
    subTitle: "How to Build a High-Impact Architecture Portfolio",
  },
  // --- Metallurgy/Meta ---
  {
    _id: "meta011",
    title:
      "Metallurgy Placements: Focus on Material Science and Failure Analysis",
    description:
      "<p>My journey into a core metallurgy role at a steel plant (SAIL) involved intense questions on phase diagrams (Iron-Carbon), non-destructive testing (NDT) methods, and corrosion control. Practice sketching common crystal structures.</p><h2>NDT Methods Explained</h2><p>Be ready to detail the differences between ultrasonic testing, radiographic testing, and magnetic particle inspection.</p>",
    category: "Meta",
    image: "blog_pic_META_01.jpg",
    createdAt: "2025-11-15T10:00:00.000Z",
    isPublished: true,
    subTitle: "Preparing for Core Interviews in Steel and Manufacturing",
  },
  // --- Mining Engineering ---
  {
    _id: "mine012",
    title:
      "Safety First: Essential Topics for Mining Placements (Ventilation & Rock Mechanics)",
    description:
      "<p>Mining interviews prioritize safety protocols and practical knowledge of operations. My successful placement at Coal India required me to demonstrate expertise in mine ventilation planning and stress analysis in rock formations.</p><h2>Ventilation Basics</h2><p>Understand the importance of auxiliary fans and how to calculate required airflow rates.</p>",
    category: "Mining",
    image: "blog_pic_MINE_01.jpg",
    createdAt: "2025-10-05T10:00:00.000Z",
    isPublished: true,
    subTitle: "Interview Preparation for the Mining Industry",
  },
  // --- Cross-Disciplinary (CS/ECE) ---
  {
    _id: "cross013",
    title:
      "The Rise of Data Science Roles: My Transition from an Electrical Background",
    description:
      "<p>A growing number of students from non-CS backgrounds are entering Data Science. I outline the transition path, focusing on the statistical models, Python libraries (Pandas, Scikit-learn), and machine learning projects I highlighted in my resume.</p><h2>Statistical Foundations</h2><p>You must understand linear regression, logistic regression, and key metrics like precision and recall.</p>",
    category: "CS",
    image: "blog_pic_CROSS_01.jpg",
    createdAt: "2025-11-20T10:00:00.000Z",
    isPublished: true,
    subTitle: "A Non-CS Student's Guide to Cracking Data Science Interviews",
  },
  // --- General Placement Advice ---
  {
    _id: "gen014",
    title:
      "The Power of the Story: Crafting the Perfect 'Tell Me About Yourself'",
    description:
      "<p>This is the most crucial interview question! Don't just list your resume points. Use the **Present-Past-Future** framework: your current role/project, the key past experiences that led you here, and what you hope to achieve next (related to the company). It should be under 90 seconds.</p><h2>Present-Past-Future Structure</h2><p>Example: I'm currently leading the Robotics club (Present), which builds on my passion developed during my summer internship (Past), and I want to apply that hands-on approach to your R&D team (Future).</p>",
    category: "Meta", // Using 'Meta' for general advice/platform info
    image: "blog_pic_GEN_01.jpg",
    createdAt: "2025-12-01T10:00:00.000Z",
    isPublished: true,
    subTitle: "A Winning Framework for the Opening Interview Question",
  },
  // --- Internship Focus ---
  {
    _id: "gen015",
    title:
      "Internship vs. FTE: How to Convert Your Summer Internship to a Full-Time Offer",
    description:
      "<p>Your internship is a 3-month long interview. This post covers key strategies: seeking high-visibility projects, consistent communication with your manager, and proactively soliciting feedback. Do not wait for the final review to ask about the full-time offer process.</p><h2>Feedback Loop</h2><p>Schedule a quick 15-minute check-in with your manager every two weeks specifically for performance feedback, not task updates.</p>",
    category: "Meta", // Using 'Meta' for general advice/platform info
    image: "blog_pic_GEN_02.jpg",
    createdAt: "2025-12-10T10:00:00.000Z",
    isPublished: true,
    subTitle: "Strategies for a Successful Internship Conversion",
  },
];

export const footer_data = [
  {
    title: "Quick Links",
    links: ["Home", "About Us", "Contact Us", "FAQs"],
  },
  {
    title: "Resources",
    links: ["Internship Blogs", "Placement Blogs"],
  },
  {
    title: "Follow Us",
    links: ["Instagram", "Twitter", "Facebook", "Youtube"],
  },
];

export const comments_data = [
  {
    _id: "6811ed9e7836a82ba747cb25",
    blog: blog_data[0],
    name: "Michael Scott",
    content: "This is my new comment",
    isApproved: false,
    createdAt: "2025-04-30T09:30:06.918Z",
    updatedAt: "2025-04-30T09:30:06.918Z",
    __v: 0,
  },

  {
    _id: "6810a752fbb942aa7cbf4adb",
    blog: blog_data[1],
    name: "John Doe",
    content: "This is a nice blog",
    isApproved: false,
    createdAt: "2025-04-29T12:15:42.331Z",
    updatedAt: "2025-04-29T12:15:42.331Z",
    __v: 0,
  },

  {
    _id: "6812bc4f83ae29ab1c017aa3",
    blog: blog_data[2],
    name: "Pam Beesly",
    content: "Loved the explanation, very clear!",
    isApproved: false,
    createdAt: "2025-05-01T08:10:25.221Z",
    updatedAt: "2025-05-01T08:10:25.221Z",
    __v: 0,
  },

  {
    _id: "6812c0f7d2f739bd91e92f44",
    blog: blog_data[3],
    name: "Jim Halpert",
    content: "Great insights. Looking forward to more posts!",
    isApproved: false,
    createdAt: "2025-05-01T08:45:17.904Z",
    updatedAt: "2025-05-01T08:45:17.904Z",
    __v: 0,
  },

  {
    _id: "6812c3b7af352bcabc4265cd",
    blog: blog_data[4],
    name: "Dwight Schrute",
    content: "Fact: This blog is excellent.",
    isApproved: false,
    createdAt: "2025-05-01T09:02:46.102Z",
    updatedAt: "2025-05-01T09:02:46.102Z",
    __v: 0,
  },

  {
    _id: "6812c5c83f912ab91dc91ae1",
    blog: blog_data[0],
    name: "Holly Flax",
    content: "Very helpful information, thanks for sharing!",
    isApproved: false,
    createdAt: "2025-05-01T09:15:30.512Z",
    updatedAt: "2025-05-01T09:15:30.512Z",
    __v: 0,
  },
];
