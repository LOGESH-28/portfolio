// ==========================================
// LOGESH S PORTFOLIO - MAIN JAVASCRIPT
// Tech Growth Theme - FINAL CORRECTED VERSION v4
// ==========================================

document.addEventListener('DOMContentLoaded', function() {

    const debounce = (func, delay) => {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    };

    // --- GSAP Check ---
    if (typeof gsap === 'undefined') {
        console.error("GSAP library not loaded. Animations may be disabled or fallback used. Ensure GSAP script tag is included BEFORE main.js.");
    }

    // ==========================================
    // CUSTOM CURSOR
    // ==========================================
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (!isTouchDevice && window.innerWidth >= 1024 && typeof gsap !== 'undefined') {
        const cursor = document.querySelector('.cursor');
        const cursorFollower = document.querySelector('.cursor-follower');

        if (cursor && cursorFollower) {
            gsap.set(cursor, { xPercent: -50, yPercent: -50 });
            gsap.set(cursorFollower, { xPercent: -50, yPercent: -50 });

            window.addEventListener('mousemove', e => {
                gsap.to(cursor, { duration: 0.1, x: e.clientX, y: e.clientY }); // Faster cursor follow
                gsap.to(cursorFollower, { duration: 0.4, x: e.clientX, y: e.clientY }); // Slightly faster follower
            });

            // Selector for all interactive elements
            const clickableElements = document.querySelectorAll(
                '.btn, a, button, .project-card, .expertise-card, .leadership-card, ' +
                '.clickable, .lang-card, .cert-card, .timeline-item, .service-card, .testimonial-card, .tag'
            );
            
            clickableElements.forEach(el => {
                el.addEventListener('mouseenter', () => cursorFollower.classList.add('grow'));
                el.addEventListener('mouseleave', () => cursorFollower.classList.remove('grow'));
            });
        }
    } else if (!isTouchDevice && window.innerWidth >= 1024) {
         console.warn("GSAP not loaded, custom cursor disabled.");
    }

    // ==========================================
    // NEURAL CANVAS BACKGROUND
    // ==========================================
    const canvas = document.getElementById('neural-bg');
    let animationId;
    let isAnimationRunning = true;
    let animateCanvas = null; // Declare globally for pause/resume

     // Define pause/resume globally
     window.pauseCanvasAnimation = () => { isAnimationRunning = false; };
     window.resumeCanvasAnimation = () => {
         if (!isAnimationRunning && canvas && !isTouchDevice && window.innerWidth >= 768) {
             isAnimationRunning = true;
             if (typeof animateCanvas === "function") {
                  animateCanvas(); // Restart animation loop
             }
         }
     };

    if (canvas && !isTouchDevice && window.innerWidth >= 768) {
        const ctx = canvas.getContext('2d');
        let particles = [];

        const setupCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            particles = [];
            const particleCount = Math.max(30, Math.floor(window.innerWidth / 30)); // Reduced count
            for (let i = 0; i < particleCount; i++) particles.push(new Particle());
        };

        class Particle {
            constructor() { this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height; this.vx = (Math.random() - 0.5) * 0.25; this.vy = (Math.random() - 0.5) * 0.25; this.radius = Math.random() * 1.2 + 0.8; }
            update() { this.x += this.vx; this.y += this.vy; if (this.x < this.radius || this.x > canvas.width - this.radius) this.vx *= -1; if (this.y < this.radius || this.y > canvas.height - this.radius) this.vy *= -1; }
            draw() { const color = 'rgba(79, 70, 229, 0.3)'; ctx.fillStyle = color; ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); ctx.fill(); }
        }

        const connectParticles = () => {
            const maxDistance = 110; const lineColor = '79, 70, 229';
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const distance = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
                    if (distance < maxDistance) { ctx.strokeStyle = `rgba(${lineColor}, ${0.6 * (1 - distance / maxDistance)})`; ctx.lineWidth = 0.4; ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke(); }
                }
            }
        };

        // Assign to global variable
        animateCanvas = () => {
            if (!isAnimationRunning) { cancelAnimationFrame(animationId); return; }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            connectParticles();
            animationId = requestAnimationFrame(animateCanvas);
        };

        setupCanvas();
        animateCanvas();
        window.addEventListener('resize', debounce(setupCanvas, 250));
    } else if (canvas) {
         canvas.style.display = 'none';
    }

    // ==========================================
    // NAVIGATION
    // ==========================================
    const navbar = document.getElementById('navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-link');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            const isActive = hamburger.classList.toggle('active');
            navLinks.classList.toggle('active', isActive);
            document.body.classList.toggle('no-scroll', isActive);
            document.documentElement.classList.toggle('no-scroll', isActive);
        });

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                if (hamburger.classList.contains('active')) {
                     setTimeout(() => {
                        hamburger.classList.remove('active');
                        navLinks.classList.remove('active');
                        document.body.classList.remove('no-scroll');
                        document.documentElement.classList.remove('no-scroll');
                    }, 150);
                }
            });
        });
    }

    // Navbar hide on scroll & add scrolled class
    if (navbar) {
        let lastScrollY = window.scrollY;
        window.addEventListener('scroll', debounce(() => {
             const currentScrollY = window.scrollY;
             navbar.classList.toggle('scrolled', currentScrollY > 50);
             if (currentScrollY > 100) {
                 navbar.classList.toggle('hidden', currentScrollY > lastScrollY);
             } else {
                  navbar.classList.remove('hidden');
             }
             lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
        }, 50));
    }

    // Active nav links based on scroll position
    const sections = document.querySelectorAll('main section[id]');
    const updateActiveLink = () => {
         let currentSectionId = '';
         const navHeight = navbar ? navbar.offsetHeight : 70;
         const scrollThreshold = window.innerHeight * 0.4;
         const scrollPosition = window.scrollY;

         sections.forEach(section => {
             const sectionTop = section.offsetTop;
             const sectionBottom = sectionTop + section.offsetHeight;
             if (scrollPosition + navHeight + scrollThreshold >= sectionTop && scrollPosition + navHeight + scrollThreshold < sectionBottom) {
                 currentSectionId = section.getAttribute('id');
             }
         });

         if (!currentSectionId) {
              if (scrollPosition < window.innerHeight / 2) { currentSectionId = 'home'; }
              else if (scrollPosition + window.innerHeight >= document.documentElement.scrollHeight - 50 && sections.length > 0) { currentSectionId = sections[sections.length - 1].getAttribute('id'); }
         }

         const currentPagePath = window.location.pathname.split('/').pop() || 'index.html';

         navItems.forEach(item => {
             const href = item.getAttribute('href');
             const linkTargetPage = href ? href.split('#')[0].split('/').pop() : '';
             const linkHash = href ? href.split('#')[1] : null;

             let isActive = false;
             if ((currentPagePath === 'index.html' || currentPagePath === '') && linkHash && (linkTargetPage === '' || linkTargetPage === 'index.html')) {
                 isActive = (linkHash === currentSectionId);
             }
             else if (linkTargetPage && linkTargetPage !== 'index.html' && !linkHash) {
                  isActive = (linkTargetPage === currentPagePath);
             }
             item.classList.toggle('active', isActive);
         });
    };

    window.addEventListener('scroll', debounce(updateActiveLink, 100));
    window.addEventListener('resize', debounce(updateActiveLink, 100));
    updateActiveLink(); // Initial check

    // ==========================================
    // STAT COUNTER ANIMATION (Using GSAP)
    // ==========================================
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length > 0 && typeof gsap !== 'undefined') {
        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    const stat = entry.target;
                    const targetValue = parseFloat(stat.getAttribute('data-target'));
                    const isFloat = targetValue % 1 !== 0;
                    let counter = { value: 0 };

                    gsap.to(counter, {
                        value: targetValue, duration: 1.5, ease: "power1.out",
                        onUpdate: () => { stat.textContent = isFloat ? counter.value.toFixed(2) : Math.ceil(counter.value); },
                        onComplete: () => { stat.textContent = isFloat ? targetValue.toFixed(2) : targetValue; stat.classList.add('counted'); observer.unobserve(stat); }
                    });
                }
            });
        }, { threshold: 0.5 });
        statNumbers.forEach(stat => statsObserver.observe(stat));
    } else if (statNumbers.length > 0) {
        console.warn("GSAP not loaded. Stat counter fallback.");
        statNumbers.forEach(stat => { const t = parseFloat(stat.dataset.target); stat.textContent = (t % 1 !== 0) ? t.toFixed(2) : t; });
    }

    // ==========================================
    // SKILL/LANGUAGE BAR ANIMATION (Using GSAP - Scroll Only)
    // ==========================================
     if (typeof gsap !== 'undefined') {
         document.querySelectorAll('.skill-category, .language-cards .lang-card').forEach(parentBlock => {
             const barsContainer = parentBlock.querySelector('.skill-bars, .lang-bars');
             if (!barsContainer) return;
             const bars = barsContainer.querySelectorAll('.bar-fill');
             if (!bars || bars.length === 0) return;

             gsap.set(bars, { width: '0%' }); // Set initial state

             const barObserver = new IntersectionObserver((entries, observer) => {
                 if (entries[0].isIntersecting) {
                     gsap.to(bars, {
                         width: (i, el) => `${el.dataset.level || '0'}%`, duration: 1.5, ease: 'power2.out', stagger: 0.1, overwrite: 'auto'
                     });
                     observer.unobserve(parentBlock);
                 }
             }, { threshold: 0.5 });
             barObserver.observe(parentBlock);
             // Removed hover/touch re-animation to prevent flickering
         });
     } else {
          console.warn("GSAP not loaded. Skill bar fallback.");
          document.querySelectorAll('.bar-fill[data-level]').forEach(bar => { bar.style.width = bar.dataset.level + '%'; });
     }

    // ==========================================
    // SCROLL ANIMATIONS (Fade In Up - REQUIRES CSS - Refined Selector)
    // ==========================================
    const animatedElements = document.querySelectorAll(
        '.project-card, .expertise-card, .leadership-card, .timeline-item, ' +
        '.pillar-card, .offering-card, .journey-item, .initiative-card, ' +
        '.value-card, .info-card, .service-card, .testimonial-card'
        // This selector correctly excludes .stat-card, .lang-card, .cert-card,
        // and the text elements inside .about-left
    );

    if (animatedElements.length > 0) {
        if ('IntersectionObserver' in window) {
            const animationObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
            animatedElements.forEach(el => animationObserver.observe(el));
        } else {
             console.warn("IntersectionObserver not supported. Scroll animations disabled.");
             animatedElements.forEach(el => el.classList.add('visible')); // Fallback
        }
    }
     // --- CSS Reminder (Should be in style.css) ---
     /*
     .project-card, .expertise-card, etc... {
         opacity: 0;
         transform: translateY(30px);
         transition: opacity 0.6s ease-out, transform 0.6s ease-out;
         will-change: opacity, transform;
     }
     .visible {
         opacity: 1;
         transform: translateY(0);
     }
     .about-intro, .about-mission, .stat-card, etc... {
         opacity: 1 !important;
         transform: none !important;
         transition: ... !important; // Only allow hover transitions
         will-change: auto !important;
     }
     */

    // ==========================================
    // PROJECT TABS
    // ==========================================
    const tabContainer = document.querySelector('.projects-tabs');
    if (tabContainer) {
        const tabBtns = tabContainer.querySelectorAll('.tab-btn');
        const projectCards = document.querySelectorAll('.projects-grid .project-card');

        projectCards.forEach(card => {
             card.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out, display 0s linear 0.3s';
        });

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const activeTab = btn.getAttribute('data-tab');
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                projectCards.forEach(card => {
                     const cardCategory = card.getAttribute('data-category');
                     const shouldShow = (activeTab === 'all' || cardCategory === activeTab);
                     const isCurrentlyVisible = card.style.display !== 'none' && card.style.opacity !== '0';

                     if (shouldShow && !isCurrentlyVisible) {
                         card.style.removeProperty('display');
                         requestAnimationFrame(() => {
                            requestAnimationFrame(() => {
                                 card.style.opacity = '1';
                                 card.style.transform = 'translateY(0) scale(1)';
                            });
                         });
                     } else if (!shouldShow && isCurrentlyVisible) {
                         card.style.opacity = '0';
                         card.style.transform = 'translateY(20px) scale(0.95)';
                         setTimeout(() => { if (card.style.opacity === '0') card.style.display = 'none'; }, 300);
                     }
                });
            });
        });
    }

    // ==========================================
    // MODAL SYSTEM (COMPLETE WITH ALL DATA)
    // ==========================================
    const modalData = {
        // --- Project Modals ---
        'gaze-tracker': { type: 'project', image: 'images/Eye gaze.png', title: 'Multi-User Real-Time Eye Gaze Tracker', description: 'A sophisticated computer vision system tracking eye gaze in real-time for multiple users with unique labels and color-coded indicators. Features advanced face recognition and real-time calibration in Tkinter UI.', tech: ['Computer Vision', 'Python', 'OpenCV', 'MediaPipe', 'Real-time Processing'], cta: `<a href="https://github.com/LOGESH-28" target="_blank" rel="noopener noreferrer" class="btn btn-primary clickable">View on GitHub</a>` },
        'gender-prediction': { type: 'project', image: 'images/Gender pred.png', title: 'Gender Prediction Using CNNs', description: 'Ensemble deep learning model combining MobileNetV2 and InceptionV3 achieving high accuracy on facial datasets. Implemented robust preprocessing and data augmentation techniques.', tech: ['CNN', 'TensorFlow', 'Deep Learning', 'Keras', 'Computer Vision'], cta: `<a href="https://github.com/LOGESH-28" target="_blank" rel="noopener noreferrer" class="btn btn-primary clickable">View on GitHub</a>` },
        'ai-assistant': { type: 'project', image: 'images/Ai AS.png', title: 'AI Assistant with Voice Recognition', description: 'Voice-enabled assistant with reminders, web search, and intent recognition capabilities. Features natural language processing for seamless human-computer interaction.', tech: ['NLP', 'Speech Recognition', 'Python', 'Automation', 'Web APIs'], cta: `<a href="https://github.com/LOGESH-28" target="_blank" rel="noopener noreferrer" class="btn btn-primary clickable">View on GitHub</a>` },
        'student-monitor': { type: 'project', image: 'images/Stdnt attention.png', title: 'Student Attention Monitoring System', description: 'Computer vision application detecting student presence and monitoring engagement with detailed analytics. Generates comprehensive attendance reports and engagement metrics.', tech: ['Face Detection', 'Analytics', 'Computer Vision', 'Education Tech', 'Python'], cta: `<a href="https://github.com/LOGESH-28" target="_blank" rel="noopener noreferrer" class="btn btn-primary clickable">View on GitHub</a>` },
        'excel-dashboard': { type: 'project', image: 'images/Bank.png', title: 'Banking Analytics Dashboard', description: '3 comprehensive dashboards analyzing customer behavior, transactions, and loan performance. Integrated pivot tables, KPIs, slicers, and interactive filters for decision-making.', tech: ['Excel', 'KPIs', 'Pivot Tables', 'Data Analysis', 'Dashboarding'], cta: `<a href="https://github.com/LOGESH-28" target="_blank" rel="noopener noreferrer" class="btn btn-primary clickable">View on GitHub</a>` },
        'powerbi-dashboard': { type: 'project', image: 'images/IPL.png', title: 'IPL Team Performance Dashboard', description: 'Analyzed IPL matches (2008-2024) with DAX-powered metrics and dynamic filtering. Implemented team performance analysis with advanced visualizations.', tech: ['Power BI', 'DAX', 'Analytics', 'Sports Analytics', 'Data Visualization'], cta: `<a href="https://github.com/LOGESH-28" target="_blank" rel="noopener noreferrer" class="btn btn-primary clickable">View on GitHub</a>` },
        'tableau-dashboard': { type: 'project', image: 'images/Tab.png', title: 'Advanced Learning Analytics Dashboard', description: 'E-learning engagement tracking with scores, completion rates, and Top-N analysis. Features parameter filters and course-level drilldowns for detailed insights.', tech: ['Tableau', 'Data Visualization', 'Analytics', 'Education', 'Filters'], cta: `<a href="https://github.com/LOGESH-28" target="_blank" rel="noopener noreferrer" class="btn btn-primary clickable">View on GitHub</a>` },
        'knime-spam': { type: 'project', image: 'images/spam.png', title: 'Spam and Fraud Detection', description: 'Spam classification (achieving 85.54% accuracy) and fraud detection using machine learning. Preprocessed data with tokenization, stopword removal, and feature scaling.', tech: ['KNIME', 'ML', 'Classification', 'NLP', 'Tokenization'], cta: `<a href="https://github.com/LOGESH-28" target="_blank" rel="noopener noreferrer" class="btn btn-primary clickable">View on GitHub</a>` },
        'llm-specialist': { type: 'project', image: 'images/llm1.png', title: 'Large Language Models Specialist', description: 'Expertise in fine-tuning, prompt engineering, and deploying LLMs for various applications. Specialized in GPT, Llama, and Mistral architectures.', tech: ['LLM', 'Fine-tuning', 'Prompt Engineering', 'RAG', 'Vector Databases'], cta: `<a href="https://github.com/LOGESH-28" target="_blank" rel="noopener noreferrer" class="btn btn-primary clickable">View Projects</a>` },
        'vector-db': { type: 'project', image: 'images/vectordb.png', title: 'Vector Databases & RAG', description: 'Building efficient semantic search systems and RAG pipelines with vector embeddings. Expertise in Pinecone, ChromaDB, and FAISS for intelligent retrieval.', tech: ['Vector DB', 'RAG', 'Semantic Search', 'Embeddings', 'Similarity Matching'], cta: `<a href="https://github.com/LOGESH-28" target="_blank" rel="noopener noreferrer" class="btn btn-primary clickable">View Projects</a>` },
        'ai-agents': { type: 'project', image: 'images/aiagents.png', title: 'Autonomous AI Agents', description: 'Developing autonomous agents for task automation and intelligent decision making. Building systems that can reason, plan, and execute complex workflows.', tech: ['AI Agents', 'Autonomous Systems', 'Planning', 'Automation', 'Tool Usage'], cta: `<a href="https://github.com/LOGESH-28" target="_blank" rel="noopener noreferrer" class="btn btn-primary clickable">View Projects</a>` },
        'rag-systems': { type: 'project', image: 'images/rag.png', title: 'RAG Systems', description: 'Building Retrieval Augmented Generation systems for accurate, context-aware responses. Creating intelligent systems that retrieve and synthesize relevant information.', tech: ['RAG', 'Information Retrieval', 'Context Management', 'LLM', 'Knowledge Bases'], cta: `<a href="https://github.com/LOGESH-28" target="_blank" rel="noopener noreferrer" class="btn btn-primary clickable">View Projects</a>` },

        // --- Experience & Education Modals ---
        'lavendel': { type: 'detail', logo: 'images/lavendel.png', title: 'AI Intern', company: 'Lavendel Consulting', description: '<p><strong>Duration:</strong> May 2025 - Aug 2025</p><ul><li>Built multi-user gaze tracking app with real-time accuracy and usability</li><li>Added face recognition, calibration, and gaze prediction in Tkinter UI</li><li>Optimized system for stable high-FPS multi-user performance</li><li>Implemented unique user labels and color-coded indicators</li></ul>', linkHref: 'https://lavendelconsulting.com/', linkText: 'Visit Company' },
        'kit-btech': { type: 'detail', logo: 'images/kit-logo.png', title: 'B.Tech in AI & Data Science', company: 'Kangeyam Institute of Technology', description: '<p><strong>Duration:</strong> 2022 - Present</p><p><strong>CGPA:</strong> 8.45</p><p><strong>Relevant Coursework:</strong> Machine Learning, Deep Learning, Data Visualization, Computer Vision, Natural Language Processing, Statistical Analysis, Data Structures, Algorithms.</p><p><strong>Activities:</strong> Founder of Vidhai AI, President of AI & DS Association, Rotaract Mentor.</p>', linkHref: 'https://www.kitech.edu.in/', linkText: 'Visit College' },
        'gkt': { type: 'detail', logo: 'images/glob.png', title: 'Data Analysis Intern', company: 'Global Knowledge Technologies', description: '<p><strong>Duration:</strong> In-Plant Internship</p><p>Gained hands-on practice in KNIME for data analysis and feature extraction. Worked on preprocessing techniques and basic model deployment workflows.</p><ul><li>Data preprocessing and cleaning</li><li>Feature extraction and selection</li><li>Building KNIME workflows</li><li>Basic machine learning model implementation</li></ul>', linkHref: 'https://www.globalknowledgetech.com/', linkText: 'Visit Company' },
        'navarasam-hsc': { type: 'detail', logo: 'images/Nav.png', title: 'Higher Secondary (HSC)', company: 'Navarasam Matriculation Hr. Sec. School', description: '<p><strong>Duration:</strong> 2020 - 2022</p><p><strong>Grade:</strong> 77%</p><p><strong>Stream:</strong> Computer Science</p><p>Completed higher secondary education with focus on computer science fundamentals, mathematics, and programming basics. Developed strong foundation in problem-solving and analytical thinking.</p>', linkHref: '#', linkText: 'School Info' },
        'navarasam-sslc': { type: 'detail', logo: 'images/Nav.png', title: 'SSLC', company: 'Navarasam Matriculation Hr. Sec. School', description: '<p><strong>Duration:</strong> 2019 - 2020</p><p><strong>Grade:</strong> 98%</p><p>Completed secondary school education with outstanding academic performance, laying strong foundation for higher studies. Demonstrated excellence in mathematics and science subjects.</p>', linkHref: '#', linkText: 'School Info' },

        // --- Language Modals ---
        'tamil': { type: 'detail', logo: null, title: 'தமிழ் (Tamil)', company: 'Native Language Proficiency', description: 'Tamil is my native and mother tongue. I am deeply connected to my roots and culture, maintaining fluency in reading, writing, and speaking.<br><br><blockquote style="border-left: 3px solid var(--primary); padding-left: 1rem; margin: 1rem 0; font-style: italic; color: var(--text-light);">திருக்குறள்:<br>அகர முதல எழுத்தெல்லாம் ஆதி<br>பகவன் முதற்றே உலகு.<br><small style="display: block; margin-top: 0.5rem;">— திருக்குறள் 1</small></blockquote><p><strong>Meaning:</strong> "As the letter A is the first of all letters, so the Eternal God is first in the world." This reflects my belief that every great journey starts with fundamental knowledge.</p>' },
        'english': { type: 'detail', logo: null, title: 'English', company: 'Professional Working Proficiency', description: 'English serves as a bridge connecting me globally while keeping my roots intact. I use English for professional communication, technical documentation, and global collaboration.<br><br><blockquote style="border-left: 3px solid var(--primary); padding-left: 1rem; margin: 1rem 0; font-style: italic; color: var(--text-light);">"Language is the road map of a culture. It tells you where its people come from and where they are going."<br><small style="display: block; margin-top: 0.5rem;">— Rita Mae Brown</small></blockquote><p>This quote resonates with my journey of using English as a tool for global communication while preserving my cultural identity.</p>' },

        // --- Certification Modals ---
        'nptel-python': { type: 'detail', logo: null, title: 'Joy of Computing Using Python', company: 'NPTEL Certification', description: '<p><strong>Issued By:</strong> NPTEL</p><p>Comprehensive course covering Python programming fundamentals, data structures, algorithms, and practical computing applications. Gained proficiency in problem-solving using Python.</p><ul><li>Python Fundamentals</li><li>Data Structures</li><li>Algorithms</li><li>Computational Thinking</li></ul>' },
        'nptel-cloud': { type: 'detail', logo: null, title: 'Foundation of Cloud, IoT & Edge ML', company: 'NPTEL Certification', description: '<p><strong>Issued By:</strong> NPTEL</p><p>Gained foundational knowledge in cloud computing architectures, Internet of Things systems, and machine learning deployment at the edge.</p><ul><li>Cloud Computing Models</li><li>IoT Architecture</li><li>Edge Computing Concepts</li><li>Edge ML Basics</li></ul>' },
        'knime-ai': { type: 'detail', logo: null, title: 'Artificial Intelligence Tool Proficiency', company: 'KNIME Certification', description: '<p><strong>Issued By:</strong> KNIME</p><p>Certified in using the KNIME Analytics Platform for building end-to-end data science workflows, ML pipelines, and AI applications using visual programming.</p><ul><li>KNIME Workflow Design</li><li>Data Preprocessing</li><li>ML Integration</li><li>Visual Programming</li></ul>' },
        'infosys-prompt': { type: 'detail', logo: null, title: 'Prompt Engineering Techniques', company: 'Infosys Springboard Certification', description: '<p><strong>Issued By:</strong> Infosys Springboard</p><p>Mastered advanced prompt engineering techniques for LLMs, including chain-of-thought prompting, few-shot learning, and context optimization.</p><ul><li>Prompt Design</li><li>Chain-of-Thought</li><li>Few-Shot Learning</li><li>Context Optimization</li></ul>' },

        // --- Expertise Modals ---
        'genai-expertise': { type: 'detail', logo: null, title: 'Generative AI Expertise', company: 'Core Competencies', description: '<p>Deep understanding and practical application of generative models:</p><ul><li><strong>Large Language Models (LLMs):</strong> Fine-tuning, prompt engineering, deployment (GPT, Llama, Mistral)</li><li><strong>Vector Databases:</strong> Semantic search, embeddings (Pinecone, ChromaDB, FAISS)</li><li><strong>RAG Systems:</strong> Retrieval Augmented Generation for accurate responses</li><li><strong>AI Agents:</strong> Autonomous task execution and decision making</li><li><strong>Prompt Engineering:</strong> Advanced techniques for optimal model performance</li></ul>' },
        'cv-expertise': { type: 'detail', logo: null, title: 'Computer Vision Expertise', company: 'Core Competencies', description: '<p>Proficient in analyzing and interpreting visual data:</p><ul><li><strong>Image Classification & Object Detection:</strong> Identifying and locating objects</li><li><strong>Face Recognition & Analysis:</strong> Identity verification, attribute analysis</li><li><strong>Real-time Processing:</strong> Efficient video stream applications (e.g., Gaze Tracking)</li><li><strong>Image Segmentation:</strong> Pixel-level understanding</li><li><strong>Frameworks:</strong> OpenCV, MediaPipe, TensorFlow, Keras</li></ul>' },
        'analytics-expertise': { type: 'detail', logo: null, title: 'Data Analytics Expertise', company: 'Core Competencies', description: '<p>Skilled in transforming raw data into actionable insights:</p><ul><li><strong>BI Tools:</strong> Power BI, Tableau for interactive dashboards</li><li><strong>Excel:</strong> Advanced analysis and visualization</li><li><strong>Workflow Automation:</strong> KNIME for data processing pipelines</li><li><strong>Data Visualization:</strong> Communicating complex data effectively</li><li><strong>Business Intelligence:</strong> Identifying trends and KPIs</li></ul>' },
        'ml-expertise': { type: 'detail', logo: null, title: 'ML Engineering Expertise', company: 'Core Competencies', description: '<p>Focusing on the practical deployment and optimization of ML models:</p><ul><li><strong>Model Optimization:</strong> Performance tuning, efficiency improvements</li><li><strong>Feature Engineering:</strong> Creating and selecting relevant features</li><li><strong>Deployment Strategies:</strong> Packaging and deploying models</li><li><strong>Production Systems:</strong> Understanding the ML lifecycle</li><li><strong>Monitoring & Maintenance:</strong> Tracking performance and retraining</li><li><strong>Frameworks:</strong> Scikit-learn, TensorFlow, Keras</li></ul>' },

         // --- "More" Modal ---
        'more': {
            type: 'detail', logo: null, title: 'Continuous Learning', company: 'A Lifelong Pursuit',
            description: `<p>I'm constantly developing myself. Reach out if you'd like to know more!</p>
                          <blockquote style="border-left: 3px solid var(--primary); padding-left: 1rem; margin-top: 1.5rem; font-style: italic; color: var(--text-light);">
                              "Learning never exhausts the mind."<br>
                              <small style="display: block; margin-top: 0.5rem;">— Leonardo da Vinci</small>
                          </blockquote>`,
            cta: `<a href="contact.html" class="btn btn-secondary clickable">Reach Out</a>`
        }
    }; // End of modalData

    // --- Service Modal Data (Separate for clarity) ---
     const serviceModalData = {
         'event-managing': { type:'service', icon: '🎯', title: 'Event Management Service', description: 'Let me help you plan and execute successful tech events, workshops, and community gatherings. From concept to completion, I ensure seamless event organization.', ctaText: 'Plan Your Event', ctaLink: 'contact.html?service=event-managing' },
         'agents-building': { type:'service', icon: '🤖', title: 'AI Agents Development', description: 'Custom AI agents tailored to your business needs. Automation, customer service, data processing - let\'s build intelligent solutions together.', ctaText: 'Build Your Agent', ctaLink: 'contact.html?service=ai-agents' },
         'workshops': { type:'service', icon: '🎓', title: 'Workshops & Seminars', description: 'Interactive learning experiences on AI, ML, and Data Science. Customized workshops for students, professionals, and organizations.', ctaText: 'Request Workshop', ctaLink: 'contact.html?service=workshops' },
         'predictive-modeling': { type:'service', icon: '📈', title: 'Predictive Modeling Service', description: 'Leverage machine learning for business forecasting and data-driven insights. Custom models for your specific use cases and datasets.', ctaText: 'Analyze Your Data', ctaLink: 'contact.html?service=predictive-modeling' },
         'custom-chatbots': { type:'service', icon: '💬', title: 'Custom Chatbot Development', description: 'Intelligent chatbot solutions for customer support, lead generation, and business automation. Powered by latest AI technologies.', ctaText: 'Discuss Your Chatbot', ctaLink: 'contact.html?service=custom-chatbots' },
         'data-analyst': { type:'service', icon: '📊', title: 'Data Analysis Service', description: 'Comprehensive data analysis, visualization, and business intelligence. Transform your raw data into actionable insights and strategic decisions.', ctaText: 'Analyze Your Data', ctaLink: 'contact.html?service=data-analysis' }
     };

    // --- Modal DOM Elements ---
    const modalOverlay = document.getElementById('modal-overlay');
    const modalContent = document.getElementById('modal-content');

    // --- Modal Open Function ---
    function openModal(data, modalType = 'project') { // Default to project, override with data.type
         if (!modalOverlay || !modalContent) return;
         let contentHTML = '';
         const closeButtonHTML = `<button class="modal-close clickable" id="modal-close-dynamic">&times;</button>`;
         const effectiveType = data.type || modalType;

         if (effectiveType === 'detail') {
             const logoHTML = data.logo ? `<img src="${data.logo}" alt="${data.company || data.title} Logo" class="detail-modal-logo" onerror="this.style.display='none';"/>` : '';
             const linkHTML = data.linkHref && !data.cta ? `<a href="${data.linkHref}" ${data.linkHref !== '#' ? 'target="_blank" rel="noopener noreferrer"' : ''} class="btn btn-secondary clickable">${data.linkText || 'Visit Website'}</a>` : '';
             const ctaHTML = data.cta ? data.cta.replace(/class="btn /g, 'class="btn clickable ') : '';
             contentHTML = `${closeButtonHTML}<div class="detail-modal-header">${logoHTML}<div class="detail-modal-title"><h3>${data.title}</h3>${data.company ? `<h4>${data.company}</h4>` : ''}</div></div><div class="detail-modal-body">${data.description || ''}</div>${ctaHTML || linkHTML ? `<div class="modal-cta-group">${ctaHTML || ''}${linkHTML}</div>` : ''}`;
         }
         else if (effectiveType === 'service') {
              contentHTML = `${closeButtonHTML}<div class="service-modal-content"><div class="service-modal-icon">${data.icon}</div><h2 class="service-modal-title">${data.title}</h2><p class="service-modal-description">${data.description}</p><a href="${data.ctaLink}" class="service-modal-cta btn btn-primary clickable">${data.ctaText}</a></div>`;
         }
         else { // Project Modal Type (Default)
             const ctaHTML = data.cta ? data.cta.replace(/class="btn /g, 'class="btn clickable ') : '';
             contentHTML = `${closeButtonHTML}<img src="${data.image}" alt="${data.title}" class="modal-image" onerror="this.src='https://via.placeholder.com/650x350/4F46E5/FFFFFF?text=${encodeURIComponent(data.title)}'; this.style.objectFit='contain';"><h2 class="modal-title">${data.title}</h2><p class="modal-description">${data.description || ''}</p>${data.tech ? `<div class="modal-tech">${data.tech.map(t => `<span>${t}</span>`).join('')}</div>` : ''}${ctaHTML ? `<div class="modal-cta-group">${ctaHTML}</div>` : ''}`;
         }

         modalContent.innerHTML = contentHTML;
         const newCloseButton = modalContent.querySelector('#modal-close-dynamic');
         if (newCloseButton) newCloseButton.addEventListener('click', closeModal);

         modalOverlay.classList.add('active');
         document.body.classList.add('no-scroll');
         document.documentElement.classList.add('no-scroll');
         if (window.pauseCanvasAnimation) window.pauseCanvasAnimation();
    }

    // --- Modal Close Function ---
    function closeModal() {
         if (!modalOverlay) return;
        modalOverlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
        document.documentElement.classList.remove('no-scroll');
        if (window.resumeCanvasAnimation) window.resumeCanvasAnimation();
        
        // Clear content after fade out animation completes
        const handleTransitionEnd = () => {
             if (!modalOverlay.classList.contains('active')) {
                 modalContent.innerHTML = '';
                 modalOverlay.removeEventListener('transitionend', handleTransitionEnd); // Clean up listener
             }
        };
        modalOverlay.addEventListener('transitionend', handleTransitionEnd);
         
         // Fallback timeout in case transitionend doesn't fire (e.g., if animation is interrupted)
         setTimeout(() => {
             if (!modalOverlay.classList.contains('active')) {
                 modalContent.innerHTML = '';
             }
         }, 350); // Duration slightly longer than CSS transition
    }

    // --- Modal Event Delegation (Main listener) ---
    if (modalOverlay && modalContent) {
        document.body.addEventListener('click', (e) => {
             const modalTrigger = e.target.closest('[data-modal-key]');
             const serviceTrigger = e.target.closest('.service-card[data-service]');
             let triggerElement = null, key = null, type = 'project';

             if (modalTrigger) {
                 triggerElement = modalTrigger;
                 key = modalTrigger.getAttribute('data-modal-key');
                 type = modalData[key]?.type || 'project'; // Infer type
             } else if (serviceTrigger) {
                 triggerElement = serviceTrigger;
                 key = serviceTrigger.getAttribute('data-service');
                 type = 'service'; // Explicit type
             }

             if (triggerElement && key) {
                 // Prevent triggering if a link/button *inside* the card was clicked (unless it's the card itself)
                 if (e.target.closest('a, button') && e.target !== triggerElement && triggerElement.contains(e.target)) {
                     // Check if the clicked link/button is NOT the modal trigger itself
                     if (!e.target.closest('[data-modal-key]') && !e.target.closest('[data-service]')) {
                          return; // It was an internal link, don't open modal
                     }
                 }

                 const dataToOpen = (type === 'service') ? serviceModalData[key] : modalData[key];
                 if (dataToOpen) openModal(dataToOpen, type);
                 else console.warn(`Modal data not found for key: ${key} and type: ${type}`);
             }
        });

        modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modalOverlay.classList.contains('active')) closeModal(); });
    } // End modal system check


    // ==========================================
    // SMOOTH SCROLL FOR HASH LINKS
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.length > 1) { // Ensure it's not just "#"
                const targetId = href.substring(1);
                const target = document.getElementById(targetId);
                if (target) {
                    e.preventDefault(); // Prevent default jump only if target exists
                    const navHeight = navbar ? navbar.offsetHeight : 0;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20; // 20px offset

                    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                    // Mobile menu closing is handled by the navItems click listener
                }
            }
        });
    });

    // ==========================================
    // SCROLLER SECTION (Infinite Loop)
    // ==========================================
    const scrollers = document.querySelectorAll(".scroller");
    if (scrollers.length > 0 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        scrollers.forEach(scroller => {
             if(scroller.getAttribute("data-animated")) return; // Prevent re-initializing
             scroller.setAttribute("data-animated", true);

             const scrollerInner = scroller.querySelector('.scroller-inner');
             if(scrollerInner) {
                 const scrollerContent = Array.from(scrollerInner.children);
                 if (scrollerContent.length > 0) { // Only duplicate if content exists
                     scrollerContent.forEach(item => {
                         const duplicatedItem = item.cloneNode(true);
                         duplicatedItem.setAttribute('aria-hidden', true);
                         scrollerInner.appendChild(duplicatedItem);
                     });
                 }
             }
        });
    }

    // ==========================================
    // BACK TO TOP BUTTON
    // ==========================================
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', debounce(() => {
            backToTopBtn.classList.toggle('visible', window.scrollY > 500);
        }, 100));
        // Smooth scroll is handled by the general smooth scroll logic
    }

}); // End DOMContentLoaded

