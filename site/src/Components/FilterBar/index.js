import './index.scss';

function FilterBar() {
    return (
        <div className="filter-bar">
            <button className="btn">Encerrando</button>
            <button className="btn">Mais Filtros</button>
            <div className="search-box">
                <input type="text" placeholder="Busque uma vaga por nome" />
                <button className="search-btn">🔍</button>
            </div>
        </div>
    );
}

export default FilterBar;
