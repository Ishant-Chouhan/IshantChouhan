import { motion } from 'framer-motion';
import { useCursor } from '../../context/CursorContext';
import './Header.css';

const Header = () => {
    const { setCursorType } = useCursor();

    const handleMouseEnter = () => setCursorType('hover');
    const handleMouseLeave = () => setCursorType('default');

    return (
        <motion.header
            className="header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
            <div className="logo" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <a href="#">ISHANT</a>
            </div>
            <nav className="nav">
                {['Projects', 'About', 'Contact'].map((item) => (
                    <a
                        key={item}
                        href={`#${item.toLowerCase()}`}
                        className="nav-link"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        {item}
                    </a>
                ))}
            </nav>
        </motion.header>
    );
};

export default Header;
