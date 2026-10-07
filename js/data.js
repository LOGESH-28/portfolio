// ─────────────────────────────────────────────────────────────
//  Edit your links here. Empty values hide the matching button.
// ─────────────────────────────────────────────────────────────
window.CONFIG = {
  email: "llogesh28102004@gmail.com",
  phone: "+919791735569",
  phoneLabel: "+91 97917 35569",
  // Contact form delivery (FormSubmit.co, no signup). The FIRST message sent from the live
  // site triggers an activation e-mail to the address above — click "Activate Form" once.
  // After activating, you can swap the address in this URL for the random alias FormSubmit gives you.
  formEndpoint: "https://formsubmit.co/ajax/llogesh28102004@gmail.com",
  linkedin: "https://www.linkedin.com/in/logesh-s28/",
  github: "https://github.com/LOGESH-28",
  instagram: "https://www.instagram.com/logesh._.28/",
  resume: "assets/Logesh_S_AI_ML_Engineer.pdf",
};

// Project categories: "enterprise" | "research" | "genai"
window.PROJECTS = [
  {
    cat: "enterprise",
    org: "LongArc",
    title: "AI-Enabled Replenishment & Middle-Mile Optimization Tool",
    stack: ["Python", "FastAPI", "PyTorch", "Optimization Algorithms"],
    link: "https://replenishmenttool.vercel.app",
    linkLabel: "Live demo",
    points: [
      "SKU-level replenishment requirement calculation & warehouse-to-dark-store allocation.",
      "Dispatch wave planning, vehicle capacity/utilization analysis, and dock capacity assessment.",
      "Cost-per-unit, transportation efficiency, and FnV vs. Dry replenishment modeling.",
      "AI-generated action plans combining operational rules and diagnostic scoring.",
    ],
  },
  {
    cat: "enterprise",
    org: "LongArc",
    title: "AI-Powered Warehouse & Supply Chain Diagnostic Tool",
    stack: ["Python", "Flask", "PostgreSQL", "Diagnostic Frameworks"],
    link: "https://ops-diagnostic-tool.vercel.app",
    linkLabel: "Live demo",
    points: [
      "Configurable diagnostic modules evaluating operations across weighted scoring and maturity levels.",
      "KB + AI architecture: baseline knowledge base combined with AI-driven, context-specific recommendations.",
      "Gap analysis comparing current vs. target performance with prioritization of operational gaps.",
    ],
  },
  {
    cat: "research",
    org: "ResearchBrains",
    title: "LEA-TTA: Robust Lane Detection Framework",
    stack: ["Python", "PyTorch", "Test-Time Adaptation", "Computer Vision"],
    points: [
      "Lane Existence-Aware Test-Time Adaptation (LEA-TTA) for unstructured roads.",
      "Engineered LEAM (Lane Existence Score), ARC (adaptation regulator), and GCAM (geometry-aware regularization).",
      "Evaluated on CULane, IDD, and BDD100K, optimizing Plain IoU, F1 and ECE.",
    ],
  },
  {
    cat: "research",
    org: "ResearchBrains",
    title: "BioMamba-FiLM: Multimodal Brain Tumor Detection",
    stack: ["Python", "PyTorch", "Vision Mamba", "TabNet", "KAN"],
    points: [
      "Multimodal pipeline combining Vision Mamba (MRI feature extraction) and TabNet (genomic learning).",
      "Feature-wise Linear Modulation (FiLM) guides MRI representations with biological vectors for precise glioma grading.",
    ],
  },
  {
    cat: "research",
    org: "ResearchBrains",
    title: "Adaptive Region Partition & Competition Learning for Bone Cancer Classification",
    stack: ["Python", "PyTorch", "Deep Learning", "Medical Image Analysis"],
    points: [
      "Heterogeneity-aware framework addressing intra-tumor variability without manual segmentation.",
      "Dynamic region partition module and region competition mechanism trained end-to-end with image-level labels.",
    ],
  },
  {
    cat: "research",
    org: "ResearchBrains",
    title: "PSRE-Net: Progressive Stage Residual Encoding for Diabetic Retinopathy Grading",
    stack: ["Python", "PyTorch", "EfficientNet-B3", "Computer Vision"],
    points: [
      "Stage-Transition Synthetic Sampler and Progressive Stage Residual Encoder for multi-scale lesion features.",
      "Inter-stage Delta Margin Constraint and Cumulative Delta Ordinal Head for structured severity grading.",
      "Monte Carlo Dropout for prediction uncertainty estimation.",
    ],
  },
  {
    cat: "research",
    org: "ResearchBrains",
    title: "Explainable Medical Image Classification via CLIP-LoRA",
    stack: ["Python", "PyTorch", "CLIP", "LoRA", "Explainable AI"],
    points: [
      "Vision-language foundation model (CLIP) with parameter-efficient fine-tuning (LoRA).",
      "Training-time explanation constraints align model attention with clinical diagnostic markers.",
    ],
  },
  {
    cat: "genai",
    org: "Production · GenAI",
    title: "Hybrid RAG AI Assistant",
    stack: ["Python", "FastAPI", "Groq API", "FAISS", "MLflow", "Docker"],
    link: "", // add your GitHub repo URL
    linkLabel: "GitHub repository",
    points: [
      "Sub-800ms response latency using FastAPI + FAISS + Groq (Llama 3.3 70B).",
      "Hybrid retrieval combining vector search with live web search (DuckDuckGo + Wikipedia).",
      "Dockerised, with MLflow observability tracking 1,000+ document chunks.",
    ],
  },
  {
    cat: "genai",
    org: "Production · GenAI",
    title: "AI Comparison Platform (LLM Benchmark)",
    stack: ["Python", "Streamlit", "Hugging Face", "Groq", "Qwen 2.5"],
    points: [
      "Evaluated open-source and frontier LLMs (Qwen 2.5 vs Llama) on latency, hallucinations and safety.",
      "Multi-turn memory management and jailbreak protection.",
    ],
  },
  {
    cat: "genai",
    org: "Production · GenAI",
    title: "Aura AID — Offline Safety App",
    stack: ["Kotlin", "Jetpack Compose", "RunAnywhere SDK", "GGUF LLM", "Android"],
    points: [
      "Native Android safety app powered by an on-device GGUF LLM for zero-connectivity scenarios.",
      "Shake-to-SOS, automatic crash detection, live location sharing and offline first-aid assistance.",
    ],
  },
  {
    cat: "genai",
    org: "Production · GenAI",
    title: "AI-Powered LinkedIn Automation Bot",
    stack: ["Python", "Gemini 2.5 Flash", "LinkedIn API", "OAuth 2.0"],
    points: [
      "Automated professional content pipeline reducing manual social media effort by ~80%.",
      "Secure OAuth 2.0 integration and structured prompt-engineering templates.",
    ],
  },
  {
    cat: "genai",
    org: "Lavendel Consulting",
    title: "Multi-User Real-Time Eye Gaze Tracking",
    stack: ["Python", "OpenCV", "MediaPipe", "Tkinter"],
    points: [
      "Stable 28+ FPS across 5 simultaneous users for a client deployment.",
      "Fused iris tracking, head-pose estimation and regression models.",
    ],
  },
];
