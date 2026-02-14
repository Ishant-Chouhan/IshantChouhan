import Header from './Header';
import Footer from './Footer';
import Cursor from '../ui/Cursor';

const Layout = ({ children }) => {
    return (
        <>
            <Cursor />
            <div className="scanlines"></div>
            <Header />
            <main style={{ minHeight: '100vh', paddingTop: 'var(--space-16)' }}>
                {children}
            </main>
            <Footer />
        </>
    );
};

export default Layout;
