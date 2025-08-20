import './index.scss';
import Header from "../../Components/Header/index.js";
import Footer from "../../Components/Footer/index.js";
import CardVaga from '../../Components/CardProfissional/index.js';
import CardEmpresa from '../../Components/CardEmpresa/index.js';

function LandingPage() {
    return (
        <main>
            <Header />
            <CardVaga />
            <CardEmpresa />
            <Footer />
        </main>
    );
}

export default LandingPage;