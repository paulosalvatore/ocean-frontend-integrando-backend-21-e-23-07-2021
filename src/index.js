import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./index.css";

/*
CRUD (Create, Read (Single & All), Update, Delete)

Create -> Formulário de criação
Read All -> Listagem de itens cadastrados
Read Single -> Visualização de um item específico
Update -> Formulário de edição
Delete -> Remover um item específico
*/

function Item(props) {
    const item = props.item;

    return (
        <a href={"/visualizar/" + item._id}>
            <div className="item">
                <h1 className="item__title">{item.nome}</h1>
                <img src={item.imagemUrl} alt={item.nome} width="200" />
            </div>
        </a>
    );
}

function Lista() {
    console.log("Lista carregada.");

    // useState
    const [listaResultadoApi, atualizarListaResultadoApi] = useState("");

    // useEffect
    useEffect(() => {
        console.log({ listaResultadoApi });

        if (!listaResultadoApi) {
            obterResultado();
        }
    });

    // Declaramos a função para obter resultados
    const obterResultado = async () => {
        console.log("Obter resultado");

        // Fazemos a requisição no Backend
        const resultado = await fetch(
            "https://backend-flexivel.herokuapp.com",
            {
                headers: new Headers({
                    Authorization: "profpaulo.salvatore@gmail.com",
                }),
            }
        );

        console.log({ resultado });

        const dados = await resultado.json();

        console.log({ dados });

        atualizarListaResultadoApi(dados);
    };

    if (!listaResultadoApi) {
        return <div>Carregando...</div>;
    }

    return (
        <div className="lista">
            {listaResultadoApi.map((item, index) => (
                <Item item={item} key={index} />
            ))}
        </div>
    );
}

function Header() {
    return (
        <header className="header">
            <a href="/">
                <img
                    src="https://www.oceanbrasil.com/img/general/logoOceanI.png"
                    alt="Samsung Ocean"
                    width="300"
                />
            </a>

            <a href="/adicionar">Adicionar item</a>
        </header>
    );
}

function Footer() {
    return <footer className="footer">Todos os direitos reservados.</footer>;
}

function ListarItens() {
    return (
        <div>
            <Lista />
        </div>
    );
}

function VisualizarItem(props) {
    const id = props.match.params.id;

    /*
    useState e useEffect
    Fazer uma nova requisição
    Usar o fetch
    async/await
    */

    const [item, setItem] = useState("");

    useEffect(() => {
        if (!item) {
            getItemData();
        }
    });

    const getItemData = async () => {
        console.log("Get Item Data", id);

        const resultado = await fetch(
            "https://backend-flexivel.herokuapp.com/" + id,
            {
                headers: new Headers({
                    Authorization: "profpaulo.salvatore@gmail.com",
                }),
            }
        );

        const dados = await resultado.json();

        setItem(dados);
    };

    return (
        <div>
            <Item item={item} />
        </div>
    );
}

function AdicionarItem(props) {
    const handleSubmit = async event => {
        event.preventDefault();

        const nome = event.target.nome.value;
        const imagemUrl = event.target.imagemUrl.value;

        const dados = {
            nome,
            imagemUrl,
        };

        const dadosEmJson = JSON.stringify(dados);

        console.log(dados, dadosEmJson);

        /*
        fetchão?
        async/await
        route nova?
        Como fazer ser verbo POST? Pq até então a gente só tinha GET
        Já temos o JSON. passar "dados" na URL
        Informar Headers
        Validar se deu bom ou se deu ruim
        */

        const resultado = await fetch(
            "https://backend-flexivel.herokuapp.com/",
            {
                headers: new Headers({
                    Authorization: "profpaulo.salvatore@gmail.com",
                    "Content-Type": "application/json",
                }),
                method: "POST",
                body: dadosEmJson,
            }
        );

        console.log(resultado);

        const jsonResultado = await resultado.json();

        console.log(jsonResultado);

        props.history.push("/visualizar/" + jsonResultado._id);
    };

    return (
        <div>
            <form className="form" onSubmit={handleSubmit}>
                <label htmlFor="nome" className="form__label">Nome:</label>
                <br />

                <input type="text" id="nome" name="nome" className="form__input" />
                <br />

                <label htmlFor="imagemUrl" className="form__label">URL da Imagem:</label>
                <br />

                <input type="text" id="imagemUrl" name="imagemUrl" className="form__input" />
                <br />

                <input type="submit" value="Adicionar" className="form__submit" />
            </form>
        </div>
    );
}

function App() {
    return (
        <div className="app">
            <Header />
            <Switch>
                <Route path="/" exact={true} component={ListarItens} />

                <Route path="/visualizar/:id" component={VisualizarItem} />

                <Route path="/adicionar" component={AdicionarItem} />
            </Switch>
            <Footer />
        </div>
    );
}

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById("root")
);
