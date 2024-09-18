DROP DATABASE IF EXISTS VaultWise;
CREATE DATABASE VaultWise;

USE VaultWise;


CREATE TABLE Empresa (
    idEmpresa INT PRIMARY KEY AUTO_INCREMENT,
    cep CHAR(8) NOT NULL,
    numero INT NOT NULL,
    razaoSocial VARCHAR(60) NOT NULL,
    telefone CHAR(9) UNIQUE NOT NULL,
    cnpj CHAR(14) UNIQUE NOT NULL,
    codigoEmpresa CHAR(6) NOT NULL
);


CREATE TABLE Funcionario (
    idFuncionario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(80) NOT NULL,
    email VARCHAR(60) UNIQUE NOT NULL,
    telefone CHAR(9) UNIQUE NOT NULL,
    cargo VARCHAR(60) NOT NULL,
    senha VARCHAR(60) NOT NULL,
    cpf CHAR(11) UNIQUE NOT NULL,
    fkEmpresa INT NOT NULL,
    CONSTRAINT fkFuncionarioEmpresa FOREIGN KEY (fkEmpresa) REFERENCES Empresa (idEmpresa)
);


CREATE TABLE Agencia (
    idAgencia INT PRIMARY KEY AUTO_INCREMENT,
    cep CHAR(8) NOT NULL,
    numero INT NOT NULL,
    fkEmpresa INT NOT NULL,
    CONSTRAINT fkAgenciaEmpresa FOREIGN KEY (fkEmpresa) REFERENCES Empresa (idEmpresa)
);


CREATE TABLE CaixaEletronico (
    idCaixa INT PRIMARY KEY AUTO_INCREMENT,
    sistemaOperacional VARCHAR(60) NOT NULL,
    memoriaTotal DECIMAL(8,2) NOT NULL,
    discoTotal DECIMAL(8,2) NOT NULL,
    nomeEquipamento VARCHAR(60) NOT NULL,
    freqMaxProcessador DECIMAL(8,2) NOT NULL,
    fkAgencia INT NOT NULL,
    CONSTRAINT fkCaixaAgencia FOREIGN KEY (fkAgencia) REFERENCES Agencia (idAgencia)
);


CREATE TABLE Registro (
    idRegistro INT AUTO_INCREMENT,
    percentDisco DECIMAL(5,2) NOT NULL,
    percentMemoria DECIMAL(5,2) NOT NULL,
    percentProcessador DECIMAL(5,2) NOT NULL,
    memoriaUsada DECIMAL(8,2) NOT NULL,
    discoUsada DECIMAL(8,2) NOT NULL,
    freqProcessador DECIMAL(8,2) NOT NULL,
    fkCaixa INT NOT NULL,
    PRIMARY KEY (idRegistro, fkCaixa),
    CONSTRAINT fkRegistroCaixaEletronico FOREIGN KEY (fkCaixa) REFERENCES CaixaEletronico (idCaixa)
);


CREATE TABLE Alerta (
    idAlerta INT AUTO_INCREMENT,
    tipo VARCHAR(60) NOT NULL,
    descricao VARCHAR(180) NOT NULL,
    fkRegistro INT NOT NULL,
    fkCaixa INT NOT NULL,
    PRIMARY KEY (idAlerta, fkRegistro, fkCaixa),
    CONSTRAINT fkAlertaRegistro FOREIGN KEY (fkRegistro , fkCaixa) REFERENCES Registro (idRegistro , fkCaixa)  
);


CREATE TABLE Componente (
    idComponente INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(60) NOT NULL,
    unidadeMedida VARCHAR(50) NOT NULL
);


CREATE TABLE ListaComponentes (
	idListaComponentes INT AUTO_INCREMENT,
    fkCaixa INT NOT NULL,
    fkComponente INT NOT NULL,
    PRIMARY KEY (idListaComponentes, fkCaixa, fkComponente),
    CONSTRAINT fkCaixaListaComponente FOREIGN KEY (fkCaixa) REFERENCES CaixaEletronico (idCaixa),
    CONSTRAINT fkComponenteListaComponente FOREIGN KEY (fkComponente) REFERENCES Componente (idComponente)
);