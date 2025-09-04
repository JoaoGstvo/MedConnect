import './index.scss';

import CardArtigo from '../../Components/CardArtigo';

function ArtigoPage() {
    return (
        <main className='artigos-page'>
            <section className='intro'>
                <div className='title'>
                    <h1>Feed de Publicações</h1>
                    <p>Estudos, artigos e opiniões da comunidade médica.</p>
                </div>
            </section>

            <section className='article-lista'>
                <CardArtigo />
                <CardArtigo />
                <CardArtigo />
            </section>
        </main>
    );
}

export default ArtigoPage; 