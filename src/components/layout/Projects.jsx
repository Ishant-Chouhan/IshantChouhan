import { motion } from 'framer-motion';
import SectionReveal from '../ui/SectionReveal';
import { projects } from '../../data/projects';
import './Projects.css';

const Projects = () => {
    return (
        <section
            className="projects-section"
            id="projects"
        >
            <SectionReveal>
                <div className="projects-header">
                    <h2 className="section-title">Projects</h2>
                    <span className="project-count">({projects.length})</span>
                </div>
            </SectionReveal>

            <div className="projects-list">
                {projects.map((project, index) => {
                    const Wrapper = project.link ? 'a' : 'div';
                    const wrapperProps = project.link ? {
                        href: project.link,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        style: { textDecoration: 'none', color: 'inherit', display: 'flex' } // Inline override to ensure flex behavior
                    } : {};

                    return (
                        <SectionReveal key={project.id} delay={index * 0.1}>
                            <Wrapper
                                className="project-row"
                                {...wrapperProps}
                            >
                                <div className="project-row-left">
                                    <span className="project-index">0{index + 1}</span>
                                    <h3 className="project-title">{project.title}</h3>
                                </div>
                                <div className="project-row-right">
                                    <span className="project-category">{project.category}</span>
                                    <span className="project-year">{project.year}</span>
                                    <motion.span
                                        className="project-arrow"
                                        initial={{ opacity: 0, x: -10 }}
                                        whileHover={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </motion.span>
                                </div>
                            </Wrapper>
                        </SectionReveal>
                    );
                })}
            </div>
        </section>
    );
};

export default Projects;
