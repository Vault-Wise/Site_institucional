-- Criação do banco de dados
DROP DATABASE IF EXISTS VaultWise;
CREATE DATABASE VaultWise;

-- Seleção do banco de dados
USE VaultWise;

-- Criação da tabela Empresa
CREATE TABLE Empresa (
    idEmpresa INT PRIMARY KEY AUTO_INCREMENT,
    cep CHAR(8) NOT NULL,
    numero INT NOT NULL,
    razaoSocial VARCHAR(80) NOT NULL,
    telefone CHAR(11) UNIQUE NOT NULL,
    cnpj CHAR(14) UNIQUE NOT NULL,
    codigoEmpresa CHAR(6) NOT NULL
);

-- Criação da tabela Funcionario
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

-- Criação da tabela Agencia
CREATE TABLE Agencia (
    idAgencia INT PRIMARY KEY AUTO_INCREMENT,
    cep CHAR(8) NOT NULL,
    numero INT NOT NULL,
    fkEmpresa INT NOT NULL,
    CONSTRAINT fkAgenciaEmpresa FOREIGN KEY (fkEmpresa) REFERENCES Empresa (idEmpresa)
);

-- Criação da tabela CaixaEletronico
CREATE TABLE CaixaEletronico (
    idCaixa INT PRIMARY KEY AUTO_INCREMENT,
    nomeEquipamento VARCHAR(60) NOT NULL,
    sistemaOperacional VARCHAR(60) NOT NULL,
    memoriaTotal DECIMAL(8,2) NOT NULL,
    freqMaxProcessador DECIMAL(8,2) NOT NULL,
    fkAgencia INT NOT NULL,
    CONSTRAINT fkCaixaAgencia FOREIGN KEY (fkAgencia) REFERENCES Agencia (idAgencia)
);

-- Criação da tabela Registro
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

-- Criação da tabela Alerta
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

-- Criação da view dashPresilli
CREATE VIEW dashPresilli AS 
SELECT dtHora, percentMemoria, percentProcessador, fkCaixa 
FROM Registro;

INSERT INTO Empresa VALUES (DEFAULT, '11111111', 123, 'Banco XPTO', '11111111111','abcdefghijklmn', 'AAAAAA');

INSERT INTO Funcionario VALUES (DEFAULT, 'Beatriz', 'beatriz@gmail.com', '11111111111', 'Chefe de Ciber Segurança', 'Senha@123', '11111111111', 1);

INSERT INTO Agencia VALUES (DEFAULT, '11111111', 123, 1); 
