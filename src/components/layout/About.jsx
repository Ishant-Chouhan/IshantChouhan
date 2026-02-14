import { motion } from 'framer-motion';
import { useCursor } from '../../context/CursorContext';
import SectionReveal from '../ui/SectionReveal';
import './About.css';

const About = () => {
    const { setCursorType } = useCursor();

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 }
    };

    return (
        <section className="about-section" id="about">
            <div className="about-content">
                <SectionReveal>
                    <motion.h2>About</motion.h2>
                </SectionReveal>

                <div className="about-text">
                    <SectionReveal delay={0.2}>
                        <motion.p onMouseEnter={() => setCursorType('text')} onMouseLeave={() => setCursorType('default')}>
                            I am a final-year Computer Science undergraduate specializing in AI/ML engineering. My passion lies in building scalable backend systems, optimizing machine learning workflows, and developing advanced LLM-based applications. With hands-on experience in data drift analysis, fraud detection systems, and RAG architectures, I strive to bridge the gap between theoretical AI concepts and production-ready solutions.
                        </motion.p>
                    </SectionReveal>

                    <SectionReveal delay={0.3}>
                        <motion.div className="resume-section glass-panel">
                            <h3>Education</h3>
                            <div className="resume-item">
                                <h4>Oriental Institute of Science and Technology, Bhopal</h4>
                                <span>Bachelor of Technology (B.Tech) in CSE | 2022 – 2026</span>
                            </div>
                        </motion.div>

                        <motion.div className="resume-section glass-panel">
                            <h3>Experience</h3>
                            <div className="resume-item">
                                <h4>
                                    <a href={`${import.meta.env.BASE_URL}certifications/Decode_Data_Offer_Letter.pdf`} target="_blank" rel="noopener noreferrer" className="experience-link">
                                        AI/ML Intern @ Decode Data Academy
                                    </a>
                                </h4>
                                <span>Nov 2025 – Present</span>
                                <p>• Built backend workflows for data-drift analysis using Evidently AI, generating production-ready reports.</p>
                                <p>• Implemented a backend model evaluation service for deterministic, explainable scoring.</p>
                                <p>• Contributed to expert-level ML dataset creation for Claude Opus 4.5 evaluation.</p>
                            </div>
                            <div className="resume-item">
                                <h4>
                                    <a href={`${import.meta.env.BASE_URL}certifications/Zaalima_developments_internship.pdf`} target="_blank" rel="noopener noreferrer" className="experience-link">
                                        Data Science Intern @ Zaalima Development
                                    </a>
                                </h4>
                                <span>Apr 2025 – Aug 2025</span>
                                <p>• Developed an Online Payment Fraud Detection system with 98.95% accuracy.</p>
                                <p>• Built an E-Commerce Fraud Detection model achieving 90.24% accuracy.</p>
                                <p>• Led two teams in requirements gathering and project coordination.</p>
                            </div>
                        </motion.div>
                    </SectionReveal>

                    <SectionReveal delay={0.4}>
                        <motion.div className="resume-section glass-panel">
                            <h3>Certifications</h3>
                            <div className="resume-item certifications-list">
                                <a href={`${import.meta.env.BASE_URL}certifications/Amazon_ML_Summer_School.pdf`} target="_blank" rel="noopener noreferrer" className="certification-link">
                                    • Amazon ML Summer School (Aug 2025)
                                </a>
                                <a href={`${import.meta.env.BASE_URL}certifications/python_essentials_1.pdf`} target="_blank" rel="noopener noreferrer" className="certification-link">
                                    • Python Essentials 1 – Cisco (June 2024)
                                </a>
                                <a href={`${import.meta.env.BASE_URL}certifications/python_essentials_2.pdf`} target="_blank" rel="noopener noreferrer" className="certification-link">
                                    • Python Essentials 2 – Cisco (June 2024)
                                </a>
                                <a href={`${import.meta.env.BASE_URL}certifications/Python%20Demonstrations%20For%20Practice%20Course.pdf`} target="_blank" rel="noopener noreferrer" className="certification-link">
                                    • Python Demonstrations for Practice Course – Udemy (March 2024)
                                </a>
                            </div>
                        </motion.div>

                        <motion.div className="resume-section glass-panel">
                            <h3>Skills</h3>
                            <div className="skills-grid">
                                <span>Python</span>
                                <span>SQL</span>
                                <span>Pandas</span>
                                <span>NumPy</span>
                                <span>Scikit-learn</span>
                                <span>TensorFlow</span>
                                <span>Deep Learning</span>
                                <span>LLMs</span>
                                <span>RAG</span>
                                <span>MySQL</span>
                                <span>Power BI</span>
                                <span>Git</span>
                            </div>
                        </motion.div>
                    </SectionReveal>
                </div>
            </div>
        </section>
    );
};

export default About;
