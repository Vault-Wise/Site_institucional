DROP DATABASE IF EXISTS VaultWise;
CREATE DATABASE VaultWise;

USE VaultWise;


CREATE TABLE Empresa (
    idEmpresa INT PRIMARY KEY AUTO_INCREMENT,
    cep CHAR(8) NOT NULL,
    numero INT NOT NULL,
    razaoSocial VARCHAR(80) NOT NULL,
    telefone CHAR(11) UNIQUE NOT NULL,
    cnpj CHAR(14) UNIQUE NOT NULL,
    codigoEmpresa CHAR(6) NOT NULL
);


CREATE TABLE Funcionario (
    idFuncionario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(80) NOT NULL,
    email VARCHAR(60) UNIQUE NOT NULL,
    telefone CHAR(11) UNIQUE NOT NULL,
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
	nomeEquipamento VARCHAR(60) NOT NULL,
    sistemaOperacional VARCHAR(60) NOT NULL,
    memoriaTotal DECIMAL(8,2) NOT NULL,
    freqMaxProcessador DECIMAL(8,2) NOT NULL,
    fkAgencia INT NOT NULL,
    CONSTRAINT fkCaixaAgencia FOREIGN KEY (fkAgencia) REFERENCES Agencia (idAgencia)
);


CREATE TABLE Registro (
    idRegistro INT AUTO_INCREMENT,
    dtHora DATETIME DEFAULT CURRENT_TIMESTAMP,
    percentMemoria DECIMAL(5,2) NOT NULL,
    percentProcessador DECIMAL(5,2) NOT NULL,
    memoriaUsada DECIMAL(8,2) NOT NULL,
    freqProcessador DECIMAL(8,2) NOT NULL,
    velocidadeUpload DECIMAL(8,2) NOT NULL,
    velocidadeDownload DECIMAL(8,2) NOT NULL,
    tempoAtividade FLOAT,
    fkCaixa INT NOT NULL,
    PRIMARY KEY (idRegistro, fkCaixa),
    CONSTRAINT fkRegistroCaixaEletronico FOREIGN KEY (fkCaixa) REFERENCES CaixaEletronico (idCaixa)
);

CREATE TABLE Processo (
    idProcesso INT AUTO_INCREMENT,	
    nome VARCHAR(90),
    percentMemoria DECIMAL(5, 2),
    percentProcessador DECIMAL(5, 2),
    dtHora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fkRegistro INT NOT NULL,
    fkCaixa INT NOT NULL,
    CONSTRAINT fkProcessoRegistro FOREIGN KEY (fkRegistro , fkCaixa) REFERENCES Registro (idRegistro , fkCaixa),
    PRIMARY KEY (idProcesso, fkRegistro, fkCaixa)
);

CREATE TABLE PID (
	idPID INT PRIMARY KEY AUTO_INCREMENT,
    numeroPID VARCHAR(20),
    nivelAmeaca INT,
    fkProcesso INT,
    fkRegistro INT, 
    fkCaixa INT,
    CONSTRAINT fkPIDProcesso FOREIGN KEY (fkProcesso, fkRegistro, fkCaixa) REFERENCES Processo (idProcesso, fkRegistro, fkCaixa)
);

CREATE TABLE Alerta (
    idAlerta INT AUTO_INCREMENT,
    tipo VARCHAR(60) NOT NULL,
    descricao VARCHAR(180) NOT NULL,
    dtHora DATETIME DEFAULT CURRENT_TIMESTAMP,
    fkRegistro INT NOT NULL,
    fkCaixa INT NOT NULL,
    PRIMARY KEY (idAlerta, fkRegistro, fkCaixa),
    CONSTRAINT fkAlertaRegistro FOREIGN KEY (fkRegistro , fkCaixa) REFERENCES Registro (idRegistro , fkCaixa)  
);

CREATE TABLE ChaveGemini (
	idChave INT PRIMARY KEY AUTO_INCREMENT,
    chave VARCHAR(900)
);

INSERT INTO ChaveGemini VALUES (DEFAULT, 'AIzaSyBab9g59_JDt2uYNrxAoTn3tHOjqpN-f-g');

CREATE VIEW dashPresilli AS 
SELECT dtHora, percentMemoria, percentProcessador AS percentCPU, fkCaixa 
FROM Registro;