'use client'
import React, { useState } from "react";
const ApiForm: React.FC = () => {
  const [requestType, setRequestType] = useState("GET");
  const [dataType, setDataType] = useState("conquistas");
  const [response, setResponse] = useState("");
  const [formData, setFormData] = useState({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const url = "https://apiverbix.netlify.app/api";
    const endpoint = `${url}/${dataType}`;
    console.log('start')
    console.log('formData:', formData); 

    try {
      const options: RequestInit = {
        method: requestType,
        headers: {
          "Content-Type": "application/json",
        },
      };
      console.log('1')

      if (requestType === "POST" || requestType === "DELETE") {
        options.body = JSON.stringify(formData);
      }
      console.log('2')

      const res = await fetch(endpoint, options);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      console.log('3')

      const result = await res.json();
      console.log('4')
      setResponse(JSON.stringify(result, null, 2));
      console.log('5')
    } catch (error) {
      setResponse(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
      console.log('Erro')
    }
  };

  const renderFields = () => {
    if(requestType == 'POST'){
    switch (dataType) {
      case "conquistas":
        return (
          <>
            <input name="title" placeholder="Título" onChange={handleInputChange} />
            <input name="descricao" placeholder="Descrição" onChange={handleInputChange} />
            <input name="meta" placeholder="Meta" onChange={handleInputChange} />
          </>
        );
      case "personagens":
        return (
          <>
            <input name="nome" placeholder="Nome" onChange={handleInputChange} />
            <input name="tipo" placeholder="Tipo" onChange={handleInputChange} />
            <input name="descricao" placeholder="Descrição" onChange={handleInputChange} />
            <input name="imgs" placeholder="Imagens (separadas por vírgula)" onChange={handleInputChange} />
          </>
        );
      case "postagens":
        return (
          <>
           <input type="date" name="dtcadastro" placeholder="Data de cadastro" onChange={handleInputChange} />
            <input name="title" placeholder="Título" onChange={handleInputChange} />
            <input name="content" placeholder="Conteúdo" onChange={handleInputChange} />
            <input name="author" placeholder="Autor" onChange={handleInputChange} />
          </>
        );
      case "usuario":
        return (
          <>
            <input name="username" placeholder="Username" onChange={handleInputChange} />
            <input name="email" placeholder="Email" onChange={handleInputChange} />
            <input name="password" placeholder="Senha" onChange={handleInputChange} />
          </>
        );
      case "missoes":
        return (
          <>
            <input name="username" placeholder="Username" onChange={handleInputChange} />
            <input name="title" placeholder="Título" onChange={handleInputChange} />
            <input name="tipo" placeholder="Tipo" onChange={handleInputChange} />
            <input type="number" name="meta" placeholder="Meta" onChange={handleInputChange} />
            <input type="date" name="dtinicio" placeholder="Data de Início" onChange={handleInputChange} />
            <input type="date" name="dtfim" placeholder="Data de Fim" onChange={handleInputChange} />
            <input type="number" name="progresso" placeholder="Progresso" onChange={handleInputChange} />
          </>
        );
      default:
        return null;
    }
  }
  switch (dataType) {
    case "conquistas":
      return (
        <>
          <input name="id" placeholder="Id" onChange={handleInputChange} />
        </>
      );
    case "personagens":
      return (
        <>
          <input name="nome" placeholder="Nome" onChange={handleInputChange} />
        </>
      );
    case "postagens":
      return (
        <>
          <input name="id" placeholder="Id" onChange={handleInputChange} />
        </>
      );
    case "usuario":
      return (
        <>
          <input name="users" placeholder="Username" onChange={handleInputChange} />
        </>
      );
    case "missoes":
      return (
        <>
          <input name="id" placeholder="Id" onChange={handleInputChange} />
        </>
      );
    default:
      return null;
  }
  };

  return (
    <div style={{ margin: "20px" }}>
      <h1>API Tester</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "400px",
        }}
      >
        <label>
          Tipo de Requisição:
          <select
            value={requestType}
            onChange={(e) => setRequestType(e.target.value)}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="DELETE">DELETE</option>
          </select>
        </label>
        <label>
          Tipo de Cadastro:
          <select
            value={dataType}
            onChange={(e) => {
              setDataType(e.target.value);
              setFormData({});
            }}
          >
            <option value="conquistas">Conquistas</option>
            <option value="personagens">Personagens</option>
            <option value="postagens">Postagens</option>
            <option value="usuario">Usuários</option>
            <option value="missoes">Missões</option>
          </select>
        </label>
        {renderFields()}
        <button type="submit">Enviar</button>
      </form>
      <div style={{ marginTop: "20px" }}>
        <h2>Resposta:</h2>
        <pre
          style={{
            backgroundColor: "#f4f4f4",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          {response}
        </pre>
      </div>
    </div>
  );
};

export default ApiForm;
